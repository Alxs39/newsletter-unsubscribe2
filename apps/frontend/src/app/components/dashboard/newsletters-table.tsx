'use client';

import { Button, Link } from '@heroui/react';
import { Loader2, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useQuery } from '../../hooks/useQuery';
import { useInvalidation } from '../../hooks/useInvalidation';
import type { SyncedEmail } from '../../types/synced-email.types';

const ROWS_PER_PAGE = 10;

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export default function NewslettersTable() {
  const version = useInvalidation('synced-emails');
  const { data, isLoading, isError } = useQuery<SyncedEmail[]>({
    url: '/synced-emails',
    refetchKey: version,
  });
  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1);
  }, [version]);

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
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
        No newsletters found. Connect an account in{' '}
        <Link href="/settings" className="text-sm">
          Settings
        </Link>{' '}
        and sync your inbox.
      </p>
    );
  }

  const totalPages = Math.ceil(data.length / ROWS_PER_PAGE);
  const paginatedData = data.slice((page - 1) * ROWS_PER_PAGE, page * ROWS_PER_PAGE);

  return (
    <>
      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-muted-fg border-b text-left">
              <th className="px-4 py-3 font-medium">Sender</th>
              <th className="px-4 py-3 font-medium">Subject</th>
              <th className="px-4 py-3 font-medium">Received</th>
              <th className="px-4 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((email) => (
              <tr key={email.id} className="border-b last:border-b-0">
                <td className="px-4 py-3">
                  <p className="font-medium">{email.senderName || email.senderEmail}</p>
                  {email.senderName && <p className="text-muted-fg text-xs">{email.senderEmail}</p>}
                </td>
                <td className="text-muted-fg max-w-xs truncate px-4 py-3">
                  {email.subject ?? '\u2014'}
                </td>
                <td className="text-muted-fg whitespace-nowrap px-4 py-3">
                  {email.receivedAt ? formatDate(email.receivedAt) : '\u2014'}
                </td>
                <td className="px-4 py-3 text-right">
                  {email.unsubscribeLink && (
                    <Link
                      href={email.unsubscribeLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-danger inline-flex items-center gap-1 text-sm"
                    >
                      Unsubscribe
                      <ExternalLink className="h-3 w-3" />
                    </Link>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-center gap-3">
          <Button variant="secondary" isDisabled={page <= 1} onPress={() => setPage((p) => p - 1)}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-muted-fg text-sm">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="secondary"
            isDisabled={page >= totalPages}
            onPress={() => setPage((p) => p + 1)}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </>
  );
}
