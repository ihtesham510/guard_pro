CREATE TYPE "public"."employee_position" AS ENUM('employee', 'senior', 'supervisor');  -- > statement-breakpoint
CREATE TYPE "public"."employee_status" AS ENUM('active', 'inactive', 'terminated');  -- > statement-breakpoint
CREATE TABLE "account" (
	"id" text PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
-- > statement-breakpoint
CREATE TABLE "address" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"address_line_1" text NOT NULL,
	"address_line_2" text,
	"state" text NOT NULL,
	"city" text NOT NULL,
	"zip" text NOT NULL,
	"country" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
-- > statement-breakpoint
CREATE TABLE "company" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"address_id" uuid,
	"phone" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
-- > statement-breakpoint
CREATE TABLE "employee" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userId" text NOT NULL,
	"employee_code" text NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text NOT NULL,
	"address_id" uuid,
	"position" "employee_position" DEFAULT 'employee' NOT NULL,
	"password" text,
	"hire_date" timestamp DEFAULT now() NOT NULL,
	"status" "employee_status" DEFAULT 'active' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "employee_employee_code_unique" UNIQUE("employee_code")
);
-- > statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
-- > statement-breakpoint
CREATE TABLE "site" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"company_id" uuid NOT NULL,
	"userId" text NOT NULL,
	"client_name" text,
	"contact_person" text,
	"contact_phone" text,
	"contact_email" text,
	"name" text NOT NULL,
	"address_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
-- > statement-breakpoint
CREATE TABLE "site_pictrues" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"site_id" uuid,
	"url" text NOT NULL,
	"storage_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
-- > statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"image" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
-- > statement-breakpoint
CREATE TABLE "verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
-- > statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;  -- > statement-breakpoint
ALTER TABLE "company" ADD CONSTRAINT "company_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;  -- > statement-breakpoint
ALTER TABLE "company" ADD CONSTRAINT "company_address_id_address_id_fk" FOREIGN KEY ("address_id") REFERENCES "public"."address"("id") ON DELETE cascade ON UPDATE no action;  -- > statement-breakpoint
ALTER TABLE "employee" ADD CONSTRAINT "employee_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;  -- > statement-breakpoint
ALTER TABLE "employee" ADD CONSTRAINT "employee_address_id_address_id_fk" FOREIGN KEY ("address_id") REFERENCES "public"."address"("id") ON DELETE cascade ON UPDATE no action;  -- > statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;  -- > statement-breakpoint
ALTER TABLE "site" ADD CONSTRAINT "site_company_id_company_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."company"("id") ON DELETE cascade ON UPDATE no action;  -- > statement-breakpoint
ALTER TABLE "site" ADD CONSTRAINT "site_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;  -- > statement-breakpoint
ALTER TABLE "site" ADD CONSTRAINT "site_address_id_address_id_fk" FOREIGN KEY ("address_id") REFERENCES "public"."address"("id") ON DELETE cascade ON UPDATE no action;  -- > statement-breakpoint
ALTER TABLE "site_pictrues" ADD CONSTRAINT "site_pictrues_site_id_site_id_fk" FOREIGN KEY ("site_id") REFERENCES "public"."site"("id") ON DELETE cascade ON UPDATE no action;  -- > statement-breakpoint
CREATE INDEX "company_user_id_idx" ON "company" USING btree ("user_id");  -- > statement-breakpoint
CREATE INDEX "company_name_idx" ON "company" USING btree ("name");  -- > statement-breakpoint
CREATE INDEX "employee_status_idx" ON "employee" USING btree ("status");  -- > statement-breakpoint
CREATE INDEX "employee_code_idx" ON "employee" USING btree ("employee_code");  -- > statement-breakpoint
CREATE INDEX "site_company_id_idx" ON "site" USING btree ("company_id");  -- > statement-breakpoint
CREATE INDEX "site_client_name_idx" ON "site" USING btree ("client_name");


-- Use Postgres to create a bucket.
insert into storage.buckets
  (id, name, public)
values
  ('site_pictures', 'site_pictures', true);


CREATE POLICY "Allow anonymous users to upload to site_pictrues"
ON storage.objects
FOR INSERT TO anon WITH CHECK (bucket_id = 'site_pictures');


CREATE POLICY "Allow anonymous users can delete from site_pictrues"
ON storage.objects
FOR DELETE TO anon;

