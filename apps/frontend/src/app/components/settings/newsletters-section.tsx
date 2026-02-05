'use client';

import SyncButton from '../synced-emails/sync-button';
import SyncedEmailsList from '../synced-emails/synced-emails-list';

export default function NewslettersSection() {
  return (
    <section>
      <h3 className="mb-3 font-medium">Newsletters</h3>
      <SyncButton />
      <div className="mt-4">
        <SyncedEmailsList />
      </div>
    </section>
  );
}
