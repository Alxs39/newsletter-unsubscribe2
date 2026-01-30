import type { ApplicationService } from '@adonisjs/core/types';
import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import env from '#start/env';
import * as schema from '#database/schema';

export type DrizzleDatabase = NodePgDatabase<typeof schema>;

declare module '@adonisjs/core/types' {
  interface ContainerBindings {
    db: DrizzleDatabase;
  }
}

export default class DrizzleProvider {
  private pool: Pool | null = null;

  constructor(protected app: ApplicationService) {}

  register(): void {
    this.app.container.singleton('db', () => {
      this.pool = new Pool({
        connectionString: env.get('DATABASE_URL'),
        max: 20,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 2000,
      });

      return drizzle(this.pool, { schema });
    });
  }

  async shutdown(): Promise<void> {
    if (this.pool) {
      await this.pool.end();
      this.pool = null;
    }
  }
}
