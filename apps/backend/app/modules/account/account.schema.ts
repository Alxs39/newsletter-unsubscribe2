import { pgTable, text, timestamp, varchar } from 'drizzle-orm/pg-core';
import { users } from '../user/user.schema.js';
import { relations } from 'drizzle-orm';

export const accounts = pgTable('account', {
  id: varchar({ length: 32 }).primaryKey(),
  userId: varchar({ length: 32 })
    .references(() => users.id)
    .notNull(),
  accountId: varchar({ length: 32 }).notNull(),
  providerId: varchar({ length: 255 }).notNull(),
  accessToken: varchar({ length: 255 }),
  refreshToken: varchar({ length: 255 }),
  accessTokenExpiresAt: timestamp({ withTimezone: true }),
  refreshTokenExpiresAt: timestamp({ withTimezone: true }),
  scopes: varchar({ length: 1024 }),
  idToken: text(),
  password: varchar({ length: 255 }),
  createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  deletedAt: timestamp({ withTimezone: true }),
});

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, {
    fields: [accounts.userId],
    references: [users.id],
  }),
}));
