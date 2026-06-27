import type { OrderDispute } from "@/types/dispute";

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
  vendorUserId: number | null;
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
  paymentStatus?: "unpaid" | "paid" | "refunded" | "released" | "disputed";
  paymentMethod?: "online" | "wallet";
  dispute?: OrderDispute | null;
  scheduledAt?: string;
  notes?: string;
  timeline: CustomOrderTimelineEvent[];
}

export interface CustomOrderDraft {
  /** Maps to `requestTitle` */
  title: string;
  /** Maps to `categoryId` */
  categoryId: number | null;
  budget: string;
  date: string;
  time: string;
  location: string;
  priority: "low" | "medium" | "high";
  description: string;
  imageUrl: string;
  image: File | null;
}

export type CustomOrderTabId =
  | "all"
  | "waiting"
  | "active"
  | "completed"
  | "cancelled";

export type CustomOrderMessageContext = {
  orderId: string;
  orderTitle: string;
  otherUserId: number;
  contactName: string;
  contactAvatar?: string;
  contactSubtitle?: string;
};
