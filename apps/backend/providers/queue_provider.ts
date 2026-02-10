import type { ApplicationService } from '@adonisjs/core/types';
import { ProviderAccountService } from '#modules/provider_account/provider_account_service';
import { startSyncWorker, closeSyncWorker } from '#modules/synced_email/sync_worker';
import { closeSyncQueue } from '#modules/synced_email/sync_queue';

export default class QueueProvider {
  constructor(protected app: ApplicationService) {}

  async ready(): Promise<void> {
    if (this.app.getEnvironment() !== 'web') return;

    const providerAccountService = await this.app.container.make(ProviderAccountService);
    await providerAccountService.resetStaleSyncStatuses();

    startSyncWorker();
  }

  async shutdown(): Promise<void> {
    await closeSyncWorker();
    await closeSyncQueue();
  }
}
