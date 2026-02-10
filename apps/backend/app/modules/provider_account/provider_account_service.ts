import { inject } from '@adonisjs/core';
import { and, eq, isNull, sql } from 'drizzle-orm';
import { ImapFlow } from 'imapflow';
import db from '#services/db';
import { EncryptionService } from '#services/encryption_service';
import { providerAccounts } from '#modules/provider_account/provider_account.schema';
import NotFoundError from '#errors/not_found_error';
import CantConnectImapError from '#errors/cant_connect_imap_error';
import ImapConfigService from '#modules/imap_config/imap_config_service';

type ProviderAccount = typeof providerAccounts.$inferSelect;

@inject()
export class ProviderAccountService {
  constructor(
    private readonly encryption: EncryptionService,
    private readonly imapConfigService: ImapConfigService
  ) {}

  async store({
    email,
    password,
    userId,
    imapConfigId,
  }: {
    email: string;
    password: string;
    userId: string;
    imapConfigId: number;
  }): Promise<void> {
    const config = await this.imapConfigService.findById(imapConfigId);

    await db.insert(providerAccounts).values({
      email,
      password: this.encryption.encrypt(password),
      imapConfigId,
      host: config.host,
      port: config.port,
      useSsl: config.useSsl,
      userId,
    });
  }

  async testImapConnection({
    email,
    password,
    host,
    port,
    useSsl,
  }: {
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
      host,
      port,
      secure: useSsl,
      auth: {
        user: email,
        pass: password,
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
      await client.logout();
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

  async updateSyncStatus(
    id: number,
    status: 'idle' | 'syncing' | 'failed',
    error?: string | null
  ): Promise<void> {
    await db
      .update(providerAccounts)
      .set({
        syncStatus: status,
        syncError: status === 'failed' ? (error ?? null) : null,
        ...(status === 'idle' ? { lastSyncAt: sql`NOW()` } : {}),
      })
      .where(eq(providerAccounts.id, id));
  }

  async resetStaleSyncStatuses(): Promise<void> {
    await db
      .update(providerAccounts)
      .set({
        syncStatus: 'failed',
        syncError: 'Server restarted during sync',
      })
      .where(eq(providerAccounts.syncStatus, 'syncing'));
  }
}
