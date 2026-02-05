import { pgTable, timestamp, varchar, serial, integer, boolean } from 'drizzle-orm/pg-core';
import { relations, sql } from 'drizzle-orm';
import { providerAccounts } from '#modules/provider_account/provider_account.schema';

export const imapConfigs = pgTable('imap_config', {
  id: serial().primaryKey(),
  name: varchar({ length: 255 }).notNull().unique(),
  host: varchar({ length: 255 }).notNull(),
  port: integer().notNull(),
  useSsl: boolean().notNull().default(true),
  createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp({ withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => sql`NOW()`),
  deletedAt: timestamp({ withTimezone: true }),
});

export const imapConfigsRelations = relations(imapConfigs, ({ many }) => ({
  providerAccounts: many(providerAccounts),
}));
