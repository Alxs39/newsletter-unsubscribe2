'use client';

import { Card } from '@heroui/react';
import { Loader2, Mail, Server, Lock, LockOpen } from 'lucide-react';
import { useQuery } from '../../hooks/useQuery';
import type { ProviderAccount } from '../../types/provider-account.types';

interface ProviderAccountsListProps {
  onRefetch?: (refetch: () => Promise<void>) => void;
}

export default function ProviderAccountsList({ onRefetch }: ProviderAccountsListProps) {
  const { data, isLoading, isError, refetch } = useQuery<ProviderAccount[]>({
    url: '/provider-accounts',
  });

  if (onRefetch) {
    onRefetch(refetch);
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-4">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  if (isError) {
    return (
      <p className="text-danger py-4 text-center text-sm">Failed to load provider accounts.</p>
    );
  }

  if (!data || data.length === 0) {
    return (
      <p className="text-muted-fg py-4 text-center text-sm">No provider accounts connected yet.</p>
    );
  }

  return (
    <ul className="space-y-3">
      {data.map((account) => (
        <li key={account.id}>
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Mail className="text-muted-fg h-5 w-5" />
                <div>
                  <p className="font-medium">{account.email}</p>
                  <p className="text-muted-fg flex items-center gap-2 text-sm">
                    <Server className="h-3 w-3" />
                    {account.host}:{account.port}
                  </p>
                </div>
              </div>
              <div className={account.useSsl === 'true' ? 'text-success' : 'text-warning'}>
                {account.useSsl === 'true' ? (
                  <>
                    <Lock className="h-3 w-3" /> SSL
                  </>
                ) : (
                  <>
                    <LockOpen className="h-3 w-3" /> No SSL
                  </>
                )}
              </div>
            </div>
          </Card>
        </li>
      ))}
    </ul>
  );
}
