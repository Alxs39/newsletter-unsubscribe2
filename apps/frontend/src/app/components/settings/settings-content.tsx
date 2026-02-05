'use client';

import { Separator } from '@heroui/react';
import UserSession from '../auth/user-session';
import ConnectedAccountsSection from './connected-accounts-section';
import AddAccountSection from './add-account-section';

export default function SettingsContent() {
  return (
    <>
      <UserSession />
      <Separator className="my-4" />
      <ConnectedAccountsSection />
      <Separator className="my-4" />
      <AddAccountSection />
    </>
  );
}
