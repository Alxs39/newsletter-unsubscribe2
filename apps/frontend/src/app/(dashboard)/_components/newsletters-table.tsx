'use client';

import { Link } from '@heroui/react';
import { ExternalLink } from 'lucide-react';
import { useState } from 'react';
import type { SyncedEmailDto } from '@backend/app/modules/synced_email/synced_email.dto';
import { formatDate } from '@/utils/format';
import { Table } from '@/components/ui/table';
import { Pagination } from '@/components/ui/pagination';

const ROWS_PER_PAGE = 10;

export default function NewslettersTable({ data }: { data: SyncedEmailDto[] }) {
  const [page, setPage] = useState(1);

  if (data.length === 0) {
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
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Sender</Table.HeaderCell>
            <Table.HeaderCell>Subject</Table.HeaderCell>
            <Table.HeaderCell>Received</Table.HeaderCell>
            <Table.HeaderCell align="right">Actions</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {paginatedData.map((email) => (
            <Table.Row key={email.id}>
              <Table.Cell>
                <p className="font-medium">{email.senderName ?? email.senderEmail}</p>
                {email.senderName && <p className="text-muted-fg text-xs">{email.senderEmail}</p>}
              </Table.Cell>
              <Table.Cell className="text-muted-fg max-w-xs truncate">
                {email.subject ?? '\u2014'}
              </Table.Cell>
              <Table.Cell className="text-muted-fg whitespace-nowrap">
                {email.receivedAt ? formatDate(email.receivedAt) : '\u2014'}
              </Table.Cell>
              <Table.Cell align="right">
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
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>

      <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
    </>
  );
}
