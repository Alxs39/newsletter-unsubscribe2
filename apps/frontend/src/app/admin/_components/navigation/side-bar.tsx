import { Mail, User } from 'lucide-react';
import AdminNavigationNavBar from './nav-bar';

export default function AdminNavigationSideBar() {
  return (
    <section className="py-6 px-3 flex flex-col gap-8 size-full">
      <Mail />
      <AdminNavigationNavBar />
      <User />
    </section>
  );
}
