import { z } from "zod";

const markdown = (max: number) => z.string().trim().min(1).max(max);

export const slugSchema = z
  .string()
  .trim()
  .toLowerCase()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and hyphens");

export const httpsUrlSchema = z
  .string()
  .trim()
  .max(500)
  .refine((value) => value === "" || /^https:\/\/\S+$/i.test(value), "Use an https address, or leave this blank");

export const pageSchema = z.object({
  title: z.string().trim().min(8).max(70),
  description: z.string().trim().min(40).max(160),
  canonicalPath: z.string().trim().regex(/^\/[a-z0-9/-]*$/, "Start the path with /"),
  heading: z.string().trim().min(2).max(120),
  body: markdown(8000),
});

export const settingsSchema = z.object({
  companyName: z.string().trim().min(2).max(80),
  shortName: z.string().trim().min(2).max(40),
  caption: z.string().trim().min(8).max(140),
  introduction: markdown(8000),
  contactEmail: z.union([z.literal(""), z.string().trim().email().max(120)]),
  contactPhone: z.string().trim().max(40),
  address: z.string().trim().max(240),
  enquiryRetentionMonths: z.coerce.number().int().min(1).max(120),
});

export const featureSchema = z.object({
  title: z.string().trim().min(2).max(120),
  body: z.string().trim().min(2).max(600),
});

export const productSchema = z.object({
  slug: slugSchema,
  name: z.string().trim().min(2).max(80),
  code: z.string().trim().min(2).max(12),
  summary: z.string().trim().min(12).max(220),
  introduction: markdown(8000),
  audience: z.string().trim().min(2).max(160),
  onlineEnabled: z.boolean(),
  offlineEnabled: z.boolean(),
  onlineSummary: z.string().trim().min(8).max(220),
  offlineSummary: z.string().trim().min(8).max(220),
  onlineDetail: markdown(4000),
  offlineDetail: markdown(4000),
  imageUrl: httpsUrlSchema,
  sortOrder: z.coerce.number().int().min(0).max(999),
  published: z.boolean(),
  seoTitle: z.string().trim().min(8).max(70),
  seoDescription: z.string().trim().min(40).max(160),
  features: z.array(featureSchema).min(1).max(24),
}).refine((value) => value.onlineEnabled || value.offlineEnabled, {
  message: "Offer the product online, on the premises, or both",
  path: ["onlineEnabled"],
});

export const enquirySchema = z.object({
  name: z.string().trim().min(2, "Enter your name.").max(80, "That name is too long."),
  email: z.string().trim().email("Enter a valid email address.").max(120, "That email is too long."),
  organisation: z.string().trim().max(120, "That organisation name is too long."),
  phone: z.string().trim().max(40, "That phone number is too long."),
  message: z.string().trim().min(10, "Write at least a sentence.").max(4000, "That message is too long."),
  productInterest: z.string().trim().max(80),
});

/** For passwords set from the desk. Sign-in still accepts the 8-character minimum the seed allows. */
const newPassword = z
  .string()
  .min(12, "Use at least 12 characters.")
  .max(200, "That password is too long.");

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Enter your current password."),
    newPassword,
    confirmPassword: z.string(),
  })
  .refine((value) => value.newPassword === value.confirmPassword, {
    message: "The two new passwords do not match.",
    path: ["confirmPassword"],
  });

export const newUserSchema = z.object({
  name: z.string().trim().min(2, "Enter a name.").max(80),
  email: z.string().trim().toLowerCase().email("Enter a valid email address.").max(120),
  password: newPassword,
});

export const setPasswordSchema = z.object({
  userId: z.string().min(1),
  password: newPassword,
});

export const loginSchema = z.object({
  email: z.string().trim().email().max(120),
  password: z.string().min(8).max(200),
});

export function fieldErrors(error: z.ZodError) {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path.join(".") || "form";
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}
