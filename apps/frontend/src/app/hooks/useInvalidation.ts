import { useEffect, useState } from 'react';

export function useInvalidation(key: string): number {
  const [version, setVersion] = useState(0);

  useEffect(() => {
    const handler = () => setVersion((v) => v + 1);
    window.addEventListener(`invalidate:${key}`, handler);
    return () => window.removeEventListener(`invalidate:${key}`, handler);
  }, [key]);

  return version;
}

export function invalidate(key: string): void {
  window.dispatchEvent(new Event(`invalidate:${key}`));
}
