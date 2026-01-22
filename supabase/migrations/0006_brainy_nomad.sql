ALTER TABLE "timeEntry" DROP CONSTRAINT "timeEntry_shift_id_shift_id_fk";
--> statement-breakpoint
ALTER TABLE "timeEntry" ADD CONSTRAINT "timeEntry_shift_id_shift_id_fk" FOREIGN KEY ("shift_id") REFERENCES "public"."shift"("id") ON DELETE set null ON UPDATE no action;