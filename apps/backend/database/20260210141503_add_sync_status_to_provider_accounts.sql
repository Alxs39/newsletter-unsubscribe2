ALTER TABLE "provider_account" ADD COLUMN "sync_status" varchar(20) DEFAULT 'idle' NOT NULL;--> statement-breakpoint
ALTER TABLE "provider_account" ADD COLUMN "sync_error" varchar(500);