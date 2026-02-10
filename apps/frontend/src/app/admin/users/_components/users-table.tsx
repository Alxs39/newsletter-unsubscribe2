'use client';

import { TableLoader } from '@/components/ui/table-loader';
import { useState, useEffect, useCallback } from 'react';
import type { UserDto } from '@backend/app/modules/user/user.dto';
import authClient from '@/utils/auth-client';
import { formatDate } from '@/utils/format';
import { Table } from '@/components/ui/table';
import { Pagination } from '@/components/ui/pagination';

const ROWS_PER_PAGE = 10;

export default function UsersTable({ refreshKey }: { refreshKey?: number }) {
  const [users, setUsers] = useState<UserDto[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [page, setPage] = useState(1);

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    setIsError(false);
    try {
      const response = await authClient.admin.listUsers({
        query: {
          limit: ROWS_PER_PAGE,
          offset: (page - 1) * ROWS_PER_PAGE,
          sortBy: 'createdAt',
          sortDirection: 'desc',
        },
      });
      if (response.data) {
        setUsers(response.data.users as UserDto[]);
        setTotal(response.data.total);
      }
    } catch {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }, [page]);

  useEffect(() => {
    void fetchUsers();
  }, [fetchUsers, refreshKey]);

  if (isLoading) {
    return <TableLoader />;
  }

  if (isError) {
    return <p className="text-danger py-4 text-center text-sm">Failed to load users.</p>;
  }

  if (users.length === 0) {
    return <p className="text-muted-fg py-4 text-center text-sm">No users found.</p>;
  }

  const totalPages = Math.ceil(total / ROWS_PER_PAGE);

  return (
    <>
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Name</Table.HeaderCell>
            <Table.HeaderCell>Email</Table.HeaderCell>
            <Table.HeaderCell>Role</Table.HeaderCell>
            <Table.HeaderCell>Created</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {users.map((user) => (
            <Table.Row key={user.id}>
              <Table.Cell className="font-medium">{user.name}</Table.Cell>
              <Table.Cell className="text-muted">{user.email}</Table.Cell>
              <Table.Cell>
                <span
                  className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                    user.role === 'admin'
                      ? 'bg-accent text-accent-foreground'
                      : 'bg-default text-accent-foreground'
                  }`}
                >
                  {user.role}
                </span>
              </Table.Cell>
              <Table.Cell className="text-muted-fg whitespace-nowrap">
                {formatDate(user.createdAt)}
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>

      <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
    </>
  );
}
