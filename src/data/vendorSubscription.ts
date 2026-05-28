export const VENDOR_TRIAL_MONTHS = 6;

export type VendorBillingIntervalId =
  | "monthly"
  | "quarterly"
  | "biannual"
  | "yearly";

export interface VendorBillingInterval {
  id: VendorBillingIntervalId;
  label: string;
  months: number;
  price: number;
  priceLabel: string;
  perMonthLabel: string;
  saveLabel?: string;
  popular?: boolean;
}

export const VENDOR_BILLING_INTERVALS: VendorBillingInterval[] = [
  {
    id: "monthly",
    label: "Monthly",
    months: 1,
    price: 29,
    priceLabel: "£29",
    perMonthLabel: "£29/mo",
  },
  {
    id: "quarterly",
    label: "3 months",
    months: 3,
    price: 79,
    priceLabel: "£79",
    perMonthLabel: "~£26/mo",
    saveLabel: "Save 9%",
    popular: true,
  },
  {
    id: "biannual",
    label: "6 months",
    months: 6,
    price: 149,
    priceLabel: "£149",
    perMonthLabel: "~£25/mo",
    saveLabel: "Save 14%",
  },
  {
    id: "yearly",
    label: "Yearly",
    months: 12,
    price: 249,
    priceLabel: "£249",
    perMonthLabel: "~£21/mo",
    saveLabel: "Save 28%",
  },
];

export const VENDOR_SUBSCRIPTION_FEATURES = [
  "Visible in marketplace search & categories",
  "Unlimited service listings",
  "Bookings & custom quote requests",
  "Wallet, payouts & Stripe Connect",
  "Messages & notifications",
  "Business profile & reviews",
];

export const VENDOR_PROGRAMME_STATS = [
  { value: "6 mo", label: "Free visibility" },
  { value: "£0", label: "To start" },
  { value: "4", label: "Billing options" },
  { value: "24/7", label: "Online bookings" },
] as const;

export const VENDOR_HOW_IT_WORKS = [
  {
    step: "01",
    title: "Create your vendor account",
    body: "Register on the vendor dashboard with your business name, category, and service area.",
    highlight: "Takes about 5 minutes",
  },
  {
    step: "02",
    title: `${VENDOR_TRIAL_MONTHS} months free visibility`,
    body: "Your profile goes live in client search and category pages immediately — no subscription payment during the trial.",
    highlight: "No card required",
  },
  {
    step: "03",
    title: "Verify & get paid",
    body: "Complete email verification and Stripe Connect so you can accept bookings and receive payouts.",
    highlight: "Secure payouts",
  },
  {
    step: "04",
    title: "Choose billing after trial",
    body: "Before trial ends, pick monthly, 3-month, 6-month, or yearly billing to stay visible. Without a plan, your listing is hidden until you subscribe.",
    highlight: "Flexible cycles",
  },
] as const;

export const VENDOR_VISIBILITY_COMPARISON = [
  {
    label: "During free trial",
    visible: true,
    items: ["Listed in search & categories", "Receive bookings & quotes", "Full vendor dashboard"],
  },
  {
    label: "After trial (subscribed)",
    visible: true,
    items: ["Same visibility as trial", "Billed on your chosen cycle", "Cancel anytime at period end"],
  },
  {
    label: "After trial (no plan)",
    visible: false,
    items: ["Hidden from client search", "Existing clients may still message you", "Subscribe anytime to go live again"],
  },
] as const;

export const VENDOR_SUBSCRIPTION_FAQ = [
  {
    question: "Is there really a free period?",
    answer: `Yes. Every new vendor gets ${VENDOR_TRIAL_MONTHS} months free from the date you register. Your profile stays visible to clients during the trial — no card required to start.`,
  },
  {
    question: "What happens after the free period?",
    answer:
      "After 6 months, choose a billing cycle (monthly, 3 months, 6 months, or yearly) to keep your listing visible. If you do not subscribe, your profile is hidden from client search until you activate a plan.",
  },
  {
    question: "Can I change billing cycle later?",
    answer:
      "Yes. You can switch between monthly, 3-month, 6-month, and yearly billing from your vendor dashboard. Changes apply on your next renewal.",
  },
  {
    question: "When do I pay commission on bookings?",
    answer:
      "Platform commission applies to completed bookings and custom orders separately from your listing subscription. Subscription only controls marketplace visibility.",
  },
];
