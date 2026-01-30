import { relations } from 'drizzle-orm';
import { pgTable, timestamp, boolean, varchar } from 'drizzle-orm/pg-core';
import { accounts } from '#modules/account/account.schema';
import { sessions } from '#modules/session/session.schema';
import { providerAccounts } from '#modules/provider_account/provider_account.schema';

export const users = pgTable('user', {
  id: varchar({ length: 32 }).primaryKey(),
  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  emailVerified: boolean().notNull(),
  image: varchar({ length: 2048 }),
  createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  deletedAt: timestamp({ withTimezone: true }),
});

export const userRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
  sessions: many(sessions),
  providerAccounts: many(providerAccounts),
}));
