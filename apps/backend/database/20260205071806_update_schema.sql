CREATE TABLE "synced_email" (
	"id" serial PRIMARY KEY NOT NULL,
	"providerAccountId" integer NOT NULL,
	"messageId" varchar(255) NOT NULL,
	"senderEmail" varchar(255) NOT NULL,
	"senderName" varchar(255),
	"subject" varchar(500),
	"unsubscribeLink" varchar(2000),
	"receivedAt" timestamp with time zone,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
	"deletedAt" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "provider_account" ALTER COLUMN "port" SET DATA TYPE integer USING "port"::integer;--> statement-breakpoint
ALTER TABLE "provider_account" ALTER COLUMN "useSsl" SET DATA TYPE boolean USING "useSsl"::boolean;--> statement-breakpoint
ALTER TABLE "provider_account" ADD COLUMN "lastSyncAt" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "provider_account" ADD COLUMN "lastUidValidity" bigint;--> statement-breakpoint
ALTER TABLE "provider_account" ADD COLUMN "lastHighestUid" bigint;--> statement-breakpoint
ALTER TABLE "provider_account" ADD COLUMN "lastModseq" bigint;--> statement-breakpoint
ALTER TABLE "synced_email" ADD CONSTRAINT "synced_email_providerAccountId_provider_account_id_fk" FOREIGN KEY ("providerAccountId") REFERENCES "public"."provider_account"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "synced_email_providerAccountId_messageId_index" ON "synced_email" USING btree ("providerAccountId","messageId");