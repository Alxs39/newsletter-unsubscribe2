import { pgTable, timestamp, varchar, serial, integer, uniqueIndex } from 'drizzle-orm/pg-core';
import { providerAccounts } from '#modules/provider_account/provider_account.schema';
import { sql, relations } from 'drizzle-orm';

export const syncedEmails = pgTable(
  'synced_email',
  {
    id: serial().primaryKey(),
    providerAccountId: integer()
      .references(() => providerAccounts.id, { onDelete: 'cascade' })
      .notNull(),
    messageId: varchar({ length: 255 }).notNull(),
    senderEmail: varchar({ length: 255 }).notNull(),
    senderName: varchar({ length: 255 }),
    subject: varchar({ length: 500 }),
    unsubscribeLink: varchar({ length: 2000 }),
    receivedAt: timestamp({ withTimezone: true }),
    createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp({ withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => sql`NOW()`),
    deletedAt: timestamp({ withTimezone: true }),
  },
  (table) => [uniqueIndex().on(table.providerAccountId, table.messageId)]
);

export const syncedEmailRelations = relations(syncedEmails, ({ one }) => ({
  providerAccount: one(providerAccounts, {
    fields: [syncedEmails.providerAccountId],
    references: [providerAccounts.id],
  }),
}));
