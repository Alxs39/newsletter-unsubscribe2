import app from '@adonisjs/core/services/app';
import type { HttpContext } from '@adonisjs/core/http';
import type { NextFn } from '@adonisjs/core/types/http';

/**
 * Auth middleware that verifies the user is authenticated via Better Auth
 * and attaches the user to the context
 */
export default class AuthMiddleware {
  async handle(ctx: HttpContext, next: NextFn): Promise<void> {
    const { request, response } = ctx;

    try {
      const auth = await app.container.make('auth');

      // Get the session from Better Auth using cookies
      const session = await auth.api.getSession({
        headers: request.headers(),
      });

      // If no session or user, return 401
      if (!session?.user || !session?.session) {
        response.unauthorized({
          error: 'Unauthorized',
          message: 'You must be authenticated to access this resource',
        });
        return;
      }

      // Attach user and session to the context
      ctx.user = session.user;
      ctx.session = session.session;

      await next();
    } catch (error) {
      console.error('Auth middleware error:', error);
      response.unauthorized({
        error: 'Unauthorized',
        message: 'Invalid or expired session',
      });
    }
  }
}
