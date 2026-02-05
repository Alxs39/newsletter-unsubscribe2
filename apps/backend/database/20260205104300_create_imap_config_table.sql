CREATE TABLE "imap_config" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"host" varchar(255) NOT NULL,
	"port" integer NOT NULL,
	"useSsl" boolean DEFAULT true NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
	"deletedAt" timestamp with time zone,
	CONSTRAINT "imap_config_name_unique" UNIQUE("name")
);
--> statement-breakpoint
ALTER TABLE "provider_account" ADD COLUMN "imapConfigId" integer;--> statement-breakpoint
ALTER TABLE "session" ADD COLUMN "impersonatedBy" varchar(32);--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "role" varchar(50) DEFAULT 'user' NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "banned" boolean;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "banReason" varchar(255);--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "banExpires" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "provider_account" ADD CONSTRAINT "provider_account_imapConfigId_imap_config_id_fk" FOREIGN KEY ("imapConfigId") REFERENCES "public"."imap_config"("id") ON DELETE no action ON UPDATE no action;