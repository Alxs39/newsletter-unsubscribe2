import { defineConfig } from '@adonisjs/cors';
import env from '#start/env';

/**
 * Configuration options to tweak the CORS policy. The following
 * options are documented on the official documentation website.
 *
 * https://docs.adonisjs.com/guides/security/cors
 */
const corsConfig = defineConfig({
  enabled: true,
  origin:
    env.get('NODE_ENV') === 'development'
      ? ['http://localhost:3000', 'http://127.0.0.1:3000']
      : [env.get('FRONTEND_URL', 'http://localhost:3000')],
  methods: ['GET', 'HEAD', 'POST', 'PUT', 'PATCH', 'DELETE'],
  headers: true,
  exposeHeaders: [],
  credentials: true,
  maxAge: 90,
});

export default corsConfig;
