import type { Session, User as BetterAuthUser } from 'better-auth/types';
import type { HttpContext } from '@adonisjs/core/http';

export type User = BetterAuthUser;

declare module '@adonisjs/core/http' {
  interface HttpContext {
    user?: User;
    session?: Session;
  }
}

/**
 * Authenticated HTTP context where user and session are guaranteed to exist
 * Use this type in controllers protected by the auth middleware
 */
export interface AuthenticatedHttpContext extends HttpContext {
  user: User;
  session: Session;
}

/**
 * Admin HTTP context where user is guaranteed to be an admin
 * Use this type in controllers protected by both auth and admin middlewares
 */
export interface AdminHttpContext extends AuthenticatedHttpContext {
  user: User & { role: 'admin' };
}

/**
 * Cast HttpContext to AuthenticatedHttpContext
 * Use in controllers protected by auth middleware
 */
export function secureAuth(ctx: HttpContext): AuthenticatedHttpContext {
  return ctx as AuthenticatedHttpContext;
}

/**
 * Cast HttpContext to AdminHttpContext
 * Use in controllers protected by auth + admin middlewares
 */
export function secureAdmin(ctx: HttpContext): AdminHttpContext {
  return ctx as AdminHttpContext;
}
