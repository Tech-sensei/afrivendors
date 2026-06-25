import type { DisputableOrder, OrderDispute } from "@/types/dispute";

export function isCompletedOrderStatus(status: string): boolean {
  return status.toLowerCase() === "completed";
}

export function isOrderDisputeOpen(
  dispute: OrderDispute | null | undefined
): boolean {
  if (!dispute) return false;
  const s = dispute.status.toLowerCase();
  return s !== "resolved" && s !== "closed" && s !== "cancelled";
}

export function isOrderDisputeEscalated(
  dispute: OrderDispute | null | undefined
): boolean {
  if (!dispute) return false;
  if (dispute.escalatedBy != null || dispute.escalatedAt != null) return true;
  const s = dispute.status.toLowerCase();
  const resolverKey = String(dispute.resolver ?? "").toLowerCase();
  return s === "escalated" || resolverKey === "admin";
}

export function isOrderDisputed(order: DisputableOrder): boolean {
  return (
    isOrderDisputeOpen(order.dispute) ||
    String(order.paymentStatus ?? "").toLowerCase() === "disputed"
  );
}

export function isOrderFundsReleased(order: DisputableOrder): boolean {
  return String(order.paymentStatus ?? "").toLowerCase() === "released";
}

export function canOpenOrderDispute(order: DisputableOrder): boolean {
  return (
    isCompletedOrderStatus(order.status) &&
    String(order.paymentStatus ?? "").toLowerCase() === "paid" &&
    !isOrderDisputeOpen(order.dispute)
  );
}

export function canReleaseOrderFunds(order: DisputableOrder): boolean {
  return (
    isCompletedOrderStatus(order.status) &&
    String(order.paymentStatus ?? "").toLowerCase() === "paid" &&
    !isOrderDisputeOpen(order.dispute)
  );
}

export function canResolveDisputePayVendor(order: DisputableOrder): boolean {
  return (
    isOrderDisputeOpen(order.dispute) &&
    String(order.paymentStatus ?? "").toLowerCase() === "paid" &&
    !isOrderDisputeEscalated(order.dispute)
  );
}

export function canEscalateOrderDispute(order: DisputableOrder): boolean {
  if (!isOrderDisputeOpen(order.dispute)) return false;
  if (isOrderDisputeEscalated(order.dispute)) return false;
  const s = order.dispute!.status.toLowerCase();
  return s === "pending" || s === "open";
}

export function paymentStatusDisplayLabel(
  paymentStatus: string | undefined,
  dispute?: OrderDispute | null
): string {
  if (isOrderDisputeEscalated(dispute)) {
    return "Under admin review";
  }
  if (isOrderDisputeOpen(dispute)) {
    return "Dispute open";
  }
  switch (String(paymentStatus ?? "").toLowerCase()) {
    case "paid":
      return "Paid";
    case "released":
      return "Released to vendor";
    case "disputed":
      return "Dispute open";
    case "refunded":
      return "Refunded";
    case "failed":
      return "Payment failed";
    default:
      return "Pending";
  }
}
