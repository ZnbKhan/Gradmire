CREATE TYPE "public"."application_stage" AS ENUM('enquiry', 'shortlisting', 'documents_pending', 'submitted', 'offer_received', 'offer_accepted', 'cas_issued', 'visa_applied', 'visa_approved', 'enrolled', 'withdrawn');--> statement-breakpoint
CREATE TYPE "public"."destination_status" AS ENUM('live', 'coming_soon');--> statement-breakpoint
CREATE TYPE "public"."hub_status" AS ENUM('live', 'stub');--> statement-breakpoint
CREATE TYPE "public"."lead_status" AS ENUM('new', 'contacted', 'consultation_booked', 'converted', 'closed');--> statement-breakpoint
CREATE TYPE "public"."staff_role" AS ENUM('counselor', 'admin');--> statement-breakpoint
CREATE TABLE "applicants" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"auth_user_id" uuid,
	"email" text NOT NULL,
	"full_name" text,
	"phone" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "application_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"application_id" uuid NOT NULL,
	"stage" "application_stage" NOT NULL,
	"note" text,
	"created_by_staff_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "applications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"reference" text NOT NULL,
	"applicant_id" uuid NOT NULL,
	"course_hub_id" uuid,
	"university_name" text NOT NULL,
	"programme_name" text NOT NULL,
	"intake" text,
	"stage" "application_stage" DEFAULT 'enquiry' NOT NULL,
	"internal_notes" text,
	"applicant_note" text,
	"assigned_staff_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "course_hubs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"destination_id" uuid NOT NULL,
	"slug" text NOT NULL,
	"code" text NOT NULL,
	"name" text NOT NULL,
	"icon" text,
	"status" "hub_status" DEFAULT 'stub' NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"one_liner" text,
	"overview" text,
	"specializations" jsonb DEFAULT '[]'::jsonb,
	"tuition_min" integer,
	"tuition_max" integer,
	"living_cost_min" integer,
	"living_cost_max" integer,
	"currency" text DEFAULT 'GBP' NOT NULL,
	"entry_requirements" jsonb DEFAULT '[]'::jsonb,
	"ielts_min" text,
	"ielts_max" text,
	"salary_min" integer,
	"salary_max" integer,
	"top_sectors" jsonb DEFAULT '[]'::jsonb,
	"common_employers" jsonb DEFAULT '[]'::jsonb,
	"visa_notes" jsonb DEFAULT '[]'::jsonb,
	"graduate_route_years" integer DEFAULT 2,
	"atas_requirement" text DEFAULT 'no' NOT NULL,
	"atas_lead_time_weeks" integer,
	"accreditation" jsonb DEFAULT '[]'::jsonb,
	"extra_note" text,
	"sources" jsonb DEFAULT '[]'::jsonb,
	"data_verified_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "deadlines" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"course_hub_id" uuid NOT NULL,
	"intake" text NOT NULL,
	"label" text NOT NULL,
	"detail" text,
	"warning" text,
	"sort_order" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "destinations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"flag_emoji" text,
	"stamp_label" text,
	"tagline" text,
	"status" "destination_status" DEFAULT 'coming_soon' NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "leads" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"full_name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text,
	"course_hub_id" uuid,
	"preferred_intake" text,
	"message" text,
	"status" "lead_status" DEFAULT 'new' NOT NULL,
	"source_path" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "newsletter_subscribers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"course_hub_id" uuid,
	"confirmed" boolean DEFAULT false NOT NULL,
	"unsubscribed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "staff" (
	"id" uuid PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"full_name" text,
	"role" "staff_role" DEFAULT 'counselor' NOT NULL,
	"specialization" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "universities" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"course_hub_id" uuid NOT NULL,
	"name" text NOT NULL,
	"school" text,
	"notable_for" text,
	"subject_rank" text,
	"sort_order" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
ALTER TABLE "application_events" ADD CONSTRAINT "application_events_application_id_applications_id_fk" FOREIGN KEY ("application_id") REFERENCES "public"."applications"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "application_events" ADD CONSTRAINT "application_events_created_by_staff_id_staff_id_fk" FOREIGN KEY ("created_by_staff_id") REFERENCES "public"."staff"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "applications" ADD CONSTRAINT "applications_applicant_id_applicants_id_fk" FOREIGN KEY ("applicant_id") REFERENCES "public"."applicants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "applications" ADD CONSTRAINT "applications_course_hub_id_course_hubs_id_fk" FOREIGN KEY ("course_hub_id") REFERENCES "public"."course_hubs"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "applications" ADD CONSTRAINT "applications_assigned_staff_id_staff_id_fk" FOREIGN KEY ("assigned_staff_id") REFERENCES "public"."staff"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "course_hubs" ADD CONSTRAINT "course_hubs_destination_id_destinations_id_fk" FOREIGN KEY ("destination_id") REFERENCES "public"."destinations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "deadlines" ADD CONSTRAINT "deadlines_course_hub_id_course_hubs_id_fk" FOREIGN KEY ("course_hub_id") REFERENCES "public"."course_hubs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "leads" ADD CONSTRAINT "leads_course_hub_id_course_hubs_id_fk" FOREIGN KEY ("course_hub_id") REFERENCES "public"."course_hubs"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "newsletter_subscribers" ADD CONSTRAINT "newsletter_subscribers_course_hub_id_course_hubs_id_fk" FOREIGN KEY ("course_hub_id") REFERENCES "public"."course_hubs"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "universities" ADD CONSTRAINT "universities_course_hub_id_course_hubs_id_fk" FOREIGN KEY ("course_hub_id") REFERENCES "public"."course_hubs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "applicants_email_idx" ON "applicants" USING btree ("email");--> statement-breakpoint
CREATE INDEX "applicants_auth_user_idx" ON "applicants" USING btree ("auth_user_id");--> statement-breakpoint
CREATE INDEX "application_events_app_idx" ON "application_events" USING btree ("application_id");--> statement-breakpoint
CREATE UNIQUE INDEX "applications_reference_idx" ON "applications" USING btree ("reference");--> statement-breakpoint
CREATE INDEX "applications_applicant_idx" ON "applications" USING btree ("applicant_id");--> statement-breakpoint
CREATE INDEX "applications_stage_idx" ON "applications" USING btree ("stage");--> statement-breakpoint
CREATE UNIQUE INDEX "course_hubs_dest_slug_idx" ON "course_hubs" USING btree ("destination_id","slug");--> statement-breakpoint
CREATE INDEX "course_hubs_status_idx" ON "course_hubs" USING btree ("status");--> statement-breakpoint
CREATE INDEX "deadlines_hub_idx" ON "deadlines" USING btree ("course_hub_id");--> statement-breakpoint
CREATE UNIQUE INDEX "destinations_slug_idx" ON "destinations" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "leads_created_idx" ON "leads" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "leads_status_idx" ON "leads" USING btree ("status");--> statement-breakpoint
CREATE UNIQUE INDEX "newsletter_email_idx" ON "newsletter_subscribers" USING btree ("email");--> statement-breakpoint
CREATE UNIQUE INDEX "staff_email_idx" ON "staff" USING btree ("email");--> statement-breakpoint
CREATE INDEX "universities_hub_idx" ON "universities" USING btree ("course_hub_id");