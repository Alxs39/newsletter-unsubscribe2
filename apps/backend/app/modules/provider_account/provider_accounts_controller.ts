import { inject } from '@adonisjs/core';
import type { HttpContext } from '@adonisjs/core/http';
import { createProviderAccountValidator } from './validators/provider_account.js';
import { ProviderAccountService } from './provider_account_service.js';

function isAuthenticationFailure(error: unknown): boolean {
  return (
    error instanceof Error && 'authenticationFailed' in error && error.authenticationFailed === true
  );
}

@inject()
export default class ProviderAccountsController {
  constructor(private providerAccountService: ProviderAccountService) {}

  async store({ request, user, response }: HttpContext): Promise<void> {
    const payload = await createProviderAccountValidator.validate(request.body());

    const credentials = {
      email: payload.email,
      password: payload.password,
      host: 'imap.mail.me.com',
      port: 993,
      useSsl: true,
    };

    try {
      await this.providerAccountService.testImapConnection(credentials);
    } catch (error) {
      if (isAuthenticationFailure(error)) {
        return response.unauthorized({ message: 'Invalid IMAP credentials' });
      }
      return response.badGateway({ message: 'Unable to connect to IMAP server' });
    }

    // user is guaranteed by auth middleware
    const result = await this.providerAccountService.store({ ...payload, userId: user!.id });

    return response.created(result);
  }

  async findAll({ user, response }: HttpContext): Promise<void> {
    // user is guaranteed by auth middleware
    const accounts = await this.providerAccountService.findByUserId(user!.id);
    return response.ok(accounts);
  }
}
