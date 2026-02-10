export interface ProviderAccountDto {
  id: number;
  email: string;
  host: string;
  port: number;
  useSsl: boolean;
  lastSyncAt: string | null;
  syncStatus: 'idle' | 'syncing' | 'failed';
  syncError: string | null;
  createdAt: string;
  updatedAt: string;
}
