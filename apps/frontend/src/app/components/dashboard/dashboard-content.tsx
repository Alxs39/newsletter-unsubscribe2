'use client';

import SyncButton from '../synced-emails/sync-button';
import NewslettersTable from './newsletters-table';

export default function DashboardContent() {
  return (
    <>
      <SyncButton />
      <div className="mt-4">
        <NewslettersTable />
      </div>
    </>
  );
}
