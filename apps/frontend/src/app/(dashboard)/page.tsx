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
    <>
      <SyncButton accounts={accounts} userId={session.user.id} />
      <div className="mt-4">
        <NewslettersTable data={emails} />
      </div>
    </>
  );
}
