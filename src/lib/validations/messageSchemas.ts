import { z } from "zod";

export const chatMessageSchema = z.object({
  message: z
    .string()
    .trim()
    .min(1, "Enter a message")
    .max(4000, "Message is too long"),
});

export type ChatMessageFormValues = z.infer<typeof chatMessageSchema>;
