import { Card } from '@heroui/react';
import { createServerApiClient, getSession } from '@/utils/server-api-client';
import type { ProviderAccountDto } from '@backend/app/modules/provider_account/provider_account.dto';
import type { ImapConfigDto } from '@backend/app/modules/imap_config/imap_config.dto';
import { LinkIcon, Plus } from 'lucide-react';
import UserSession from './_components/user-session';
import ProviderAccountsList from './_components/provider-accounts-list';
import ImapForm from './_components/imap-form';

export default async function SettingsPage() {
  const [api, session] = await Promise.all([createServerApiClient(), getSession()]);

  const { data: accounts } = await api.get<ProviderAccountDto[]>('/provider-accounts');
  const { data: imapConfigs } = await api.get<ImapConfigDto[]>('/imap-configs');

  return (
    <>
      <UserSession email={session?.user?.email ?? ''} />

      <Card>
        <Card.Header>
          <div className="flex items-center gap-2">
            <LinkIcon className="text-muted-fg h-4 w-4" />
            <Card.Title>Connected Accounts</Card.Title>
          </div>
          <Card.Description>Email accounts linked for newsletter scanning.</Card.Description>
        </Card.Header>
        <Card.Content>
          <ProviderAccountsList data={accounts} />
        </Card.Content>
      </Card>

      <Card>
        <Card.Header>
          <div className="flex items-center gap-2">
            <Plus className="text-muted-fg h-4 w-4" />
            <Card.Title>Add Account</Card.Title>
          </div>
          <Card.Description>Connect a new email account via IMAP.</Card.Description>
        </Card.Header>
        <Card.Content>
          <ImapForm imapConfigs={imapConfigs} />
        </Card.Content>
      </Card>
    </>
  );
}
