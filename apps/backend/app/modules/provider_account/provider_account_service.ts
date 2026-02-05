import { inject } from '@adonisjs/core';
import { and, eq, isNull, sql } from 'drizzle-orm';
import { ImapFlow } from 'imapflow';
import db from '#services/db';
import { EncryptionService } from '#services/encryption_service';
import { providerAccounts } from '#modules/provider_account/provider_account.schema';
import NotFoundError from '#errors/not_found_error';
import CantConnectImapError from '#errors/cant_connect_imap_error';

type ProviderAccount = typeof providerAccounts.$inferSelect;

@inject()
export class ProviderAccountService {
  constructor(private encryption: EncryptionService) {}

  async store({
    email,
    password,
    userId,
  }: {
    email: string;
    password: string;
    userId: string;
  }): Promise<void> {
    const encryptedPassword = this.encryption.encrypt(password);

    await db.insert(providerAccounts).values({
      email,
      password: encryptedPassword,
      host: 'imap.mail.me.com',
      port: 993,
      useSsl: true,
      userId,
    });
  }

  async testImapConnection(credentials: {
    email: string;
    password: string;
    host: string;
    port: number;
    useSsl: boolean;
    lastUidValidity?: number | null;
    lastHighestUid?: number | null;
    lastModseq?: number | null;
  }): Promise<void> {
    const client = new ImapFlow({
      host: credentials.host,
      port: credentials.port,
      secure: credentials.useSsl,
      auth: {
        user: credentials.email,
        pass: credentials.password,
      },
      logger: false,
    });

    try {
      await client.connect();
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

  async findByUserId(userId: string): Promise<ProviderAccount[]> {
    return await db
      .select()
      .from(providerAccounts)
      .where(and(eq(providerAccounts.userId, userId), isNull(providerAccounts.deletedAt)));
  }

  async findById({ id, userId }: { id: number; userId: string }): Promise<ProviderAccount> {
    const [account] = await db
      .select()
      .from(providerAccounts)
      .where(
        and(
          eq(providerAccounts.id, id),
          eq(providerAccounts.userId, userId),
          isNull(providerAccounts.deletedAt)
        )
      )
      .limit(1);

    if (!account) {
      throw new NotFoundError();
    }

    return account;
  }

  async updateSyncState(
    id: number,
    syncState: {
      lastUidValidity: number | null;
      lastHighestUid: number | null;
      lastModseq?: number | null;
    }
  ): Promise<void> {
    await db
      .update(providerAccounts)
      .set({
        lastUidValidity: syncState.lastUidValidity,
        lastHighestUid: syncState.lastHighestUid,
        lastModseq: syncState.lastModseq ?? null,
        lastSyncAt: sql`NOW()`,
      })
      .where(eq(providerAccounts.id, id));
  }
}
