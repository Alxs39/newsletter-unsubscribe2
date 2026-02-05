'use client';

import { Loader2 } from 'lucide-react';
import authClient from '../../utils/auth-client';

interface AuthGuardProps {
  children: React.ReactNode;
  fallback: React.ReactNode;
}

export default function AuthGuard({ children, fallback }: AuthGuardProps) {
  const { data: session, isPending } = authClient.useSession();

  if (isPending) {
    return <Loader2 className="mx-auto mt-8 animate-spin" />;
  }

  if (!session) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
