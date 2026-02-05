'use client';

import { Card } from '@heroui/react';
import AuthGuard from '../components/auth/auth-guard';
import AuthGate from '../components/auth/auth-gate';
import SettingsContent from '../components/settings/settings-content';

export default function SettingsPage() {
  return (
    <AuthGuard fallback={<AuthGate />}>
      <Card.Content>
        <SettingsContent />
      </Card.Content>
    </AuthGuard>
  );
}
