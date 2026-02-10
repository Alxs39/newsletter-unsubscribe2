import type { ApplicationService } from '@adonisjs/core/types';
import type { Auth } from 'better-auth';
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { admin } from 'better-auth/plugins';
import env from '#start/env';
import * as schema from '#database/schema';

declare module '@adonisjs/core/types' {
  interface ContainerBindings {
    auth: Auth;
  }
}

export default class AuthProvider {
  constructor(protected app: ApplicationService) {}

  register(): void {
    this.app.container.singleton('auth', async () => {
      const db = await this.app.container.make('db');

      return betterAuth({
        appName: env.get('APP_NAME'),
        baseURL: env.get('BASE_URL'),
        basePath: '/auth',
        trustedOrigins: [env.get('FRONTEND_URL')],
        secret: env.get('APP_KEY'),
        database: drizzleAdapter(db, {
          provider: 'pg',
          schema,
        }),
        emailAndPassword: {
          enabled: true,
          disableSignUp: false,
          requireEmailVerification: false,
          minPasswordLength: 8,
          maxPasswordLength: 128,
          autoSignIn: true,
        },
        user: {
          modelName: 'users',
          changeEmail: {
            enabled: false,
          },
        },
        session: {
          modelName: 'sessions',
          expiresIn: 60 * 60 * 24 * 7, // 7 days
          updateAge: 60 * 15, // 15 minutes
          disableSessionRefresh: true,
          storeSessionInDatabase: true,
          preserveSessionInDatabase: false,
          cookieCache: {
            enabled: true,
            maxAge: 60 * 5, // 5 minutes
          },
        },
        account: {
          modelName: 'accounts',
          accountLinking: {
            enabled: false,
          },
        },
        verification: {
          modelName: 'verifications',
          disableCleanup: false,
        },
        rateLimit: {
          enabled: true,
          window: 10,
          max: 100,
          storage: 'memory',
          modelName: 'rateLimit',
        },
        advanced: {
          useSecureCookies: true,
          disableCSRFCheck: false,
          cookiePrefix: 'newsletter_unsubscribe',
        },
        plugins: [admin({ defaultRole: 'user', adminRoles: ['admin'] })],
      });
    });
  }
}
