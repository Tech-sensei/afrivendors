/** Normalized saved payment method for display (from Stripe or similar). */
export interface SavedPaymentAccount {
  id: string;
  type: "bank" | "mobile_money";
  name: string;
  details: string;
  isDefault: boolean;
}
