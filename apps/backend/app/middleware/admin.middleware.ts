import type { HttpContext } from '@adonisjs/core/http';
import type { NextFn } from '@adonisjs/core/types/http';

export default class AdminMiddleware {
  async handle(ctx: HttpContext, next: NextFn): Promise<void> {
    const { response, user } = ctx;

    if (!user) {
      return response.unauthorized();
    }

    if (user.role !== 'admin') {
      return response.forbidden();
    }

    await next();
  }
}
