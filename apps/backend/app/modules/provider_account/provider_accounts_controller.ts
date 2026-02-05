import { inject } from '@adonisjs/core';
import type { HttpContext } from '@adonisjs/core/http';
import { secureAuth } from '#types/http';
import { createProviderAccountValidator } from '#modules/provider_account/validators/provider_account';
import { ProviderAccountService } from '#modules/provider_account/provider_account_service';
import { providerAccounts } from '#modules/provider_account/provider_account.schema';
import CantConnectImapError from '#errors/cant_connect_imap_error';
import ImapConfigService from '#modules/imap_config/imap_config_service';
import NotFoundError from '#errors/not_found_error';

type ProviderAccount = typeof providerAccounts.$inferSelect;

@inject()
export default class ProviderAccountsController {
  constructor(
    private readonly providerAccountService: ProviderAccountService,
    private readonly imapConfigService: ImapConfigService
  ) {}

  async store(ctx: HttpContext): Promise<void> {
    const { request, user, response } = secureAuth(ctx);

    const payload = await createProviderAccountValidator.validate(request.body());

    try {
      const config = await this.imapConfigService.findById(payload.imapConfigId);
      await this.providerAccountService.testImapConnection({
        email: payload.email,
        password: payload.password,
        host: config.host,
        port: config.port,
        useSsl: config.useSsl,
      });
    } catch (error) {
      if (error instanceof NotFoundError) {
        return response.notFound();
      } else if (error instanceof CantConnectImapError) {
        return response.unauthorized();
      } else {
        throw error;
      }
    }

    const result = await this.providerAccountService.store({ ...payload, userId: user.id });

    return response.created(result);
  }

  async findAll(ctx: HttpContext): Promise<ProviderAccount[]> {
    const { user } = secureAuth(ctx);
    return await this.providerAccountService.findByUserId(user.id);
  }
}
