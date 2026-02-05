import { inject } from '@adonisjs/core';
import db from '#services/db';
import { imapConfigs } from '#modules/imap_config/imap_config.schema';
import { eq, and, isNull } from 'drizzle-orm';
import { providerAccounts } from '#modules/provider_account/provider_account.schema';
import NotFoundError from '#errors/not_found_error';
import CannotDeleteInUseConfigError from '#modules/imap_config/errors/cannot_delete_in_use_config_error';

type ImapConfig = typeof imapConfigs.$inferSelect;

@inject()
export default class ImapConfigService {
  async create({
    name,
    host,
    port,
    useSsl,
  }: {
    name: string;
    host: string;
    port: number;
    useSsl: boolean;
  }): Promise<ImapConfig> {
    const [config] = await db.insert(imapConfigs).values({ name, host, port, useSsl }).returning();
    return config;
  }

  async findAll(): Promise<ImapConfig[]> {
    return await db
      .select()
      .from(imapConfigs)
      .where(isNull(imapConfigs.deletedAt))
      .orderBy(imapConfigs.name);
  }

  async findById(id: number): Promise<ImapConfig> {
    const [config] = await db
      .select()
      .from(imapConfigs)
      .where(and(eq(imapConfigs.id, id), isNull(imapConfigs.deletedAt)))
      .limit(1);

    if (!config) {
      throw new NotFoundError();
    }

    return config;
  }

  async update(
    id: number,
    { name, host, port, useSsl }: { name?: string; host?: string; port?: number; useSsl?: boolean }
  ): Promise<ImapConfig> {
    const [updated] = await db
      .update(imapConfigs)
      .set({ name, host, port, useSsl })
      .where(and(eq(imapConfigs.id, id), isNull(imapConfigs.deletedAt)))
      .returning();

    if (!updated) {
      throw new NotFoundError();
    }

    return updated;
  }

  async delete(id: number): Promise<ImapConfig> {
    const [usageCount] = await db
      .select({ count: providerAccounts.id })
      .from(providerAccounts)
      .where(and(eq(providerAccounts.imapConfigId, id), isNull(providerAccounts.deletedAt)));

    if (usageCount.count > 0) {
      throw new CannotDeleteInUseConfigError();
    }

    const [deleted] = await db
      .update(imapConfigs)
      .set({ deletedAt: new Date() })
      .where(and(eq(imapConfigs.id, id), isNull(imapConfigs.deletedAt)))
      .returning();

    if (!deleted) {
      throw new NotFoundError();
    }

    return deleted;
  }
}
