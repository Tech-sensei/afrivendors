import { z } from "zod";

export const clientReviewFormSchema = z.object({
  rating: z
    .number()
    .int()
    .min(1, "Please select a rating")
    .max(5, "Invalid rating"),
  comment: z
    .string()
    .trim()
    .min(1, "Review comment is required")
    .max(5000, "Review is too long"),
});

export type ClientReviewFormValues = z.infer<typeof clientReviewFormSchema>;
