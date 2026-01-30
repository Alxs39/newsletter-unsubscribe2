CREATE TABLE "provider_account" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" varchar(32) NOT NULL,
	"email" varchar(255) NOT NULL,
	"host" varchar(255) NOT NULL,
	"port" varchar(10) NOT NULL,
	"useSsl" varchar(5) NOT NULL,
	"password" varchar(255) NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
	"deletedAt" timestamp with time zone,
	CONSTRAINT "provider_account_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "provider_account" ADD CONSTRAINT "provider_account_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;