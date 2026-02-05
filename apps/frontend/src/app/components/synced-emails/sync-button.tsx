'use client';

import { Button } from '@heroui/react';
import { RefreshCw } from 'lucide-react';
import { useState } from 'react';
import { useMutation } from '../../hooks/useMutation';
import { useQuery } from '../../hooks/useQuery';
import { useInvalidation, invalidate } from '../../hooks/useInvalidation';
import type { ProviderAccount } from '../../types/provider-account.types';
import type { SyncResult } from '../../types/synced-email.types';

export default function SyncButton() {
  const [syncingAccountId, setSyncingAccountId] = useState<number | null>(null);
  const accountsVersion = useInvalidation('provider-accounts');

  const { data: accounts, isLoading: isLoadingAccounts } = useQuery<ProviderAccount[]>({
    url: '/provider-accounts',
    refetchKey: accountsVersion,
  });

  const { mutate } = useMutation<SyncResult, { providerAccountId: number }>({
    url: '/synced-emails/sync',
    onSuccess: () => {
      setSyncingAccountId(null);
      invalidate('synced-emails');
    },
    onError: () => {
      setSyncingAccountId(null);
    },
  });

  const handleSync = async (accountId: number) => {
    setSyncingAccountId(accountId);
    await mutate({ providerAccountId: accountId });
  };

  if (isLoadingAccounts || !accounts || accounts.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {accounts.map((account) => {
        const isSyncing = syncingAccountId === account.id;
        return (
          <Button
            key={account.id}
            variant="secondary"
            isPending={isSyncing}
            onPress={() => !syncingAccountId && handleSync(account.id)}
          >
            {!isSyncing && <RefreshCw className="mr-2 h-4 w-4" />}
            Sync {account.email}
          </Button>
        );
      })}
    </div>
  );
}
