'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import { Transmit } from '@adonisjs/transmit-client';
import type { SyncEvent } from '@/types/sync-events';

interface AccountSyncState {
  status: 'syncing' | 'completed' | 'failed';
  progress: number;
  current: number;
  total: number;
  error?: string;
  synced?: number;
  skipped?: number;
}

type SyncStates = Record<number, AccountSyncState>;

export function useSyncSSE(userId: string | undefined) {
  const [syncStates, setSyncStates] = useState<SyncStates>({});
  const transmitRef = useRef<Transmit | null>(null);

  useEffect(() => {
    if (!userId) return;

    // Custom httpClientFactory to add credentials: 'include' for cross-origin cookie auth.
    // Type assertion needed because HttpClient class (with #private fields) is not exported
    // from @adonisjs/transmit-client, but the runtime only uses send() and createRequest().
    const httpClientFactory = (baseUrl: string, uid: string) => ({
      send: (request: Request) => fetch(request),
      createRequest: (path: string, body: Record<string, unknown>) =>
        new Request(`${baseUrl}${path}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({ ...body, uid }),
          credentials: 'include' as RequestCredentials,
        }),
    });

    const transmit = new Transmit({
      baseUrl: process.env.NEXT_PUBLIC_BASE_API_URL!,
      // @ts-expect-error - HttpClient class with #private fields is not exported from @adonisjs/transmit-client
      httpClientFactory,
    });

    transmitRef.current = transmit;

    const subscription = transmit.subscription(`users/${userId}/sync`);

    const unsubscribe = subscription.onMessage<SyncEvent>((data) => {
      setSyncStates((prev) => {
        const next = { ...prev };

        switch (data.event) {
          case 'sync:started':
            next[data.providerAccountId] = {
              status: 'syncing',
              progress: 0,
              current: 0,
              total: 0,
            };
            break;
          case 'sync:progress':
            next[data.providerAccountId] = {
              ...next[data.providerAccountId],
              status: 'syncing',
              progress: data.percentage,
              current: data.current,
              total: data.total,
            };
            break;
          case 'sync:completed':
            next[data.providerAccountId] = {
              status: 'completed',
              progress: 100,
              current: 0,
              total: 0,
              synced: data.synced,
              skipped: data.skipped,
            };
            break;
          case 'sync:failed':
            next[data.providerAccountId] = {
              ...next[data.providerAccountId],
              status: 'failed',
              progress: 0,
              error: data.error,
            };
            break;
        }

        return next;
      });
    });

    void subscription.create();

    return () => {
      unsubscribe();
      void subscription.delete();
      transmit.close();
      transmitRef.current = null;
    };
  }, [userId]);

  const resetSyncState = useCallback((providerAccountId: number) => {
    setSyncStates((prev) => {
      const next = { ...prev };
      delete next[providerAccountId];
      return next;
    });
  }, []);

  return { syncStates, resetSyncState };
}
