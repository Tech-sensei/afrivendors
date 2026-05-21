import { z } from "zod";
import type { CustomOrderDraft } from "@/types/customOrders";

const budgetStringSchema = z
  .string()
  .trim()
  .min(1, "Budget is required")
  .refine((val) => {
    const n = Number.parseFloat(val);
    return Number.isFinite(n) && n > 0;
  }, "Enter a valid budget greater than 0");

export const customOrderDraftSchema = z
  .object({
    title: z.string().trim().min(1, "Title is required").max(200, "Title is too long"),
    category: z.string().trim().min(1, "Category is required"),
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
    location: z.string().trim().min(1, "Location is required"),
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
  });

export type CustomOrderDraftValues = z.infer<typeof customOrderDraftSchema>;

export function validateCustomOrderDraft(data: CustomOrderDraft) {
  return customOrderDraftSchema.safeParse(data);
}

/** @deprecated Use validateCustomOrderDraft */
export const validateServiceFormDraft = validateCustomOrderDraft;

/** @deprecated Use customOrderDraftSchema */
export const serviceFormDraftSchema = customOrderDraftSchema;
