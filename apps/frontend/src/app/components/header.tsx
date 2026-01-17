'use client';

import { Tabs } from '@heroui/react';
import { Mail } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();

  const selectedKey = pathname === '/settings' ? 'settings' : 'dashboard';

  return (
    <header className="w-9/12 mx-auto flex justify-between items-center min-h-24">
      <div className="flex items-center gap-2">
        <Mail />
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
          </Tabs.List>
        </Tabs.ListContainer>
      </Tabs>
    </header>
  );
}
