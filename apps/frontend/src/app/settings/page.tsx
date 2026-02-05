'use client';

import { Card } from '@heroui/react';
import { Loader2 } from 'lucide-react';
import authClient from '../utils/auth-client';
import AuthGate from '../components/settings/auth-gate';
import SettingsContent from '../components/settings/settings-content';

export default function SettingsPage() {
  const { data: session, isPending } = authClient.useSession();

  if (isPending) {
    return (
      <Card.Content>
        <Loader2 className="mx-auto animate-spin" />
      </Card.Content>
    );
  }

  if (!session) {
    return <AuthGate />;
  }

  return (
    <Card.Content>
      <SettingsContent />
    </Card.Content>
  );
}
