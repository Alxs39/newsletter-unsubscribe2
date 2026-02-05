export interface SyncedEmail {
  id: number;
  providerAccountId: number;
  messageId: string;
  senderEmail: string;
  senderName: string | null;
  subject: string | null;
  unsubscribeLink: string | null;
  receivedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface SyncResult {
  synced: number;
  skipped: number;
}
