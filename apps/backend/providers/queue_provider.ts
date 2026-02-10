import type { ApplicationService } from '@adonisjs/core/types';

export default class QueueProvider {
  constructor(protected app: ApplicationService) {}

  async ready(): Promise<void> {
    if (this.app.getEnvironment() !== 'web') return;

    // Dynamic imports required: these modules depend on the 'db' container binding
    // registered by DrizzleProvider, which isn't available at import time.
    const { ProviderAccountService } = await import(
      '#modules/provider_account/provider_account_service'
    );
    const providerAccountService = await this.app.container.make(ProviderAccountService);
    await providerAccountService.resetStaleSyncStatuses();

    const { startSyncWorker } = await import('#modules/synced_email/sync_worker');
    startSyncWorker();
  }

  async shutdown(): Promise<void> {
    const { closeSyncWorker } = await import('#modules/synced_email/sync_worker');
    const { closeSyncQueue } = await import('#modules/synced_email/sync_queue');

    await closeSyncWorker();
    await closeSyncQueue();
  }
}
