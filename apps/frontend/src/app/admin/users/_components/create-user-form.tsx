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
import authClient from '@/utils/auth-client';

interface CreateUserFormProps {
  onSuccess?: () => void;
}

export default function CreateUserForm({ onSuccess }: CreateUserFormProps = {}) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'user' | 'admin'>('user');
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setIsError(false);
    setIsSuccess(false);

    try {
      const result = await authClient.admin.createUser({
        email,
        password,
        name,
        role,
      });

      if (result.error) {
        setIsError(true);
        setErrorMessage(result.error.message ?? 'Failed to create user');
        return;
      }

      setName('');
      setEmail('');
      setPassword('');
      setRole('user');
      setIsSuccess(true);
      onSuccess?.();
    } catch {
      setIsError(true);
      setErrorMessage('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form onSubmit={(e) => void handleSubmit(e)}>
      <Fieldset>
        {isError && (
          <Alert status="danger">
            <Alert.Indicator />
            <Alert.Content>
              <Alert.Title>{errorMessage}</Alert.Title>
            </Alert.Content>
          </Alert>
        )}
        {isSuccess && (
          <Alert status="success">
            <Alert.Indicator />
            <Alert.Content>
              <Alert.Title>User created successfully.</Alert.Title>
            </Alert.Content>
          </Alert>
        )}
        <FieldGroup>
          <TextField name="name" value={name} onChange={setName}>
            <Label>Name</Label>
            <Input placeholder="John Doe" />
            <FieldError />
          </TextField>
          <TextField name="email" type="email" value={email} onChange={setEmail}>
            <Label>Email</Label>
            <Input placeholder="user@example.com" />
            <FieldError />
          </TextField>
          <TextField name="password" type="password" value={password} onChange={setPassword}>
            <Label>Password</Label>
            <Input placeholder="••••••••" />
            <FieldError />
          </TextField>
          <div>
            <Label>Role</Label>
            <select
              className="border-input bg-background ring-offset-background placeholder:text-muted-fg focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
              value={role}
              onChange={(e) => setRole(e.target.value as 'user' | 'admin')}
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        </FieldGroup>
        <Fieldset.Actions>
          <Button variant="tertiary" type="submit" isPending={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="animate-spin" /> Creating...
              </>
            ) : (
              'Create User'
            )}
          </Button>
        </Fieldset.Actions>
      </Fieldset>
    </Form>
  );
}
