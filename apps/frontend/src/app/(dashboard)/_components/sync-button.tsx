'use client';

import { Button } from '@heroui/react';
import { RefreshCw } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@/hooks/useMutation';
import type { ProviderAccountDto } from '@backend/app/modules/provider_account/provider_account.dto';
import type { SyncResultDto } from '@backend/app/modules/synced_email/synced_email.dto';

export default function SyncButton({ accounts }: { accounts: ProviderAccountDto[] }) {
  const router = useRouter();
  const [syncingAccountId, setSyncingAccountId] = useState<number | null>(null);

  const { mutate } = useMutation<SyncResultDto, { providerAccountId: number }>({
    url: '/synced-emails/sync',
    onSuccess: () => {
      setSyncingAccountId(null);
      router.refresh();
    },
    onError: () => {
      setSyncingAccountId(null);
    },
  });

  const handleSync = async (accountId: number) => {
    setSyncingAccountId(accountId);
    await mutate({ providerAccountId: accountId });
  };

  if (accounts.length === 0) {
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
            onPress={() => {
              if (!syncingAccountId) void handleSync(account.id);
            }}
          >
            {!isSyncing && <RefreshCw className="mr-2 h-4 w-4" />}
            Sync {account.email}
          </Button>
        );
      })}
    </div>
  );
}
