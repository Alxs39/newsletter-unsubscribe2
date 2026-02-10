'use client';

import { Button } from '@heroui/react';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { useRefresh } from '@/hooks/useRefresh';
import UsersTable from './_components/users-table';
import CreateUserForm from './_components/create-user-form';
import { Modal } from '@/components/ui/modal';

export default function UsersSection() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { refreshKey, refresh } = useRefresh();

  return (
    <section className="size-full flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <h3 className="font-medium">User Management</h3>
        <Button variant="primary" size="sm" onPress={() => setIsCreateModalOpen(true)}>
          <Plus className="size-4" />
          Add User
        </Button>
      </div>

      <UsersTable refreshKey={refreshKey} />

      <Modal isOpen={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <CreateUserForm
          onSuccess={() => {
            setIsCreateModalOpen(false);
            refresh();
          }}
        />
      </Modal>
    </section>
  );
}
