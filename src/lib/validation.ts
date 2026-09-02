import { z } from "zod";

/** UK/international-friendly: digits, spaces, +, -, (), 7–20 chars. */
const phone = z
  .string()
  .trim()
  .regex(/^[+()\-\s\d]{7,20}$/, "Enter a phone number we can reach you on");

export const consultationSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Enter your full name")
    .max(120, "That name is too long"),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Enter an email address we can reply to")
    .max(255),
  phone: phone.optional().or(z.literal("")),
  courseHubSlug: z.string().trim().max(120).optional().or(z.literal("")),
  preferredIntake: z.string().trim().max(60).optional().or(z.literal("")),
  message: z.string().trim().max(2000, "Keep it under 2000 characters").optional(),
  sourcePath: z.string().trim().max(255).optional(),
  /** Hidden field. Bots fill it in; humans never see it. */
  website: z.string().max(0, "Rejected").optional(),
});

export type ConsultationInput = z.infer<typeof consultationSchema>;

export const newsletterSchema = z.object({
  email: z.string().trim().toLowerCase().email("Enter a valid email address").max(255),
  courseHubSlug: z.string().trim().max(120).optional().or(z.literal("")),
  website: z.string().max(0).optional(),
});
