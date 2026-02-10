'use client';

import { Button, Tabs } from '@heroui/react';
import { LogOut } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import Logo from '@/components/ui/logo';
import authClient from '@/utils/auth-client';

interface HeaderProps {
  isAdmin: boolean;
}

export default function Header({ isAdmin }: HeaderProps) {
  const pathname = usePathname();
  const router = useRouter();

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
      <div className="flex items-center gap-4">
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
        <Button
          variant="ghost"
          size="sm"
          onPress={() => {
            void authClient.signOut().then(() => router.refresh());
          }}
        >
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
}
