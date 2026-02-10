import { createServerApiClient, getSession } from '@/utils/server-api-client';
import type { SyncedEmailDto } from '@backend/app/modules/synced_email/synced_email.dto';
import type { ProviderAccountDto } from '@backend/app/modules/provider_account/provider_account.dto';
import SyncButton from './_components/sync-button';
import NewslettersTable from './_components/newsletters-table';

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) {
    return null;
  }

  const api = await createServerApiClient();
  const { data: emails } = await api.get<SyncedEmailDto[]>('/synced-emails');
  const { data: accounts } = await api.get<ProviderAccountDto[]>('/provider-accounts');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Newsletters</h1>
          <p className="mt-1 text-sm text-muted-fg">Manage and unsubscribe from your newsletters</p>
        </div>
        <SyncButton accounts={accounts} userId={session.user.id} />
      </div>
      <NewslettersTable data={emails} />
    </div>
  );
}
