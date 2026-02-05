export interface ProviderAccount {
  id: number;
  email: string;
  host: string;
  port: string;
  useSsl: string;
  lastSyncAt: string | null;
  createdAt: string;
  updatedAt: string;
}
