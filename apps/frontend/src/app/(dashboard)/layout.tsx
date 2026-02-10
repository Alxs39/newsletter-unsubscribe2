import { getSession } from '@/utils/server-api-client';
import Header from './_components/header';
import AuthGate from './_components/auth/auth-gate';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();

  return (
    <>
      <Header isAdmin={session?.user?.role === 'admin'} />
      {session ? children : <AuthGate />}
    </>
  );
}
