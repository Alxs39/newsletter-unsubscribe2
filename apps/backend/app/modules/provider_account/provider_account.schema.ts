import { pgTable, timestamp, varchar, serial, bigint, integer, boolean } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { users } from '#modules/user/user.schema';
import { syncedEmails } from '#modules/synced_email/synced_email.schema';
import { imapConfigs } from '#modules/imap_config/imap_config.schema';

export const providerAccounts = pgTable('provider_account', {
  id: serial().primaryKey(),
  userId: varchar({ length: 32 })
    .references(() => users.id)
    .notNull(),
  email: varchar({ length: 255 }).unique().notNull(),
  imapConfigId: integer().references(() => imapConfigs.id),
  host: varchar({ length: 255 }).notNull(),
  port: integer().notNull(),
  useSsl: boolean().notNull(),
  password: varchar({ length: 500 }).notNull(), // Encrypted AES-256-GCM format: iv:ciphertext:authTag
  lastSyncAt: timestamp({ withTimezone: true }),
  // Incremental sync fields
  lastUidValidity: bigint({ mode: 'number' }), // IMAP UIDVALIDITY - if changed, all UIDs are invalidated
  lastHighestUid: bigint({ mode: 'number' }), // Highest synced UID - fetch only newer messages
  lastModseq: bigint({ mode: 'number' }), // CONDSTORE modseq for change detection (future use)
  createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  deletedAt: timestamp({ withTimezone: true }),
});

export const providerAccountsRelations = relations(providerAccounts, ({ one, many }) => ({
  user: one(users, {
    fields: [providerAccounts.userId],
    references: [users.id],
  }),
  imapConfig: one(imapConfigs, {
    fields: [providerAccounts.imapConfigId],
    references: [imapConfigs.id],
  }),
  syncedEmails: many(syncedEmails),
}));
