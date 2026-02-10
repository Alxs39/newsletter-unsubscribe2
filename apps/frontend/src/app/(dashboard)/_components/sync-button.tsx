'use client';

import { useEffect, useRef } from 'react';
import { Button } from '@heroui/react';
import { RefreshCw, AlertCircle, Check } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@/hooks/useMutation';
import { useSyncSSE } from '@/hooks/useSyncSSE';
import type { ProviderAccountDto } from '@backend/app/modules/provider_account/provider_account.dto';

interface Props {
  accounts: ProviderAccountDto[];
  userId: string;
}

export default function SyncButton({ accounts, userId }: Props) {
  const router = useRouter();
  const { syncStates, resetSyncState } = useSyncSSE(userId);
  const completedRef = useRef<Set<number>>(new Set());

  const { mutate } = useMutation<{ message: string }, { providerAccountId: number }>({
    url: '/synced-emails/sync',
  });

  useEffect(() => {
    for (const account of accounts) {
      const sseState = syncStates[account.id];
      if (sseState?.status === 'completed' && !completedRef.current.has(account.id)) {
        completedRef.current.add(account.id);
        router.refresh();
        const timeout = setTimeout(() => {
          resetSyncState(account.id);
          completedRef.current.delete(account.id);
        }, 3000);
        return () => clearTimeout(timeout);
      }
    }
  }, [syncStates, accounts, router, resetSyncState]);

  if (accounts.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-3">
      {accounts.map((account) => {
        const sseState = syncStates[account.id];
        const isSyncing = sseState?.status === 'syncing' || account.syncStatus === 'syncing';
        const isFailed =
          sseState?.status === 'failed' || (!sseState && account.syncStatus === 'failed');
        const isCompleted = sseState?.status === 'completed';

        return (
          <div key={account.id} className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                isPending={isSyncing}
                isDisabled={isSyncing}
                onPress={() => {
                  if (!isSyncing) void mutate({ providerAccountId: account.id });
                }}
              >
                {!isSyncing && <RefreshCw className="mr-2 h-4 w-4" />}
                Sync {account.email}
              </Button>

              {isFailed && (
                <span className="flex items-center gap-1 text-sm text-red-500">
                  <AlertCircle className="h-4 w-4" />
                  {sseState?.error ?? account.syncError ?? 'Sync failed'}
                </span>
              )}

              {isCompleted && (
                <span className="flex items-center gap-1 text-sm text-green-500">
                  <Check className="h-4 w-4" />
                  {sseState?.synced} synced
                </span>
              )}
            </div>

            {isSyncing && sseState && sseState.progress > 0 && (
              <div className="flex items-center gap-2 max-w-md">
                <div className="h-2 flex-1 rounded-full bg-gray-200">
                  <div
                    className="h-2 rounded-full bg-blue-500 transition-all duration-300"
                    style={{ width: `${sseState.progress}%` }}
                  />
                </div>
                <span className="text-xs text-gray-500">
                  {sseState.current}/{sseState.total}
                </span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
