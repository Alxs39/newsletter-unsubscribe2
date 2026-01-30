import type { Session, User } from 'better-auth/types';
import type { HttpContext } from '@adonisjs/core/http';

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
