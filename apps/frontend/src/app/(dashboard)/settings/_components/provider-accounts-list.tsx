import { Mail, Server, Lock, LockOpen, Inbox } from 'lucide-react';
import type { ProviderAccountDto } from '@backend/app/modules/provider_account/provider_account.dto';

export default function ProviderAccountsList({ data }: { data: ProviderAccountDto[] }) {
  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 py-8">
        <div className="bg-muted flex h-12 w-12 items-center justify-center rounded-full">
          <Inbox className="text-muted-fg h-6 w-6" />
        </div>
        <div className="text-center">
          <p className="text-sm font-medium">No accounts connected</p>
          <p className="text-muted-fg text-sm">Add an email account below to get started.</p>
        </div>
      </div>
    );
  }

  return (
    <ul className="divide-y">
      {data.map((account) => (
        <li key={account.id} className="flex items-center justify-between py-3">
          <div className="flex items-center gap-3">
            <div className="bg-secondary/10 text-secondary flex h-9 w-9 items-center justify-center rounded-full">
              <Mail className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-medium">{account.email}</p>
              <p className="text-muted-fg flex items-center gap-1.5 text-xs">
                <Server className="h-3 w-3" />
                {account.host}:{account.port}
              </p>
            </div>
          </div>
          <span
            className={`flex items-center gap-1.5 text-xs font-medium ${account.useSsl ? 'text-success' : 'text-warning'}`}
          >
            {account.useSsl ? (
              <>
                <Lock className="h-3 w-3" /> SSL
              </>
            ) : (
              <>
                <LockOpen className="h-3 w-3" /> No SSL
              </>
            )}
          </span>
        </li>
      ))}
    </ul>
  );
}
