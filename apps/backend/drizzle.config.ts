import 'dotenv/config'
import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  out: './database',
  schema: './app/modules/**/**.schema.ts',
  migrations: {
    prefix: 'timestamp',
  },
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
})
