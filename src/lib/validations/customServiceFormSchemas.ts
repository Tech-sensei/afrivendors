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

export const customOrderDraftSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(200, "Title is too long"),
  categoryId: z
    .number({ error: "Category is required" })
    .int()
    .positive("Category is required"),
  budget: budgetStringSchema,
  date: z.string().trim().min(1, "Date is required"),
  time: z.string().trim().min(1, "Time is required"),
  location: z.string().trim(),
  priority: z.enum(["low", "medium", "high"]),
  description: z.string().trim().max(5000, "Description is too long"),
  imageUrl: z.string().trim(),
  image: z.custom<File | null>(),
});

export type CustomOrderDraftValues = z.infer<typeof customOrderDraftSchema>;

export function validateCustomOrderDraft(data: CustomOrderDraft) {
  return customOrderDraftSchema.safeParse(data);
}

/** @deprecated Use validateCustomOrderDraft */
export const validateServiceFormDraft = validateCustomOrderDraft;

/** @deprecated Use customOrderDraftSchema */
export const serviceFormDraftSchema = customOrderDraftSchema;
