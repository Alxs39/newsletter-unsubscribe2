'use client';

import { Card, Link, Separator } from '@heroui/react';
import { useState } from 'react';
import SignIn from '../auth/sign-in';
import SignUp from '../auth/sign-up';

type AuthMode = 'sign-in' | 'sign-up';

export default function AuthGate() {
  const [mode, setMode] = useState<AuthMode>('sign-up');

  const toggleMode = () => setMode((m) => (m === 'sign-in' ? 'sign-up' : 'sign-in'));

  return (
    <>
      <Card.Content>{mode === 'sign-up' ? <SignUp /> : <SignIn />}</Card.Content>
      <Separator />
      <Card.Footer className="mx-auto">
        <Link onClick={toggleMode}>
          {mode === 'sign-in' ? 'Create an account' : 'Have an account? Sign in'}
        </Link>
      </Card.Footer>
    </>
  );
}
