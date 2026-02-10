'use client';

import { Alert, Button } from '@heroui/react';
import { Loader2, Pencil, Trash2, Lock, LockOpen } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@/hooks/useMutation';
import type { ImapConfigDto } from '@backend/app/modules/imap_config/imap_config.dto';
import { Table } from '@/components/ui/table';
import { Pagination } from '@/components/ui/pagination';

const ROWS_PER_PAGE = 10;

interface ImapConfigsTableProps {
  data: ImapConfigDto[];
  onEdit: (config: ImapConfigDto) => void;
}

export default function ImapConfigsTable({ data, onEdit }: ImapConfigsTableProps) {
  const [page, setPage] = useState(1);

  if (data.length === 0) {
    return <p className="text-muted-fg py-4 text-center text-sm">No IMAP configurations found.</p>;
  }

  const totalPages = Math.ceil(data.length / ROWS_PER_PAGE);
  const paginatedData = data.slice((page - 1) * ROWS_PER_PAGE, page * ROWS_PER_PAGE);

  return (
    <>
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Name</Table.HeaderCell>
            <Table.HeaderCell>Host</Table.HeaderCell>
            <Table.HeaderCell>Port</Table.HeaderCell>
            <Table.HeaderCell>SSL</Table.HeaderCell>
            <Table.HeaderCell align="right">Actions</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {paginatedData.map((config) => (
            <ConfigRow key={config.id} config={config} onEdit={() => onEdit(config)} />
          ))}
        </Table.Body>
      </Table>

      <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
    </>
  );
}

function ConfigRow({ config, onEdit }: { config: ImapConfigDto; onEdit: () => void }) {
  const router = useRouter();
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const { mutate: deleteConfig, isLoading: isDeleting } = useMutation<void, Record<string, never>>({
    url: `/admin/imap-configs/${config.id}`,
    method: 'DELETE',
    onSuccess: () => {
      setDeleteError(null);
      router.refresh();
    },
    onError: () => {
      setDeleteError('Cannot delete: config is in use by provider accounts.');
      setShowConfirm(false);
    },
  });

  if (deleteError) {
    return (
      <Table.Row>
        <Table.Cell colSpan={5}>
          <Alert status="danger">
            <Alert.Indicator />
            <Alert.Content>
              <Alert.Title>{deleteError}</Alert.Title>
            </Alert.Content>
          </Alert>
        </Table.Cell>
      </Table.Row>
    );
  }

  return (
    <Table.Row>
      <Table.Cell className="font-medium">{config.name}</Table.Cell>
      <Table.Cell className="text-muted-fg">{config.host}</Table.Cell>
      <Table.Cell className="text-muted-fg">{config.port}</Table.Cell>
      <Table.Cell>
        {config.useSsl ? (
          <Lock className="size-4 text-success" />
        ) : (
          <LockOpen className="size-4 text-warning" />
        )}
      </Table.Cell>
      <Table.Cell align="right">
        {showConfirm ? (
          <div className="inline-flex items-center gap-2">
            <span className="text-muted-fg text-xs">Delete?</span>
            <Button
              variant="danger"
              size="sm"
              isPending={isDeleting}
              onPress={() => void deleteConfig({})}
            >
              {isDeleting ? <Loader2 className="size-3 animate-spin" /> : 'Yes'}
            </Button>
            <Button variant="secondary" size="sm" onPress={() => setShowConfirm(false)}>
              No
            </Button>
          </div>
        ) : (
          <div className="inline-flex items-center gap-2">
            <Button variant="secondary" size="sm" onPress={onEdit}>
              <Pencil className="h-3 w-3" />
            </Button>
            <Button variant="secondary" size="sm" onPress={() => setShowConfirm(true)}>
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        )}
      </Table.Cell>
    </Table.Row>
  );
}
