import { z } from "zod";
import { SUPPORT_TICKET_CATEGORIES } from "@/data/supportTickets";

const ticketCategoryValues = [...SUPPORT_TICKET_CATEGORIES] as [
  string,
  ...string[],
];

export const ticketPrioritySchema = z.enum([
  "low",
  "medium",
  "high",
  "urgent",
]);

export const createSupportTicketSchema = z.object({
  subject: z
    .string()
    .trim()
    .min(1, "Subject is required")
    .max(200, "Subject is too long"),
  category: z.enum(ticketCategoryValues, {
    error: "Select a valid category",
  }),
  priority: ticketPrioritySchema,
  description: z
    .string()
    .trim()
    .min(1, "Description is required")
    .max(5000, "Description is too long"),
});

export type CreateSupportTicketFormValues = z.infer<
  typeof createSupportTicketSchema
>;

export const editSupportTicketSchema = createSupportTicketSchema;

export type EditSupportTicketFormValues = z.infer<
  typeof editSupportTicketSchema
>;

export const supportTicketReplySchema = z.object({
  message: z
    .string()
    .trim()
    .min(1, "Reply cannot be empty")
    .max(5000, "Reply is too long"),
});
