import { drizzle } from 'drizzle-orm/node-postgres'
import env from '#start/env'

export const db = drizzle(env.get('DATABASE_URL'))
