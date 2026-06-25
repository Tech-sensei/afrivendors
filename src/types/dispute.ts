export type DisputeOrderType = "appointment" | "custom_request";

export interface OrderDispute {
  id: number;
  reason: string;
  resolution: string | null;
  status: string;
  resolver: string | null;
  resolvedBy: number | null;
  resolvedAt: string | null;
  escalatedBy: string | null;
  escalatedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export type OrderPaymentStatus =
  | "pending"
  | "paid"
  | "failed"
  | "released"
  | "disputed"
  | "refunded"
  | "unpaid";

export interface DisputableOrder {
  status: string;
  paymentStatus?: string;
  dispute?: OrderDispute | null;
}
