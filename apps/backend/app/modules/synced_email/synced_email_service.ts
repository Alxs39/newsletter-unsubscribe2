import { inject } from '@adonisjs/core';
import { and, eq, inArray, isNull, sql } from 'drizzle-orm';
import { ImapFlow, FetchMessageObject } from 'imapflow';
import db from '#services/db';
import { ProviderAccountService } from '#modules/provider_account/provider_account_service';
import { syncedEmails } from '#modules/synced_email/synced_email.schema';
import CantConnectImapError from '#errors/cant_connect_imap_error';
import { EncryptionService } from '#services/encryption_service';

type SyncedEmail = typeof syncedEmails.$inferSelect;

@inject()
export class SyncedEmailService {
  constructor(
    private providerAccountService: ProviderAccountService,
    private readonly encryptionService: EncryptionService
  ) {}

  async sync(
    providerAccountId: number,
    userId: string
  ): Promise<{ synced: number; skipped: number }> {
    const credentials = await this.providerAccountService.findById({
      id: providerAccountId,
      userId,
    });

    const client = new ImapFlow({
      host: credentials.host,
      port: credentials.port,
      secure: credentials.useSsl,
      auth: {
        user: credentials.email,
        pass: this.encryptionService.decrypt(credentials.password),
      },
      logger: false,
    });

    try {
      await client.connect();

      const lock = await client.getMailboxLock('INBOX');

      try {
        const mailbox = client.mailbox;
        if (!mailbox) {
          return { synced: 0, skipped: 0 };
        }

        const currentUidValidity = mailbox.uidValidity ? Number(mailbox.uidValidity) : null;
        const currentHighestModseq = mailbox.highestModseq ? Number(mailbox.highestModseq) : null;
        const storedUidValidity = credentials.lastUidValidity;
        const storedHighestUid = credentials.lastHighestUid;
        const storedModSeq = credentials.lastModseq;

        const uidValidityChanged =
          storedUidValidity && currentUidValidity && storedUidValidity !== currentUidValidity;

        if (uidValidityChanged) {
          await this.invalidateAllSyncedEmails(providerAccountId);
        }

        const messages = await this.fetchMessages(client, {
          uidValidityChanged: !!uidValidityChanged,
          storedModSeq,
          storedHighestUid,
          storedUidValidity,
          currentUidValidity,
          uidNext: mailbox.uidNext ? Number(mailbox.uidNext) : null,
        });

        if (messages.length === 0) {
          await this.providerAccountService.updateSyncState(providerAccountId, {
            lastUidValidity: currentUidValidity,
            lastHighestUid: storedHighestUid,
            lastModseq: currentHighestModseq,
          });
          return { synced: 0, skipped: 0 };
        }

        const emailsToInsert = messages.map((msg) =>
          this.parseEmailForInsert(msg, providerAccountId)
        );
        const result = await db.insert(syncedEmails).values(emailsToInsert).onConflictDoNothing();

        const synced = result.rowCount ?? 0;
        const skipped = messages.length - synced;

        const newHighestUid = messages.reduce(
          (max, msg) => Math.max(max, msg.uid),
          storedHighestUid ?? 0
        );

        await this.providerAccountService.updateSyncState(providerAccountId, {
          lastUidValidity: currentUidValidity,
          lastHighestUid: newHighestUid,
          lastModseq: currentHighestModseq,
        });

        return { synced, skipped };
      } finally {
        lock.release();
      }
    } catch (error) {
      const imapError = error as { code?: string };
      if (imapError.code) {
        throw new CantConnectImapError(imapError.code);
      }
      throw error;
    } finally {
      client.close();
    }
  }

  async findAllByUserId(userId: string): Promise<SyncedEmail[]> {
    const accounts = await this.providerAccountService.findByUserId(userId);
    const accountIds = accounts.map((a) => a.id);

    if (accountIds.length === 0) {
      return [];
    }

    return db
      .select()
      .from(syncedEmails)
      .where(
        and(inArray(syncedEmails.providerAccountId, accountIds), isNull(syncedEmails.deletedAt))
      )
      .orderBy(syncedEmails.receivedAt);
  }

  private async fetchMessages(
    client: ImapFlow,
    opts: {
      uidValidityChanged: boolean;
      storedModSeq: number | null;
      storedHighestUid: number | null;
      storedUidValidity: number | null;
      currentUidValidity: number | null;
      uidNext: number | null;
    }
  ): Promise<FetchMessageObject[]> {
    const fetchQuery = {
      envelope: true,
      uid: true,
      headers: ['list-unsubscribe'],
    };

    // UIDVALIDITY changed: full refetch needed
    if (opts.uidValidityChanged) {
      return client.fetchAll('1:*', fetchQuery, { uid: true });
    }

    // CONDSTORE diff sync: only messages changed since last modseq
    const hasCondstore = client.enabled.has('CONDSTORE');
    if (hasCondstore && opts.storedModSeq) {
      return client.fetchAll('1:*', fetchQuery, {
        uid: true,
        changedSince: BigInt(opts.storedModSeq),
      });
    }

    // UID-based incremental: only new UIDs
    const canIncrementalUid =
      opts.storedHighestUid && opts.storedUidValidity === opts.currentUidValidity;

    if (canIncrementalUid) {
      if (opts.uidNext && opts.uidNext > opts.storedHighestUid!) {
        return client.fetchAll(`${opts.storedHighestUid! + 1}:*`, fetchQuery, { uid: true });
      }
      return [];
    } else {
      // First sync: full fetch
      return client.fetchAll('1:*', fetchQuery, { uid: true });
    }
  }

  private async invalidateAllSyncedEmails(providerAccountId: number): Promise<void> {
    await db
      .update(syncedEmails)
      .set({ deletedAt: sql`NOW()` })
      .where(
        and(eq(syncedEmails.providerAccountId, providerAccountId), isNull(syncedEmails.deletedAt))
      );
  }

  private extractUnsubscribeLink(msg: FetchMessageObject): string | null {
    const header = msg.headers?.toString() ?? '';
    const urls = [...header.matchAll(/<([^>]+)>/g)].map((m) => m[1]);
    return urls.find((url) => url.startsWith('http')) ?? urls[0] ?? null;
  }

  private parseEmailForInsert(
    msg: FetchMessageObject,
    providerAccountId: number
  ): typeof syncedEmails.$inferInsert {
    const envelope = msg.envelope;

    return {
      providerAccountId,
      messageId: envelope?.messageId ?? `unknown-${Date.now()}-${Math.random()}`,
      senderEmail: envelope?.from?.[0]?.address ?? 'unknown',
      senderName: envelope?.from?.[0]?.name ?? null,
      subject: envelope?.subject ?? null,
      unsubscribeLink: this.extractUnsubscribeLink(msg),
      receivedAt: envelope?.date ?? null,
    };
  }
}
