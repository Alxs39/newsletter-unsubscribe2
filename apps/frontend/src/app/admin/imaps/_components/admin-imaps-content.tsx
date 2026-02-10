'use client';

import { Button } from '@heroui/react';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ImapConfigsTable from './imap-configs-table';
import FormImapConfig from './form-imap-config';
import { Modal } from '@/components/ui/modal';
import type { ImapConfigDto } from '@backend/app/modules/imap_config/imap_config.dto';

export default function AdminImapsContent({ configs }: { configs: ImapConfigDto[] }) {
  const router = useRouter();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedConfig, setSelectedConfig] = useState<ImapConfigDto | null>(null);

  const handleEdit = (config: ImapConfigDto) => {
    setSelectedConfig(config);
    setIsEditModalOpen(true);
  };

  const handleSuccess = () => {
    setIsAddModalOpen(false);
    setIsEditModalOpen(false);
    router.refresh();
  };

  return (
    <section className="size-full flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <h3 className="font-medium">IMAP Configurations</h3>
        <Button variant="primary" size="sm" onPress={() => setIsAddModalOpen(true)}>
          <Plus className="size-4" />
          Add Configuration
        </Button>
      </div>

      <ImapConfigsTable data={configs} onEdit={handleEdit} />

      <Modal isOpen={isAddModalOpen} onOpenChange={setIsAddModalOpen} closeTrigger>
        <FormImapConfig onSuccess={handleSuccess} />
      </Modal>

      {selectedConfig && (
        <Modal isOpen={isEditModalOpen} onOpenChange={setIsEditModalOpen} closeTrigger>
          <FormImapConfig config={selectedConfig} onSuccess={handleSuccess} />
        </Modal>
      )}
    </section>
  );
}
