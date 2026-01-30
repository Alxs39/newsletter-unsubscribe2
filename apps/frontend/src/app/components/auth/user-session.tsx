import { Card } from '@heroui/react';
import authClient from '../../utils/auth-client';

export default function UserSession() {
  const { data: session } = authClient.useSession();
  return (
    <Card>
      <Card.Header>
        <Card.Title>{session?.user.email}</Card.Title>
        <Card.Description>Logged in</Card.Description>
      </Card.Header>
    </Card>
  );
}
