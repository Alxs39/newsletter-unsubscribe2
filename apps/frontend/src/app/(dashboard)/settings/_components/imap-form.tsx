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
  TextField,
} from '@heroui/react';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@/hooks/useMutation';
import type { ImapConfigDto } from '@backend/app/modules/imap_config/imap_config.dto';

type ProviderAccountFields = 'email' | 'password' | 'imapConfigId';

export default function ImapForm({ imapConfigs }: { imapConfigs: ImapConfigDto[] }) {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [imapConfigId, setImapConfigId] = useState('');

  const { mutate, isLoading, isUnauthorized, isError, getFieldError, reset } = useMutation<
    void,
    { email: string; password: string; imapConfigId: number },
    ProviderAccountFields
  >({
    url: '/provider-accounts',
    onSuccess: () => {
      setEmail('');
      setPassword('');
      setImapConfigId('');
      router.refresh();
    },
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    reset();
    await mutate({ email, password, imapConfigId: Number(imapConfigId) });
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
          <div className="flex flex-col gap-1">
            <Label>Email Provider</Label>
            <select
              value={imapConfigId}
              onChange={(e) => setImapConfigId(e.target.value)}
              required
              className="border-input bg-bg rounded-md border px-3 py-2 text-sm"
            >
              <option value="">Select a provider...</option>
              {imapConfigs.map((config) => (
                <option key={config.id} value={config.id}>
                  {config.name}
                </option>
              ))}
            </select>
            {getFieldError('imapConfigId') && (
              <span className="text-danger text-sm">{getFieldError('imapConfigId')}</span>
            )}
          </div>
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
        <Button
          variant="tertiary"
          type="submit"
          isPending={isLoading}
          isDisabled={!imapConfigId}
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="animate-spin" /> Connecting...
            </>
          ) : (
            'Connect account'
          )}
        </Button>
      </Fieldset>
    </Form>
  );
}
