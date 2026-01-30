import { pgTable, timestamp, varchar, serial } from 'drizzle-orm/pg-core';
import { users } from '#modules/user/user.schema';
import { relations } from 'drizzle-orm';

export const providerAccounts = pgTable('provider_account', {
  id: serial().primaryKey(),
  userId: varchar({ length: 32 })
    .references(() => users.id)
    .notNull(),
  email: varchar({ length: 255 }).unique().notNull(),
  host: varchar({ length: 255 }).notNull(),
  port: varchar({ length: 10 }).notNull(),
  useSsl: varchar({ length: 5 }).notNull(),
  password: varchar({ length: 500 }).notNull(), // Encrypted AES-256-GCM format: iv:ciphertext:authTag
  createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  deletedAt: timestamp({ withTimezone: true }),
});

export const providerAccountsRelations = relations(providerAccounts, ({ one }) => ({
  user: one(users, {
    fields: [providerAccounts.userId],
    references: [users.id],
  }),
}));
