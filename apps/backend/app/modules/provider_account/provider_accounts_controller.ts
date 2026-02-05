import { inject } from '@adonisjs/core';
import type { HttpContext } from '@adonisjs/core/http';
import { createProviderAccountValidator } from '#modules/provider_account/validators/provider_account';
import { ProviderAccountService } from '#modules/provider_account/provider_account_service';
import { providerAccounts } from '#modules/provider_account/provider_account.schema';
import CantConnectImapError from '#errors/cant_connect_imap_error';

type ProviderAccount = typeof providerAccounts.$inferSelect;

@inject()
export default class ProviderAccountsController {
  constructor(private providerAccountService: ProviderAccountService) {}

  async store({ request, user, response }: HttpContext): Promise<void> {
    const payload = await createProviderAccountValidator.validate(request.body());

    try {
      await this.providerAccountService.testImapConnection({
        email: payload.email,
        password: payload.password,
        host: 'imap.mail.me.com',
        port: 993,
        useSsl: true,
      });
    } catch (error) {
      if (error instanceof CantConnectImapError) {
        return response.unauthorized({ message: 'Invalid IMAP credentials' });
      } else {
        throw error;
      }
    }

    const result = await this.providerAccountService.store({ ...payload, userId: user!.id });

    return response.created(result);
  }

  async findAll({ user }: HttpContext): Promise<ProviderAccount[]> {
    return await this.providerAccountService.findByUserId(user!.id);
  }
}
