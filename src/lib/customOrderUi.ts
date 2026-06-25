import type { CustomOrder, CustomOrderQuote } from "@/types/customOrders";
import {
  canEscalateOrderDispute,
  canOpenOrderDispute,
  canReleaseOrderFunds,
  canResolveDisputePayVendor,
  isOrderDisputeEscalated,
  isOrderDisputed,
  isOrderFundsReleased,
  paymentStatusDisplayLabel,
} from "@/lib/orderDispute";

export function getPendingQuotes(order: CustomOrder): CustomOrderQuote[] {
  return order.quotes.filter((q) => q.status === "pending");
}

export function getAcceptedQuote(order: CustomOrder): CustomOrderQuote | undefined {
  if (!order.acceptedQuoteId) return undefined;
  return order.quotes.find((q) => q.id === order.acceptedQuoteId);
}

export function getQuoteSummary(order: CustomOrder): string {
  const pending = getPendingQuotes(order).length;
  const accepted = getAcceptedQuote(order);

  if (isOrderDisputeEscalated(order.dispute)) {
    return "Under admin review";
  }
  if (isOrderDisputed(order)) {
    return "Dispute open";
  }
  if (["paid", "scheduled", "in_progress"].includes(order.status)) {
    return accepted ? `Paid · ${accepted.vendorName}` : "In progress";
  }
  if (order.status === "completed") {
    return order.paymentStatus === "paid" ? "Awaiting fund release" : "Completed";
  }
  if (order.status === "closed") {
    return "Order completed";
  }
  if (pending > 0) {
    return `${pending} quote${pending === 1 ? "" : "s"} to review`;
  }
  if (order.status === "submitted") {
    return "Awaiting vendor quotes";
  }
  return order.openMarketLabel;
}

export function canCancelOrder(order: CustomOrder): boolean {
  return order.status === "submitted" || order.status === "quoting";
}

export function orderNeedsRelease(order: CustomOrder): boolean {
  return order.status === "completed" && canReleaseOrderFunds(order);
}

export function canOpenCustomOrderDispute(order: CustomOrder): boolean {
  return order.status === "completed" && canOpenOrderDispute(order);
}

export function canReleaseCustomOrderFunds(order: CustomOrder): boolean {
  return order.status === "completed" && canReleaseOrderFunds(order);
}

export function canEscalateCustomOrderDispute(order: CustomOrder): boolean {
  return canEscalateOrderDispute(order);
}

export function canResolveCustomOrderDispute(order: CustomOrder): boolean {
  return canResolveDisputePayVendor(order);
}

export function isCustomOrderDisputed(order: CustomOrder): boolean {
  return isOrderDisputed(order);
}

export function isCustomOrderFundsReleased(order: CustomOrder): boolean {
  return isOrderFundsReleased(order) || order.status === "closed";
}

export function customOrderPaymentStatusLabel(order: CustomOrder): string {
  return paymentStatusDisplayLabel(order.paymentStatus, order.dispute);
}
