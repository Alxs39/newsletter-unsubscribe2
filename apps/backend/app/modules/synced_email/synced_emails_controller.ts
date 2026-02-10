import { inject } from '@adonisjs/core';
import type { HttpContext } from '@adonisjs/core/http';
import { secureAuth } from '#types/http';
import { SyncedEmailService } from '#modules/synced_email/synced_email_service';
import { ProviderAccountService } from '#modules/provider_account/provider_account_service';
import { addSyncJob } from '#modules/synced_email/sync_queue';
import NotFoundError from '#errors/not_found_error';
import vine from '@vinejs/vine';

const syncValidator = vine.compile(
  vine.object({
    providerAccountId: vine.number().positive(),
  })
);

@inject()
export default class SyncedEmailsController {
  constructor(
    private syncedEmailService: SyncedEmailService,
    private providerAccountService: ProviderAccountService
  ) {}

  async sync(ctx: HttpContext): Promise<void> {
    const { request, user, response } = secureAuth(ctx);

    const payload = await syncValidator.validate(request.body());

    try {
      const account = await this.providerAccountService.findById({
        id: payload.providerAccountId,
        userId: user.id,
      });

      if (account.syncStatus === 'syncing') {
        return response.conflict({ message: 'Sync already in progress for this account' });
      }
    } catch (error) {
      if (error instanceof NotFoundError) {
        return response.notFound({ message: 'Provider account not found' });
      }
      throw error;
    }

    await addSyncJob({
      providerAccountId: payload.providerAccountId,
      userId: user.id,
    });

    return response.accepted({ message: 'Sync job queued' });
  }

  async findAll(ctx: HttpContext): Promise<void> {
    const { user, response } = secureAuth(ctx);

    const emails = await this.syncedEmailService.findAllByUserId(user.id);
    return response.ok(emails);
  }
}
