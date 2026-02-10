import { redirect } from 'next/navigation';
import { getSession } from '@/utils/server-api-client';
import AdminNavigationSideBar from './_components/navigation/side-bar';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();

  if (session?.user.role !== 'admin') {
    redirect('/');
  }

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <aside className="w-60 bg-neutral-50 overflow-y-auto flex shrink-0">
        <AdminNavigationSideBar />
      </aside>
      <main className="flex-1 bg-neutral-50 overflow-y-auto py-4 pr-2">
        <section className="bg-white rounded-xl p-6 size-full">{children}</section>
      </main>
    </div>
  );
}
