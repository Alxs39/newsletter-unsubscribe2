import { Card } from '@heroui/react';
import { User, CircleCheck } from 'lucide-react';

export default function UserSession({ email }: { email: string }) {
  return (
    <Card>
      <Card.Header>
        <div className="flex items-center gap-2">
          <User className="text-muted-fg h-4 w-4" />
          <Card.Title>Account</Card.Title>
        </div>
        <Card.Description>Your authenticated session.</Card.Description>
      </Card.Header>
      <Card.Content>
        <div className="flex items-center gap-4">
          <div className="bg-primary/10 text-primary flex h-10 w-10 items-center justify-center rounded-full">
            <User className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">{email}</p>
            <p className="text-muted-fg text-sm">Account owner</p>
          </div>
          <span className="text-success flex items-center gap-1.5 text-xs font-medium">
            <CircleCheck className="h-3.5 w-3.5" />
            Connected
          </span>
        </div>
      </Card.Content>
    </Card>
  );
}
