import { relations } from 'drizzle-orm';
import { pgTable, timestamp, varchar } from 'drizzle-orm/pg-core';
import { users } from '#modules/user/user.schema';

export const sessions = pgTable('session', {
  id: varchar({ length: 32 }).primaryKey(),
  userId: varchar({ length: 32 })
    .references(() => users.id)
    .notNull(),
  token: varchar({ length: 255 }).notNull(),
  expiresAt: timestamp({ withTimezone: true }).notNull(),
  ipAddress: varchar({ length: 45 }),
  userAgent: varchar({ length: 255 }),
  impersonatedBy: varchar({ length: 32 }),
  createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  deletedAt: timestamp({ withTimezone: true }),
});

export const sessionRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}));
