import { createServerApiClient } from '@/utils/server-api-client';
import type { ImapConfigDto } from '@backend/app/modules/imap_config/imap_config.dto';
import AdminImapsContent from './_components/admin-imaps-content';

export default async function AdminImapsPage() {
  const api = await createServerApiClient();
  const { data: configs } = await api.get<ImapConfigDto[]>('/admin/imap-configs');

  return <AdminImapsContent configs={configs} />;
}
