import {
  pgTable,
  uuid,
  text,
  integer,
  boolean,
  timestamp,
  jsonb,
  pgEnum,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

/* ------------------------------------------------------------------ */
/* Enums                                                               */
/* ------------------------------------------------------------------ */

/** Where a destination sits in our rollout. Drives the "coming soon" state. */
export const destinationStatus = pgEnum("destination_status", [
  "live",
  "coming_soon",
]);

/** A course hub is either fully researched or a placeholder in the grid. */
export const hubStatus = pgEnum("hub_status", ["live", "stub"]);

/**
 * The real UK postgraduate journey, in order. Each value is a stage a
 * counselor moves an application into; applicants see the same list.
 */
export const applicationStage = pgEnum("application_stage", [
  "enquiry",
  "shortlisting",
  "documents_pending",
  "submitted",
  "offer_received",
  "offer_accepted",
  "cas_issued",
  "visa_applied",
  "visa_approved",
  "enrolled",
  "withdrawn",
]);

/** Lifecycle of an inbound consultation request. */
export const leadStatus = pgEnum("lead_status", [
  "new",
  "contacted",
  "consultation_booked",
  "converted",
  "closed",
]);

export const staffRole = pgEnum("staff_role", ["counselor", "admin"]);

/* ------------------------------------------------------------------ */
/* Content: destinations -> course hubs -> universities / deadlines     */
/* ------------------------------------------------------------------ */

export const destinations = pgTable(
  "destinations",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    slug: text("slug").notNull(),
    name: text("name").notNull(),
    flagEmoji: text("flag_emoji"),
    stampLabel: text("stamp_label"),
    tagline: text("tagline"),
    status: destinationStatus("status").notNull().default("coming_soon"),
    sortOrder: integer("sort_order").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    slugIdx: uniqueIndex("destinations_slug_idx").on(t.slug),
  }),
);

export const courseHubs = pgTable(
  "course_hubs",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    destinationId: uuid("destination_id")
      .notNull()
      .references(() => destinations.id, { onDelete: "cascade" }),
    slug: text("slug").notNull(),
    /** Boarding-pass code shown on cards and the departures board, e.g. "BUS·MGT". */
    code: text("code").notNull(),
    name: text("name").notNull(),
    icon: text("icon"),
    status: hubStatus("status").notNull().default("stub"),
    sortOrder: integer("sort_order").notNull().default(0),

    oneLiner: text("one_liner"),
    overview: text("overview"),
    specializations: jsonb("specializations").$type<string[]>().default([]),

    tuitionMin: integer("tuition_min"),
    tuitionMax: integer("tuition_max"),
    livingCostMin: integer("living_cost_min"),
    livingCostMax: integer("living_cost_max"),
    currency: text("currency").notNull().default("GBP"),

    entryRequirements: jsonb("entry_requirements").$type<string[]>().default([]),
    ieltsMin: text("ielts_min"),
    ieltsMax: text("ielts_max"),

    salaryMin: integer("salary_min"),
    salaryMax: integer("salary_max"),
    topSectors: jsonb("top_sectors").$type<string[]>().default([]),
    commonEmployers: jsonb("common_employers").$type<string[]>().default([]),

    visaNotes: jsonb("visa_notes").$type<string[]>().default([]),
    graduateRouteYears: integer("graduate_route_years").default(2),
    /** "no" | "yes" | "per_course" — ATAS is course-specific for AI/ML and engineering. */
    atasRequirement: text("atas_requirement").notNull().default("no"),
    atasLeadTimeWeeks: integer("atas_lead_time_weeks"),

    accreditation: jsonb("accreditation").$type<string[]>().default([]),
    extraNote: text("extra_note"),

    /**
     * Provenance. Ranking and fee figures go stale annually and the launch
     * spec ships placeholders — without these there is no way to tell a
     * verified figure from a placeholder once it is on the page.
     */
    sources: jsonb("sources").$type<{ label: string; url?: string; year?: number }[]>().default([]),
    dataVerifiedAt: timestamp("data_verified_at", { withTimezone: true }),

    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    slugIdx: uniqueIndex("course_hubs_dest_slug_idx").on(t.destinationId, t.slug),
    statusIdx: index("course_hubs_status_idx").on(t.status),
  }),
);

export const universities = pgTable(
  "universities",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    courseHubId: uuid("course_hub_id")
      .notNull()
      .references(() => courseHubs.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    school: text("school"),
    notableFor: text("notable_for"),
    subjectRank: text("subject_rank"),
    sortOrder: integer("sort_order").notNull().default(0),
  },
  (t) => ({
    hubIdx: index("universities_hub_idx").on(t.courseHubId),
  }),
);

export const deadlines = pgTable(
  "deadlines",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    courseHubId: uuid("course_hub_id")
      .notNull()
      .references(() => courseHubs.id, { onDelete: "cascade" }),
    intake: text("intake").notNull(),
    label: text("label").notNull(),
    detail: text("detail"),
    warning: text("warning"),
    sortOrder: integer("sort_order").notNull().default(0),
  },
  (t) => ({
    hubIdx: index("deadlines_hub_idx").on(t.courseHubId),
  }),
);

/* ------------------------------------------------------------------ */
/* People: staff, applicants                                           */
/* ------------------------------------------------------------------ */

/**
 * Mirrors a Supabase auth.users row for someone on the Gradmire side.
 * Presence of a row here is what grants admin access.
 */
export const staff = pgTable(
  "staff",
  {
    id: uuid("id").primaryKey(),
    email: text("email").notNull(),
    fullName: text("full_name"),
    role: staffRole("role").notNull().default("counselor"),
    specialization: text("specialization"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    emailIdx: uniqueIndex("staff_email_idx").on(t.email),
  }),
);

/**
 * A student. `authUserId` is null until they first sign in with a magic
 * link, so a counselor can create applications before the student has
 * ever logged in.
 */
export const applicants = pgTable(
  "applicants",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    authUserId: uuid("auth_user_id"),
    email: text("email").notNull(),
    fullName: text("full_name"),
    phone: text("phone"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    emailIdx: uniqueIndex("applicants_email_idx").on(t.email),
    authIdx: index("applicants_auth_user_idx").on(t.authUserId),
  }),
);

/* ------------------------------------------------------------------ */
/* Applications + their status history                                 */
/* ------------------------------------------------------------------ */

export const applications = pgTable(
  "applications",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    /** Short human reference a counselor can quote on a call, e.g. "GM-4F2A". */
    reference: text("reference").notNull(),
    applicantId: uuid("applicant_id")
      .notNull()
      .references(() => applicants.id, { onDelete: "cascade" }),
    courseHubId: uuid("course_hub_id").references(() => courseHubs.id, {
      onDelete: "set null",
    }),
    universityName: text("university_name").notNull(),
    programmeName: text("programme_name").notNull(),
    intake: text("intake"),
    stage: applicationStage("stage").notNull().default("enquiry"),
    /** Counselor-only. Never returned to the applicant portal. */
    internalNotes: text("internal_notes"),
    /** Shown to the applicant on their status page. */
    applicantNote: text("applicant_note"),
    assignedStaffId: uuid("assigned_staff_id").references(() => staff.id, {
      onDelete: "set null",
    }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    refIdx: uniqueIndex("applications_reference_idx").on(t.reference),
    applicantIdx: index("applications_applicant_idx").on(t.applicantId),
    stageIdx: index("applications_stage_idx").on(t.stage),
  }),
);

/** Append-only timeline. This is what the applicant portal renders. */
export const applicationEvents = pgTable(
  "application_events",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    applicationId: uuid("application_id")
      .notNull()
      .references(() => applications.id, { onDelete: "cascade" }),
    stage: applicationStage("stage").notNull(),
    note: text("note"),
    createdByStaffId: uuid("created_by_staff_id").references(() => staff.id, {
      onDelete: "set null",
    }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    appIdx: index("application_events_app_idx").on(t.applicationId),
  }),
);

/* ------------------------------------------------------------------ */
/* Inbound: consultation requests, newsletter                          */
/* ------------------------------------------------------------------ */

export const leads = pgTable(
  "leads",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    fullName: text("full_name").notNull(),
    email: text("email").notNull(),
    phone: text("phone"),
    courseHubId: uuid("course_hub_id").references(() => courseHubs.id, {
      onDelete: "set null",
    }),
    preferredIntake: text("preferred_intake"),
    message: text("message"),
    status: leadStatus("status").notNull().default("new"),
    /** Which page the form was submitted from, for attribution. */
    sourcePath: text("source_path"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    createdIdx: index("leads_created_idx").on(t.createdAt),
    statusIdx: index("leads_status_idx").on(t.status),
  }),
);

export const newsletterSubscribers = pgTable(
  "newsletter_subscribers",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    email: text("email").notNull(),
    courseHubId: uuid("course_hub_id").references(() => courseHubs.id, {
      onDelete: "set null",
    }),
    confirmed: boolean("confirmed").notNull().default(false),
    unsubscribedAt: timestamp("unsubscribed_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    emailIdx: uniqueIndex("newsletter_email_idx").on(t.email),
  }),
);

/* ------------------------------------------------------------------ */
/* Relations                                                           */
/* ------------------------------------------------------------------ */

export const destinationsRelations = relations(destinations, ({ many }) => ({
  courseHubs: many(courseHubs),
}));

export const courseHubsRelations = relations(courseHubs, ({ one, many }) => ({
  destination: one(destinations, {
    fields: [courseHubs.destinationId],
    references: [destinations.id],
  }),
  universities: many(universities),
  deadlines: many(deadlines),
}));

export const universitiesRelations = relations(universities, ({ one }) => ({
  courseHub: one(courseHubs, {
    fields: [universities.courseHubId],
    references: [courseHubs.id],
  }),
}));

export const deadlinesRelations = relations(deadlines, ({ one }) => ({
  courseHub: one(courseHubs, {
    fields: [deadlines.courseHubId],
    references: [courseHubs.id],
  }),
}));

export const applicantsRelations = relations(applicants, ({ many }) => ({
  applications: many(applications),
}));

export const applicationsRelations = relations(applications, ({ one, many }) => ({
  applicant: one(applicants, {
    fields: [applications.applicantId],
    references: [applicants.id],
  }),
  courseHub: one(courseHubs, {
    fields: [applications.courseHubId],
    references: [courseHubs.id],
  }),
  assignedStaff: one(staff, {
    fields: [applications.assignedStaffId],
    references: [staff.id],
  }),
  events: many(applicationEvents),
}));

export const applicationEventsRelations = relations(applicationEvents, ({ one }) => ({
  application: one(applications, {
    fields: [applicationEvents.applicationId],
    references: [applications.id],
  }),
}));

export const leadsRelations = relations(leads, ({ one }) => ({
  courseHub: one(courseHubs, {
    fields: [leads.courseHubId],
    references: [courseHubs.id],
  }),
}));

export const staffRelations = relations(staff, ({ many }) => ({
  assignedApplications: many(applications),
}));
