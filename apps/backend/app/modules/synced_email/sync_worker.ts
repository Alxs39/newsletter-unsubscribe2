import { Worker } from 'bullmq';
import app from '@adonisjs/core/services/app';
import logger from '@adonisjs/core/services/logger';
import transmit from '@adonisjs/transmit/services/main';
import { redisConnection } from '#config/queue';
import { SYNC_QUEUE_NAME } from '#modules/synced_email/sync_queue';
import type { SyncJobData, SyncJobResult } from '#modules/synced_email/sync_queue';
import { SyncedEmailService } from '#modules/synced_email/synced_email_service';
import { ProviderAccountService } from '#modules/provider_account/provider_account_service';

let syncWorker: Worker<SyncJobData, SyncJobResult> | null = null;

export function startSyncWorker(): Worker<SyncJobData, SyncJobResult> {
  if (syncWorker) return syncWorker;

  syncWorker = new Worker<SyncJobData, SyncJobResult>(
    SYNC_QUEUE_NAME,
    async (job) => {
      const { providerAccountId, userId } = job.data;
      const syncedEmailService = await app.container.make(SyncedEmailService);

      const result = await syncedEmailService.sync(providerAccountId, userId, (progress) => {
        void job.updateProgress({ ...progress, providerAccountId, userId });
      });

      return { ...result, providerAccountId, userId };
    },
    {
      connection: redisConnection,
      concurrency: 3,
    }
  );

  const providerAccountServicePromise = app.container.make(ProviderAccountService);

  syncWorker.on('active', (job) => {
    void (async () => {
      const { userId, providerAccountId } = job.data;
      const providerAccountService = await providerAccountServicePromise;
      await providerAccountService.updateSyncStatus(providerAccountId, 'syncing');
      transmit.broadcast(`users/${userId}/sync`, {
        event: 'sync:started',
        providerAccountId,
      });
    })();
  });

  syncWorker.on('progress', (_job, progress) => {
    const data = progress as SyncJobData & {
      current: number;
      total: number;
      percentage: number;
    };
    transmit.broadcast(`users/${data.userId}/sync`, {
      event: 'sync:progress',
      providerAccountId: data.providerAccountId,
      current: data.current,
      total: data.total,
      percentage: data.percentage,
    });
  });

  syncWorker.on('completed', (job, returnvalue) => {
    void (async () => {
      const { userId, providerAccountId } = job.data;
      const providerAccountService = await providerAccountServicePromise;
      await providerAccountService.updateSyncStatus(providerAccountId, 'idle');
      transmit.broadcast(`users/${userId}/sync`, {
        event: 'sync:completed',
        providerAccountId,
        synced: returnvalue.synced,
        skipped: returnvalue.skipped,
      });
    })();
  });

  syncWorker.on('failed', (job, err) => {
    if (!job) return;
    void (async () => {
      const { userId, providerAccountId } = job.data;
      const providerAccountService = await providerAccountServicePromise;
      await providerAccountService.updateSyncStatus(providerAccountId, 'failed', err.message);
      transmit.broadcast(`users/${userId}/sync`, {
        event: 'sync:failed',
        providerAccountId,
        error: err.message,
      });
    })();
  });

  syncWorker.on('error', (err) => {
    logger.error({ err }, 'Sync worker error');
  });

  logger.info('Sync worker started');

  return syncWorker;
}

export async function closeSyncWorker(): Promise<void> {
  if (syncWorker) {
    await syncWorker.close();
    syncWorker = null;
  }
}
