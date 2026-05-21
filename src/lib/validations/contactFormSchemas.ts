import { z } from "zod";

export const publicContactFormSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required").max(80, "First name is too long"),
  lastName: z.string().trim().min(1, "Last name is required").max(80, "Last name is too long"),
  email: z
    .string()
    .trim()
    .min(1, "Email address is required")
    .check(z.email("Please enter a valid email address")),
  phone: z
    .string()
    .trim()
    .max(30, "Phone number is too long")
    .regex(/^[\d\s+()-]*$/, "Enter a valid phone number")
    .optional()
    .or(z.literal("")),
  subject: z
    .string()
    .trim()
    .min(1, "Subject is required")
    .max(200, "Subject is too long"),
  message: z
    .string()
    .trim()
    .min(1, "Message is required")
    .max(5000, "Message is too long"),
});

export type PublicContactFormValues = z.infer<typeof publicContactFormSchema>;
