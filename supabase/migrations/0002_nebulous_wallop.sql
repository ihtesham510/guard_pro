ALTER TABLE "shift" DROP CONSTRAINT "shift_site_id_site_id_fk";
--> statement-breakpoint
ALTER TABLE "shift_exclude_day" DROP CONSTRAINT "shift_exclude_day_shift_id_shift_id_fk";
--> statement-breakpoint
ALTER TABLE "shift_include_day" DROP CONSTRAINT "shift_include_day_shift_id_shift_id_fk";
--> statement-breakpoint
ALTER TABLE "shift_assignment" DROP CONSTRAINT "shift_assignment_site_id_site_id_fk";
--> statement-breakpoint
ALTER TABLE "shift_assignment" DROP CONSTRAINT "shift_assignment_employee_id_employee_id_fk";
--> statement-breakpoint
ALTER TABLE "shift_assignment" DROP CONSTRAINT "shift_assignment_shift_id_shift_id_fk";
--> statement-breakpoint
ALTER TABLE "shift_assignment_request" DROP CONSTRAINT "shift_assignment_request_shift_id_shift_id_fk";
--> statement-breakpoint
ALTER TABLE "shift_assignment_request" DROP CONSTRAINT "shift_assignment_request_employee_id_employee_id_fk";
--> statement-breakpoint
ALTER TABLE "timeEntry" DROP CONSTRAINT "timeEntry_shift_id_shift_id_fk";
--> statement-breakpoint
ALTER TABLE "timeEntry" DROP CONSTRAINT "timeEntry_employee_id_employee_id_fk";
--> statement-breakpoint
ALTER TABLE "shift" ADD CONSTRAINT "shift_site_id_site_id_fk" FOREIGN KEY ("site_id") REFERENCES "public"."site"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shift_exclude_day" ADD CONSTRAINT "shift_exclude_day_shift_id_shift_id_fk" FOREIGN KEY ("shift_id") REFERENCES "public"."shift"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shift_include_day" ADD CONSTRAINT "shift_include_day_shift_id_shift_id_fk" FOREIGN KEY ("shift_id") REFERENCES "public"."shift"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shift_assignment" ADD CONSTRAINT "shift_assignment_site_id_site_id_fk" FOREIGN KEY ("site_id") REFERENCES "public"."site"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shift_assignment" ADD CONSTRAINT "shift_assignment_employee_id_employee_id_fk" FOREIGN KEY ("employee_id") REFERENCES "public"."employee"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shift_assignment" ADD CONSTRAINT "shift_assignment_shift_id_shift_id_fk" FOREIGN KEY ("shift_id") REFERENCES "public"."shift"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shift_assignment_request" ADD CONSTRAINT "shift_assignment_request_shift_id_shift_id_fk" FOREIGN KEY ("shift_id") REFERENCES "public"."shift"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shift_assignment_request" ADD CONSTRAINT "shift_assignment_request_employee_id_employee_id_fk" FOREIGN KEY ("employee_id") REFERENCES "public"."employee"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "timeEntry" ADD CONSTRAINT "timeEntry_shift_id_shift_id_fk" FOREIGN KEY ("shift_id") REFERENCES "public"."shift"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "timeEntry" ADD CONSTRAINT "timeEntry_employee_id_employee_id_fk" FOREIGN KEY ("employee_id") REFERENCES "public"."employee"("id") ON DELETE cascade ON UPDATE no action;