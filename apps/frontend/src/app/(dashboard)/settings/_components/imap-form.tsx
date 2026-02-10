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
  ListBox,
  Select,
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
          <Select
            placeholder="Select a provider..."
            value={imapConfigId}
            onChange={(v) => setImapConfigId(String(v))}
            isRequired
            isInvalid={!!getFieldError('imapConfigId')}
          >
            <Label>Email Provider</Label>
            <Select.Trigger>
              <Select.Value />
              <Select.Indicator />
            </Select.Trigger>
            <FieldError>{getFieldError('imapConfigId')}</FieldError>
            <Select.Popover>
              <ListBox>
                {imapConfigs.map((config) => (
                  <ListBox.Item key={config.id} id={String(config.id)}>
                    {config.name}
                  </ListBox.Item>
                ))}
              </ListBox>
            </Select.Popover>
          </Select>
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
