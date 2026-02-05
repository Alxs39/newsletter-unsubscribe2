'use client';

import { Card, Link } from '@heroui/react';
import { Loader2, Mail, ExternalLink } from 'lucide-react';
import { useQuery } from '../../hooks/useQuery';
import { useInvalidation } from '../../hooks/useInvalidation';
import type { SyncedEmail } from '../../types/synced-email.types';

export default function SyncedEmailsList() {
  const version = useInvalidation('synced-emails');
  const { data, isLoading, isError } = useQuery<SyncedEmail[]>({
    url: '/synced-emails',
    refetchKey: version,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-4">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  if (isError) {
    return <p className="text-danger py-4 text-center text-sm">Failed to load newsletters.</p>;
  }

  if (!data || data.length === 0) {
    return (
      <p className="text-muted-fg py-4 text-center text-sm">
        No newsletters found. Click sync to scan your inbox.
      </p>
    );
  }

  return (
    <ul className="space-y-3">
      {data.map((email) => (
        <li key={email.id}>
          <Card className="p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <Mail className="text-muted-fg h-4 w-4 shrink-0" />
                  <p className="truncate font-medium">
                    {email.senderName || email.senderEmail}
                  </p>
                </div>
                {email.senderName && (
                  <p className="text-muted-fg ml-6 truncate text-sm">{email.senderEmail}</p>
                )}
                {email.subject && (
                  <p className="text-muted-fg mt-1 ml-6 truncate text-sm">{email.subject}</p>
                )}
              </div>
              {email.unsubscribeLink && (
                <Link
                  href={email.unsubscribeLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-danger flex shrink-0 items-center gap-1 text-sm"
                >
                  Unsubscribe
                  <ExternalLink className="h-3 w-3" />
                </Link>
              )}
            </div>
          </Card>
        </li>
      ))}
    </ul>
  );
}
