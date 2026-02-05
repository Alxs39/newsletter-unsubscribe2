import type { HttpContext } from '@adonisjs/core/http';
import type { NextFn } from '@adonisjs/core/types/http';
import { auth } from '#services/auth';

export default class AuthMiddleware {
  async handle(ctx: HttpContext, next: NextFn): Promise<void> {
    const { request, response } = ctx;

    const session = await auth.api.getSession({
      headers: request.headers(),
    });

    if (!session?.user || !session?.session) {
      return response.unauthorized();
    }

    ctx.user = session.user;
    ctx.session = session.session;

    await next();
  }
}
