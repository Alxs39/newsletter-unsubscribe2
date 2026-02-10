import transmit from '@adonisjs/transmit/services/main';
import { middleware } from '#start/kernel';

transmit.registerRoutes((route) => {
  route.middleware(middleware.auth());
});

transmit.authorize<{ id: string }>('users/:id/sync', (ctx, { id }) => {
  return ctx.user?.id === id;
});
