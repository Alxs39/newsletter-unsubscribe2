export interface SyncStartedEvent {
  event: 'sync:started';
  providerAccountId: number;
}

export interface SyncProgressEvent {
  event: 'sync:progress';
  providerAccountId: number;
  current: number;
  total: number;
  percentage: number;
}

export interface SyncCompletedEvent {
  event: 'sync:completed';
  providerAccountId: number;
  synced: number;
  skipped: number;
}

export interface SyncFailedEvent {
  event: 'sync:failed';
  providerAccountId: number;
  error: string;
}

export type SyncEvent = SyncStartedEvent | SyncProgressEvent | SyncCompletedEvent | SyncFailedEvent;
