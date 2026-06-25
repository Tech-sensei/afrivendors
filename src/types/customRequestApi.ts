/** `GET /custom-request/me?status=` query values. */
export type CustomRequestApiStatus =
  | "pending"
  | "accepted"
  | "rejected"
  | "cancelled"
  | "completed";

export type CustomRequestApiPriority = "low" | "medium" | "high";

export type CustomRequestQuoteApiStatus =
  | "pending"
  | "accepted"
  | "rejected"
  | "expired"
  | "withdrawn";

export interface CustomRequestQuoteLineItemApi {
  item?: string;
  description?: string;
  price?: number;
  amount?: number;
}

export interface CustomRequestQuoteApi {
  id: number;
  vendorId?: number | string;
  vendor?: {
    id?: number | string;
    businessName?: string;
    name?: string;
    profilePhoto?: string | null;
    image?: string | null;
  };
  vendorName?: string;
  breakdown?: CustomRequestQuoteLineItemApi[];
  lineItems?: CustomRequestQuoteLineItemApi[];
  totalAmount?: number;
  total?: number;
  amount?: number;
  note?: string | null;
  message?: string | null;
  validUntil?: string | null;
  status?: CustomRequestQuoteApiStatus | string;
  createdAt?: string;
}

export interface CustomRequestApi {
  id: number;
  requestTitle?: string;
  title?: string;
  referenceId?: string;
  reference?: string;
  categoryId?: number;
  category?: { id?: number; name?: string } | string;
  categoryName?: string;
  description?: string;
  budget?: number;
  date?: string;
  preferredDate?: string;
  time?: string;
  preferredTime?: string;
  location?: string;
  priority?: CustomRequestApiPriority | string;
  imageUrl?: string | null;
  status?: CustomRequestApiStatus | string;
  paymentStatus?: string | null;
  paymentMethod?: "online" | "wallet" | string | null;
  acceptedQuoteId?: number | null;
  acceptedQuote?: CustomRequestQuoteApi | null;
  quotes?: CustomRequestQuoteApi[];
  createdAt?: string;
  updatedAt?: string;
  completedAt?: string | null;
  fundsReleasedAt?: string | null;
  dispute?: unknown;
}

export type PayCustomRequestPayload = {
  quoteId: number;
  paymentMethod: "online" | "wallet";
};

export type PayCustomRequestResponse = {
  checkoutUrl?: string;
  sessionId?: string;
};
