'use client';

import ProviderAccountsList from '../providers/provider-accounts-list';

export default function ConnectedAccountsSection() {
  return (
    <section>
      <h3 className="mb-3 font-medium">Connected Accounts</h3>
      <ProviderAccountsList />
    </section>
  );
}
