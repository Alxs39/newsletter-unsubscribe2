'use client';

import { Button } from '@heroui/react';

export default function AdminError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-12">
      <p className="text-danger text-sm">Something went wrong.</p>
      <Button variant="secondary" size="sm" onPress={reset}>
        Try again
      </Button>
    </div>
  );
}
