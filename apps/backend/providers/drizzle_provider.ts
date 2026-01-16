import type { ApplicationService } from '@adonisjs/core/types'
import { drizzle } from 'drizzle-orm/node-postgres'
import * as schema from '#database/schema'
import env from '#start/env'

export default class DrizzleProvider {
  constructor(protected app: ApplicationService) {}

  /**
   * Register bindings to the container
   */
  register(): void {
    this.app.container.singleton('db', () => {
      const db = drizzle(env.get('DATABASE_URL'), { schema })
      return db
    })
  }
}

declare module '@adonisjs/core/types' {
  interface ContainerBindings {
    db: ReturnType<typeof drizzle<typeof schema>>
  }
}
