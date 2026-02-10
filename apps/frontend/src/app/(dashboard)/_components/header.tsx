'use client';

import { Tabs } from '@heroui/react';
import { usePathname } from 'next/navigation';
import Logo from '@/components/ui/logo';

interface HeaderProps {
  isAdmin: boolean;
}

export default function Header({ isAdmin }: HeaderProps) {
  const pathname = usePathname();

  const selectedKey = pathname.startsWith('/admin')
    ? 'admin'
    : pathname === '/settings'
      ? 'settings'
      : 'dashboard';

  return (
    <header className="w-9/12 mx-auto flex justify-between items-center min-h-24">
      <div className="flex items-center gap-2">
        <Logo size={32} />
        <span className="font-semibold">Newsletter Unsubscribe</span>
      </div>
      <Tabs selectedKey={selectedKey}>
        <Tabs.ListContainer>
          <Tabs.List>
            <Tabs.Tab href="/" id="dashboard">
              Dashboard
              <Tabs.Indicator />
            </Tabs.Tab>
            <Tabs.Tab href="/settings" id="settings">
              Settings
              <Tabs.Indicator />
            </Tabs.Tab>
            {isAdmin && (
              <Tabs.Tab href="/admin" id="admin">
                Admin
                <Tabs.Indicator />
              </Tabs.Tab>
            )}
          </Tabs.List>
        </Tabs.ListContainer>
      </Tabs>
    </header>
  );
}
