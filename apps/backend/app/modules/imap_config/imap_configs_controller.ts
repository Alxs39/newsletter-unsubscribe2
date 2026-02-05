import { inject } from '@adonisjs/core';
import ImapConfigService from '#modules/imap_config/imap_config_service';
import { imapConfigs } from '#modules/imap_config/imap_config.schema';

type ImapConfig = typeof imapConfigs.$inferSelect;

@inject()
export default class ImapConfigsController {
  constructor(private imapConfigService: ImapConfigService) {}

  async list(): Promise<ImapConfig[]> {
    return await this.imapConfigService.findAll();
  }
}
