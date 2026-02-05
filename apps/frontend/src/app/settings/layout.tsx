'use client';

import { Card } from '@heroui/react';

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return (
    <Card>
      <Card.Header>
        <Card.Title>Settings</Card.Title>
      </Card.Header>
      {children}
    </Card>
  );
}
