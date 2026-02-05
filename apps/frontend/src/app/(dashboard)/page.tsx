'use client';

import { Link } from '@heroui/react';
import AuthGuard from '../components/auth/auth-guard';
import DashboardContent from '../components/dashboard/dashboard-content';

export default function DashboardPage() {
  return (
    <AuthGuard
      fallback={
        <p className="text-muted-fg py-8 text-center text-sm">
          Please <Link href="/settings">sign in</Link> to access your dashboard.
        </p>
      }
    >
      <DashboardContent />
    </AuthGuard>
  );
}
