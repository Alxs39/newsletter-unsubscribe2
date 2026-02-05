import { inject } from '@adonisjs/core';
import type { HttpContext } from '@adonisjs/core/http';
import { secureAuth } from '#types/http';
import { SyncedEmailService } from '#modules/synced_email/synced_email_service';
import vine from '@vinejs/vine';

const syncValidator = vine.compile(
  vine.object({
    providerAccountId: vine.number().positive(),
  })
);

@inject()
export default class SyncedEmailsController {
  constructor(private syncedEmailService: SyncedEmailService) {}

  async sync(ctx: HttpContext): Promise<void> {
    const { request, user, response } = secureAuth(ctx);

    const payload = await syncValidator.validate(request.body());

    try {
      const result = await this.syncedEmailService.sync(payload.providerAccountId, user.id);
      return response.ok(result);
    } catch (error) {
      if (error instanceof Error && error.message === 'Provider account not found') {
        return response.notFound({ message: 'Provider account not found' });
      }
      return response.internalServerError({ message: 'Sync failed' });
    }
  }

  async findAll(ctx: HttpContext): Promise<void> {
    const { user, response } = secureAuth(ctx);

    const emails = await this.syncedEmailService.findAllByUserId(user.id);
    return response.ok(emails);
  }
}
