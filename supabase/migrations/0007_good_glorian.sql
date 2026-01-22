ALTER TABLE "shift_assignment" DROP CONSTRAINT "shift_assignment_site_id_site_id_fk";
--> statement-breakpoint
ALTER TABLE "shift_assignment" DROP COLUMN "site_id";