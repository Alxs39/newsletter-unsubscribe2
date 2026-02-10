import { Queue } from 'bullmq';
import { redisConnection } from '#config/queue';

export const SYNC_QUEUE_NAME = 'email-sync';

export interface SyncJobData {
  providerAccountId: number;
  userId: string;
}

export interface SyncJobResult {
  synced: number;
  skipped: number;
  providerAccountId: number;
  userId: string;
}

let syncQueue: Queue<SyncJobData, SyncJobResult> | null = null;

export function getSyncQueue(): Queue<SyncJobData, SyncJobResult> {
  syncQueue ??= new Queue<SyncJobData, SyncJobResult>(SYNC_QUEUE_NAME, {
    connection: redisConnection,
    defaultJobOptions: {
      removeOnComplete: { age: 30 },
      removeOnFail: { age: 3600 },
      attempts: 1,
    },
  });
  return syncQueue;
}

export async function addSyncJob(data: SyncJobData): Promise<void> {
  const queue = getSyncQueue();
  await queue.add('sync', data, {
    jobId: `sync-${data.providerAccountId}`,
  });
}

export async function closeSyncQueue(): Promise<void> {
  if (syncQueue) {
    await syncQueue.close();
    syncQueue = null;
  }
}
