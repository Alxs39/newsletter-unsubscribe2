import app from '@adonisjs/core/services/app';
import { toNodeHandler } from 'better-auth/node';
import env from '#start/env';
import type { HttpContext } from '@adonisjs/core/http';
import type { NextFn } from '@adonisjs/core/types/http';

const getAllowedOrigin = (requestOrigin: string | undefined): string => {
  const allowedOrigins =
    env.get('NODE_ENV') === 'development'
      ? ['http://localhost:3000', 'http://127.0.0.1:3000']
      : [env.get('FRONTEND_URL', 'http://localhost:3000')];

  if (requestOrigin && allowedOrigins.includes(requestOrigin)) {
    return requestOrigin;
  }
  return allowedOrigins[0];
};

/**
 * Better Auth middleware that handles all /api/auth/* routes
 * This runs at the server level BEFORE the body parser
 */
export default class BetterAuthMiddleware {
  async handle(ctx: HttpContext, next: NextFn): Promise<void> {
    const { request, response } = ctx;
    const url = request.url();

    // Only handle /auth/* routes
    if (!url.startsWith('/auth')) {
      await next();
      return;
    }

    const auth = await app.container.make('auth');
    const nodeHandler = toNodeHandler(auth);
    const req = request.request;
    const res = response.response;

    // Add CORS headers manually since Better Auth bypasses AdonisJS response
    const origin = getAllowedOrigin(request.header('origin'));
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');

    // Handle preflight requests
    if (request.method() === 'OPTIONS') {
      res.statusCode = 204;
      res.end();
      return;
    }

    // Let Better Auth handle the request
    await nodeHandler(req, res);
  }
}
