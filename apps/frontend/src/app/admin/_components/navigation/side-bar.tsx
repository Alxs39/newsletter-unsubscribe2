import { User } from 'lucide-react';
import Logo from '@/components/ui/logo';
import AdminNavigationNavBar from './nav-bar';

export default function AdminNavigationSideBar() {
  return (
    <section className="py-6 px-3 flex flex-col gap-8 size-full">
      <Logo size={28} />
      <AdminNavigationNavBar />
      <User />
    </section>
  );
}
