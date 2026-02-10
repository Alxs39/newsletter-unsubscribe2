import { inject } from '@adonisjs/core';
import type { HttpContext } from '@adonisjs/core/http';
import ImapConfigService from '#modules/imap_config/imap_config_service';
import {
  createImapConfigValidator,
  updateImapConfigValidator,
} from '#modules/imap_config/validators/imap_config';
import NotFoundError from '#errors/not_found_error';
import { imapConfigs } from '#modules/imap_config/imap_config.schema';
import CannotDeleteInUseConfigError from '#modules/imap_config/errors/cannot_delete_in_use_config_error';
import { secureAdmin } from '#types/http';

type ImapConfig = typeof imapConfigs.$inferSelect;

@inject()
export default class ImapConfigsAdminController {
  constructor(private imapConfigService: ImapConfigService) {}

  async list(): Promise<ImapConfig[]> {
    return await this.imapConfigService.findAll();
  }

  async create(ctx: HttpContext): Promise<void> {
    const { request, response } = secureAdmin(ctx);
    const payload = await createImapConfigValidator.validate(request.body());
    const config = await this.imapConfigService.create(payload);
    return response.created(config);
  }

  async update(ctx: HttpContext): Promise<ImapConfig | void> {
    const { params, request, response } = secureAdmin(ctx);
    const id = Number(params.id);
    const payload = await updateImapConfigValidator.validate(request.body());

    try {
      return await this.imapConfigService.update(id, payload);
    } catch (error) {
      if (error instanceof NotFoundError) {
        return response.notFound();
      } else {
        throw error;
      }
    }
  }

  async delete(ctx: HttpContext): Promise<void> {
    const { params, response } = secureAdmin(ctx);
    const id = Number(params.id);

    try {
      await this.imapConfigService.delete(id);
      return response.noContent();
    } catch (error) {
      if (error instanceof NotFoundError) {
        return response.notFound();
      } else if (error instanceof CannotDeleteInUseConfigError) {
        return response.badRequest();
      } else {
        throw error;
      }
    }
  }
}
