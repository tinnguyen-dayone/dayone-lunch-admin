-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE "users" (
	"user_id" bigint PRIMARY KEY NOT NULL,
	"username" text,
	"total_unpaid" numeric DEFAULT '0.0'
);
--> statement-breakpoint
CREATE TABLE "transactions" (
	"transaction_id" serial PRIMARY KEY NOT NULL,
	"user_id" bigint,
	"commented_count" integer DEFAULT 0,
	"lunch_price" text,
	"total_price" numeric DEFAULT '0.0',
	"transaction_image" text,
	"transaction_confirmed" boolean DEFAULT false,
	"transaction_date" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
	"paid" boolean DEFAULT false,
	"ticket_message_id" bigint
);
--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE no action ON UPDATE no action;
*/