import { z } from "zod";

export const addressLabelSchema = z.enum(["Home", "Work", "Other"]);

export const profileAddressFormSchema = z.object({
  label: addressLabelSchema,
  street: z
    .string()
    .trim()
    .min(1, "Street address is required")
    .max(500, "Street address is too long"),
  city: z.string().trim().min(1, "City is required").max(120, "City is too long"),
  region: z
    .string()
    .trim()
    .min(1, "State / region is required")
    .max(120, "State / region is too long"),
  postCode: z
    .string()
    .trim()
    .min(1, "Post code is required")
    .max(12, "Post code is too long"),
});

export type ProfileAddressFormValues = z.infer<typeof profileAddressFormSchema>;

export const profilePersonalFormSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required").max(80, "First name is too long"),
  lastName: z.string().trim().min(1, "Last name is required").max(80, "Last name is too long"),
  dateOfBirth: z
    .string()
    .trim()
    .max(32, "Date of birth is invalid")
    .optional()
    .or(z.literal("")),
  gender: z
    .string()
    .trim()
    .max(32, "Gender is invalid")
    .optional()
    .or(z.literal("")),
});

export type ProfilePersonalFormValues = z.infer<typeof profilePersonalFormSchema>;
