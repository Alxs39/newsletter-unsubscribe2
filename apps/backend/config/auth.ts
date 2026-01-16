import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import env from '#start/env'
import { db } from '#database/db'
import * as schema from '#database/schema'

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema,
  }),
  emailAndPassword: {
    enabled: true,
  },
  baseURL: env.get('APP_URL', 'http://localhost:3333'),
  secret: env.get('APP_KEY'),
  trustedOrigins:
    env.get('NODE_ENV') === 'development'
      ? ['http://localhost:3000', 'http://127.0.0.1:3000']
      : [env.get('FRONTEND_URL', 'http://localhost:3000')],
})
