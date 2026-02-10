import { Loader2 } from 'lucide-react';

export default function DashboardLoading() {
  return (
    <div className="flex justify-center size-full items-center">
      <Loader2 className="animate-spin size-8 text-muted" />
    </div>
  );
}
