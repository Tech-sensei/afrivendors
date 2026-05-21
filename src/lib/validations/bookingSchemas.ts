import { z } from "zod";

export const bookingContactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Full name is required")
    .max(120, "Name is too long"),
  email: z
    .string()
    .trim()
    .min(1, "Email address is required")
    .check(z.email("Please enter a valid email address")),
  phone: z
    .string()
    .trim()
    .min(1, "Phone number is required")
    .max(30, "Phone number is too long")
    .regex(/^[\d\s+()-]+$/, "Enter a valid phone number"),
  notes: z
    .string()
    .trim()
    .max(2000, "Notes are too long")
    .optional()
    .or(z.literal("")),
});

export type BookingContactFormValues = z.infer<typeof bookingContactSchema>;

export const bookingPaymentMethodSchema = z.enum(["online", "wallet"]);

export const bookingSubmitSchema = z
  .object({
    hasServices: z.boolean(),
    date: z.date().optional(),
    selectedTime: z.string().trim(),
    contact: bookingContactSchema,
    paymentMethod: bookingPaymentMethodSchema,
    hasInsufficientFunds: z.boolean(),
  })
  .superRefine((data, ctx) => {
    if (!data.hasServices) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Select at least one service",
        path: ["hasServices"],
      });
    }
    if (!data.date) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Select an appointment date",
        path: ["date"],
      });
    }
    if (!data.selectedTime) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Select an appointment time",
        path: ["selectedTime"],
      });
    }
    if (data.paymentMethod === "wallet" && data.hasInsufficientFunds) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Insufficient wallet balance for this booking",
        path: ["paymentMethod"],
      });
    }
  });

export type BookingSubmitInput = {
  hasServices: boolean;
  date: Date | undefined;
  selectedTime: string;
  contact: z.infer<typeof bookingContactSchema>;
  paymentMethod: z.infer<typeof bookingPaymentMethodSchema>;
  hasInsufficientFunds: boolean;
};
