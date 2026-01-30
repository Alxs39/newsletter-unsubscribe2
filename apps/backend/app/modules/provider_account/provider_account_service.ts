import { inject } from '@adonisjs/core';
import { and, eq, isNull } from 'drizzle-orm';
import { ImapFlow } from 'imapflow';
import db from '#services/db';
import { EncryptionService } from '#services/encryption_service';
import { providerAccounts } from './provider_account.schema.js';

type ProviderAccount = typeof providerAccounts.$inferSelect;

interface ImapCredentials {
  email: string;
  password: string;
  host: string;
  port: number;
  useSsl: boolean;
}

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
      port: '993',
      useSsl: 'true',
      userId,
    });
  }

  async testImapConnection(credentials: ImapCredentials): Promise<void> {
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

    await client.connect();
    await client.logout();
  }

  async findByUserId(userId: string): Promise<ProviderAccount[]> {
    const accounts = await db
      .select()
      .from(providerAccounts)
      .where(and(eq(providerAccounts.userId, userId), isNull(providerAccounts.deletedAt)));

    return accounts.map((account: ProviderAccount) => {
      const decryptedPassword = this.encryption.decrypt(account.password);
      return { ...account, password: decryptedPassword };
    });
  }

  async findById(id: number, userId: string): Promise<ProviderAccount | null> {
    const [account] = await db
      .select()
      .from(providerAccounts)
      .where(
        and(
          eq(providerAccounts.id, id),
          eq(providerAccounts.userId, userId),
          isNull(providerAccounts.deletedAt)
        )
      );

    if (!account) {
      return null;
    }

    const decryptedPassword = this.encryption.decrypt(account.password);
    return { ...account, password: decryptedPassword } as ProviderAccount;
  }

  async getImapCredentials(id: number, userId: string): Promise<ImapCredentials | null> {
    const account = await this.findById(id, userId);

    if (!account) {
      return null;
    }

    return {
      email: account.email,
      password: account.password,
      host: account.host,
      port: Number.parseInt(account.port, 10),
      useSsl: account.useSsl === 'true',
    };
  }
}
