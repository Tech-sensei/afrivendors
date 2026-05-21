import { z } from "zod";

export const fundWalletAmountSchema = z.object({
  amount: z
    .string()
    .trim()
    .min(1, "Enter an amount to add")
    .refine((val) => {
      const n = Number(val);
      return Number.isFinite(n) && n > 0;
    }, "Enter a valid amount greater than 0")
    .refine((val) => {
      const n = Number(val);
      return n <= 100_000;
    }, "Amount is too large"),
});

export type FundWalletAmountValues = z.infer<typeof fundWalletAmountSchema>;
