'use client';

import {
  Alert,
  Button,
  FieldError,
  FieldGroup,
  Fieldset,
  Form,
  Input,
  Label,
  Separator,
  TextField,
} from '@heroui/react';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useMutation } from '../../hooks/useMutation';
import { invalidate } from '../../hooks/useInvalidation';

type ProviderAccountFields = 'email' | 'password';

export default function ImapForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { mutate, isLoading, isUnauthorized, isError, getFieldError, reset } = useMutation<
    void,
    { email: string; password: string },
    ProviderAccountFields
  >({
    url: '/provider-accounts',
    onSuccess: () => {
      setEmail('');
      setPassword('');
      invalidate('provider-accounts');
    },
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    reset();
    await mutate({ email, password });
  }

  return (
    <Form onSubmit={(e) => void handleSubmit(e)}>
      <Fieldset>
        {isUnauthorized && (
          <Alert status="danger">
            <Alert.Indicator />
            <Alert.Content>
              <Alert.Title>Invalid credentials</Alert.Title>
              <Alert.Description>
                Unable to authenticate with the provided email and password.
              </Alert.Description>
            </Alert.Content>
          </Alert>
        )}
        {isError && !isUnauthorized && (
          <Alert status="danger">
            <Alert.Indicator />
            <Alert.Content>
              <Alert.Title>Connection error</Alert.Title>
              <Alert.Description>Unable to connect to the IMAP server.</Alert.Description>
            </Alert.Content>
          </Alert>
        )}
        <FieldGroup>
          <TextField
            name="email"
            type="email"
            value={email}
            onChange={setEmail}
            isInvalid={!!getFieldError('email')}
          >
            <Label>Email</Label>
            <Input placeholder="user@example.com" />
            <FieldError>{getFieldError('email')}</FieldError>
          </TextField>
          <TextField
            name="password"
            type="password"
            value={password}
            onChange={setPassword}
            isInvalid={!!getFieldError('password')}
          >
            <Label>Password</Label>
            <Input placeholder="••••••••" />
            <FieldError>{getFieldError('password')}</FieldError>
          </TextField>
        </FieldGroup>
        <Fieldset.Actions className="flex flex-col gap-4">
          <div className="flex w-full gap-2 *:w-full">
            <Button variant="tertiary" type="submit" isPending={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin" /> Connecting...
                </>
              ) : (
                'Connect account'
              )}
            </Button>
          </div>
          <Separator />
        </Fieldset.Actions>
      </Fieldset>
    </Form>
  );
}
