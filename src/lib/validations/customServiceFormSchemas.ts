import { z } from "zod";
import type { ServiceFormDraft } from "@/types/customServiceForms";

const budgetStringSchema = z
  .string()
  .trim()
  .min(1, "Budget is required")
  .refine((val) => {
    const n = Number.parseFloat(val);
    return Number.isFinite(n) && n > 0;
  }, "Enter a valid budget greater than 0");

export const serviceFormDraftSchema = z
  .object({
    title: z.string().trim().min(1, "Title is required").max(200, "Title is too long"),
    category: z.string().trim().min(1, "Category is required"),
    service: z.string().trim().min(1, "Service is required"),
    vendorId: z.string(),
    vendorSelectionType: z.enum(["specific", "all"]),
    description: z
      .string()
      .trim()
      .min(1, "Description is required")
      .max(5000, "Description is too long"),
    preferredDate: z.string(),
    isFlexibleDates: z.boolean(),
    flexibleStart: z.string(),
    flexibleEnd: z.string(),
    preferredTime: z.string().trim().min(1, "Preferred time is required"),
    budget: budgetStringSchema,
    location: z.string(),
    isRemote: z.boolean(),
    customerName: z
      .string()
      .trim()
      .min(1, "Your name is required")
      .max(120, "Name is too long"),
    urgency: z.enum(["normal", "priority"]),
    allowMultipleQuotes: z.boolean(),
    agreeToTerms: z.literal(true, { error: "You must agree to the terms" }),
  })
  .superRefine((data, ctx) => {
    if (data.vendorSelectionType === "specific" && !data.vendorId.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Select a vendor",
        path: ["vendorId"],
      });
    }

    const hasFixedDate = Boolean(data.preferredDate.trim());
    const hasFlexible =
      data.isFlexibleDates &&
      Boolean(data.flexibleStart.trim()) &&
      Boolean(data.flexibleEnd.trim());

    if (!hasFixedDate && !hasFlexible) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Select a preferred date or a flexible date range",
        path: ["preferredDate"],
      });
    }

    if (!data.isRemote && !data.location.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Enter a location or mark as remote",
        path: ["location"],
      });
    }
  });

export type ServiceFormDraftValues = z.infer<typeof serviceFormDraftSchema>;

export function validateServiceFormDraft(data: ServiceFormDraft) {
  return serviceFormDraftSchema.safeParse(data);
}
