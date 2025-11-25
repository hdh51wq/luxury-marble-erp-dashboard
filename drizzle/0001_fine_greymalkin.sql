DROP INDEX "session_token_unique";--> statement-breakpoint
DROP INDEX "user_email_unique";--> statement-breakpoint
ALTER TABLE `account` ALTER COLUMN "access_token_expires_at" TO "access_token_expires_at" text;--> statement-breakpoint
CREATE UNIQUE INDEX `session_token_unique` ON `session` (`token`);--> statement-breakpoint
CREATE UNIQUE INDEX `user_email_unique` ON `user` (`email`);--> statement-breakpoint
ALTER TABLE `account` ALTER COLUMN "refresh_token_expires_at" TO "refresh_token_expires_at" text;--> statement-breakpoint
ALTER TABLE `account` ALTER COLUMN "created_at" TO "created_at" text NOT NULL;--> statement-breakpoint
ALTER TABLE `account` ALTER COLUMN "updated_at" TO "updated_at" text NOT NULL;--> statement-breakpoint
ALTER TABLE `session` ALTER COLUMN "expires_at" TO "expires_at" text NOT NULL;--> statement-breakpoint
ALTER TABLE `session` ALTER COLUMN "created_at" TO "created_at" text NOT NULL;--> statement-breakpoint
ALTER TABLE `session` ALTER COLUMN "updated_at" TO "updated_at" text NOT NULL;--> statement-breakpoint
ALTER TABLE `user` ALTER COLUMN "email_verified" TO "email_verified" integer NOT NULL DEFAULT false;--> statement-breakpoint
ALTER TABLE `user` ALTER COLUMN "created_at" TO "created_at" text NOT NULL;--> statement-breakpoint
ALTER TABLE `user` ALTER COLUMN "updated_at" TO "updated_at" text NOT NULL;--> statement-breakpoint
ALTER TABLE `verification` ALTER COLUMN "expires_at" TO "expires_at" text NOT NULL;--> statement-breakpoint
ALTER TABLE `verification` ALTER COLUMN "created_at" TO "created_at" text;--> statement-breakpoint
ALTER TABLE `verification` ALTER COLUMN "updated_at" TO "updated_at" text;