'use client';

import {
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
import { useEffect, useState } from 'react';
import authClient from '../../utils/auth-client';

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{
    email?: string;
    password?: string;
  }>({});

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);

    try {
      const { error } = await authClient.signUp.email({ email, password, name });

      if (error) {
        switch (error?.code) {
          case 'INVALID_PASSWORD':
          case 'PASSWORD_TOO_LONG':
          case 'PASSWORD_TOO_SHORT':
            setFieldErrors((prev) => ({ ...prev, password: 'Password is too short' }));
            setHasError(true);
            break;
          case 'INVALID_EMAIL':
            setFieldErrors((prev) => ({ ...prev, email: 'Email is invalid' }));
            setHasError(true);
            break;
          default:
            setHasError(true);
            break;
        }
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    setHasError(false);
  }, [email, password, name]);

  return (
    <Form onSubmit={(e) => void handleSubmit(e)}>
      <Fieldset>
        <FieldGroup>
          <TextField name="name" type="text" value={name} onChange={setName} isInvalid={hasError}>
            <Label>Name</Label>
            <Input placeholder="John Doe" />
          </TextField>
          <TextField
            name="email"
            type="email"
            value={email}
            onChange={setEmail}
            isInvalid={hasError}
          >
            <Label>Email</Label>
            <Input placeholder="user@example.com" />
            <FieldError>{fieldErrors.email}</FieldError>
          </TextField>
          <TextField
            name="password"
            type="password"
            value={password}
            onChange={setPassword}
            isInvalid={hasError}
          >
            <Label>Password</Label>
            <Input placeholder="••••••••" />
            <FieldError>{fieldErrors.password}</FieldError>
          </TextField>
        </FieldGroup>
        <Fieldset.Actions>
          <Button variant="tertiary" isPending={loading} type="submit" className="w-full">
            {loading ? (
              <>
                <Loader2 className="animate-spin" /> Create account
              </>
            ) : (
              'Create account'
            )}
          </Button>
        </Fieldset.Actions>
      </Fieldset>
    </Form>
  );
}
