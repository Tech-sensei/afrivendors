export type CustomOrderStatus =
  | "draft"
  | "submitted"
  | "quoting"
  | "quote_accepted"
  | "payment_pending"
  | "paid"
  | "scheduled"
  | "in_progress"
  | "completed"
  | "closed"
  | "cancelled"
  | "expired";

export type CustomOrderQuoteStatus =
  | "pending"
  | "accepted"
  | "rejected"
  | "expired"
  | "withdrawn";

export interface CustomOrderQuote {
  id: string;
  vendorId: string;
  vendorName: string;
  vendorAvatar?: string;
  totalAmount: number;
  lineItems: { description: string; amount: number }[];
  validUntil: string;
  message?: string;
  status: CustomOrderQuoteStatus;
  createdAt: string;
}

export interface CustomOrderTimelineEvent {
  at: string;
  label: string;
}

export interface CustomOrder {
  id: string;
  referenceId: string;
  title: string;
  category: string;
  description: string;
  attachments: string[];
  openMarketLabel: string;
  preferredDate: string;
  flexibleDates?: { start: string; end: string };
  preferredTime: string;
  budget: number;
  location: string;
  customerName: string;
  urgency: "normal" | "priority";
  allowMultipleQuotes: boolean;
  status: CustomOrderStatus;
  createdAt: string;
  quotes: CustomOrderQuote[];
  acceptedQuoteId?: string;
  paymentStatus?: "unpaid" | "paid" | "refunded";
  paymentMethod?: "online" | "wallet";
  scheduledAt?: string;
  notes?: string;
  timeline: CustomOrderTimelineEvent[];
}

export interface CustomOrderDraft {
  title: string;
  category: string;
  description: string;
  attachments: string[];
  preferredDate: string;
  isFlexibleDates: boolean;
  flexibleStart: string;
  flexibleEnd: string;
  preferredTime: string;
  budget: string;
  location: string;
  customerName: string;
  urgency: "normal" | "priority";
  allowMultipleQuotes: boolean;
  agreeToTerms: boolean;
}

export type CustomOrderTabId =
  | "all"
  | "waiting"
  | "active"
  | "completed"
  | "cancelled";
