import type { ApplicationService } from '@adonisjs/core/types';
import type { Auth } from 'better-auth';
import { auth } from '#services/auth';

declare module '@adonisjs/core/types' {
  interface ContainerBindings {
    auth: Auth;
  }
}

export default class AuthProvider {
  constructor(protected app: ApplicationService) {}

  register(): void {
    this.app.container.singleton('auth', () => {
      return auth;
    });
  }
}
