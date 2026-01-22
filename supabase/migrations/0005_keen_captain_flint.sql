ALTER TABLE "shift_exclude_day" RENAME COLUMN "day" TO "from";--> statement-breakpoint
ALTER TABLE "shift_include_day" ALTER COLUMN "end_date" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "shift_exclude_day" ADD COLUMN "to" timestamp;--> statement-breakpoint
ALTER TABLE "shift_include_day" ADD COLUMN "custom_time" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "shift_include_day" ADD COLUMN "start_time" text;--> statement-breakpoint
ALTER TABLE "shift_include_day" ADD COLUMN "end_time" text;