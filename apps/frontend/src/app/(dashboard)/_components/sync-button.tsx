'use client';

import { useEffect, useRef } from 'react';
import { Button, ButtonGroup, Dropdown } from '@heroui/react';
import { RefreshCw, AlertCircle, Check, ChevronDown, Mail } from 'lucide-react';
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

  if (accounts.length === 0) return null;

  const anySyncing = accounts.some(
    (a) => syncStates[a.id]?.status === 'syncing' || a.syncStatus === 'syncing'
  );

  const handleSyncAll = () => {
    if (anySyncing) return;
    for (const account of accounts) {
      void mutate({ providerAccountId: account.id });
    }
  };

  const handleSyncAccount = (key: React.Key) => {
    if (!anySyncing) void mutate({ providerAccountId: Number(key) });
  };

  const hasMultipleAccounts = accounts.length > 1;

  return (
    <div className="flex flex-col items-end gap-2">
      <ButtonGroup variant="secondary">
        <Button isPending={anySyncing} isDisabled={anySyncing} onPress={handleSyncAll}>
          {!anySyncing && <RefreshCw className="h-4 w-4" />}
          Sync
        </Button>
        {hasMultipleAccounts && (
          <Dropdown>
            <Dropdown.Trigger>
              <ChevronDown className="h-4 w-4" />
            </Dropdown.Trigger>
            <Dropdown.Popover placement="bottom end">
              <Dropdown.Menu onAction={handleSyncAccount}>
                {accounts.map((account) => (
                  <Dropdown.Item key={account.id} id={String(account.id)}>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 shrink-0 text-muted-fg" />
                      <span>{account.email}</span>
                    </div>
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown.Popover>
          </Dropdown>
        )}
      </ButtonGroup>

      {accounts.map((account) => {
        const sseState = syncStates[account.id];
        const isSyncing = sseState?.status === 'syncing' || account.syncStatus === 'syncing';
        const isFailed =
          sseState?.status === 'failed' || (!sseState && account.syncStatus === 'failed');
        const isCompleted = sseState?.status === 'completed';

        if (!isSyncing && !isFailed && !isCompleted) return null;

        return (
          <div key={account.id} className="flex items-center gap-2">
            {isSyncing && sseState && sseState.progress > 0 && (
              <>
                <span className="text-xs text-muted-fg">{account.email}</span>
                <div className="h-1.5 w-28 rounded-full bg-muted">
                  <div
                    className="h-1.5 rounded-full bg-primary transition-all duration-300"
                    style={{ width: `${sseState.progress}%` }}
                  />
                </div>
                <span className="text-xs tabular-nums text-muted-fg">
                  {sseState.current}/{sseState.total}
                </span>
              </>
            )}
            {isFailed && (
              <span className="flex items-center gap-1 text-xs text-danger">
                <AlertCircle className="h-3.5 w-3.5" />
                {sseState?.error ?? account.syncError ?? 'Sync failed'}
              </span>
            )}
            {isCompleted && (
              <span className="flex items-center gap-1 text-xs text-success">
                <Check className="h-3.5 w-3.5" />
                {sseState?.synced} emails synced
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}
