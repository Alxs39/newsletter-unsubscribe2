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
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import authClient from '@/utils/auth-client';

export default function SignIn() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);

    try {
      const result = await authClient.signIn.email({ email, password });

      if (result.error) {
        setHasError(true);
        throw new Error(result.error.message ?? 'Sign in failed');
      }

      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    setHasError(false);
  }, [email, password]);

  return (
    <Form onSubmit={(e) => void handleSubmit(e)}>
      <Fieldset>
        <FieldGroup>
          <TextField
            name="email"
            type="email"
            value={email}
            onChange={setEmail}
            isInvalid={hasError}
          >
            <Label>Email</Label>
            <Input placeholder="user@example.com" />
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
            <FieldError>Could not sign in. Please check your email and password.</FieldError>
          </TextField>
        </FieldGroup>
        <Fieldset.Actions>
          <Button variant="tertiary" className="w-full" type="submit" isPending={loading}>
            {loading ? (
              <>
                <Loader2 /> Signing in...
              </>
            ) : (
              'Sign in'
            )}
          </Button>
        </Fieldset.Actions>
      </Fieldset>
    </Form>
  );
}
