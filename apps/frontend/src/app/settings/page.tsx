'use client';

import { Card, Link, Separator } from '@heroui/react';
import SignUp from '../components/auth/sign-up';
import { useState, useRef } from 'react';
import SignIn from '../components/auth/sign-in';
import authClient from '../utils/auth-client';
import UserSession from '../components/auth/user-session';
import { Loader2 } from 'lucide-react';
import ImapForm from '../components/providers/imap-form';
import ProviderAccountsList from '../components/providers/provider-accounts-list';

export default function SettingsPage() {
  const [mode, setMode] = useState<'sign-in' | 'sign-up'>('sign-up');
  const { data: session, isPending } = authClient.useSession();
  const refetchRef = useRef<(() => Promise<void>) | null>(null);

  const form = mode === 'sign-up' ? <SignUp /> : <SignIn />;
  const render = session ? (
    <>
      <UserSession />
      <Separator className="my-4" />
      <h3 className="mb-3 font-medium">Connected Accounts</h3>
      <ProviderAccountsList onRefetch={(fn) => (refetchRef.current = fn)} />
      <Separator className="my-4" />
      <h3 className="mb-3 font-medium">Add New Account</h3>
      <ImapForm onSuccess={() => refetchRef.current?.()} />
    </>
  ) : (
    form
  );

  return (
    <Card>
      <Card.Header>
        <Card.Title>Settings</Card.Title>
      </Card.Header>
      <Card.Content>
        {isPending ? <Loader2 className="mx-auto animate-spin" /> : render}
      </Card.Content>
      {!session && !isPending && (
        <>
          <Separator />
          <Card.Footer className="mx-auto">
            <Link onClick={() => setMode(mode === 'sign-in' ? 'sign-up' : 'sign-in')}>
              {mode === 'sign-in' ? 'Create an account' : 'Have an account? Sign in'}
            </Link>
          </Card.Footer>
        </>
      )}
    </Card>
  );
}
