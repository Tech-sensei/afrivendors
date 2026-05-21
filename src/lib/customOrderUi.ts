import type { CustomOrder, CustomOrderQuote } from "@/types/customOrders";

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

  if (["paid", "scheduled", "in_progress"].includes(order.status)) {
    return accepted ? `Paid · ${accepted.vendorName}` : "In progress";
  }
  if (order.status === "completed") {
    return "Awaiting fund release";
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
  return order.status === "completed";
}
