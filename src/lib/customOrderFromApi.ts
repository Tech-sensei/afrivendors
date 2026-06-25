import type {
  CustomOrder,
  CustomOrderQuote,
  CustomOrderQuoteStatus,
  CustomOrderStatus,
  CustomOrderTimelineEvent,
} from "@/types/customOrders";
import type {
  CustomRequestApi,
  CustomRequestQuoteApi,
} from "@/types/customRequestApi";
import { normalizeDisputeFromApi } from "@/lib/normalizeDispute";

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" ? (value as Record<string, unknown>) : null;
}

function unwrapList(payload: unknown): CustomRequestApi[] {
  if (Array.isArray(payload)) return payload as CustomRequestApi[];
  const root = asRecord(payload);
  if (!root) return [];
  const data = root.data;
  if (Array.isArray(data)) return data as CustomRequestApi[];
  const nested = asRecord(data);
  if (nested && Array.isArray(nested.data)) {
    return nested.data as CustomRequestApi[];
  }
  if (Array.isArray(root.requests)) return root.requests as CustomRequestApi[];
  if (Array.isArray(root.customRequests)) {
    return root.customRequests as CustomRequestApi[];
  }
  const single = extractCustomRequest(root);
  if (single) return [single];
  return [];
}

function extractCustomRequest(value: unknown): CustomRequestApi | null {
  const record = asRecord(value);
  if (!record) return null;
  if (typeof record.id === "number") {
    return record as unknown as CustomRequestApi;
  }
  const nested = record.customRequest;
  if (nested && typeof (nested as CustomRequestApi).id === "number") {
    return nested as CustomRequestApi;
  }
  return null;
}

export function unwrapCustomRequest(payload: unknown): CustomRequestApi | null {
  if (!payload || typeof payload !== "object") return null;

  const direct = extractCustomRequest(payload);
  if (direct) return direct;

  const root = payload as Record<string, unknown>;
  const data = root.data;
  if (data && typeof data === "object") {
    const fromData = extractCustomRequest(data);
    if (fromData) return fromData;
  }

  return null;
}

export function unwrapCustomRequestList(payload: unknown): CustomRequestApi[] {
  return unwrapList(payload);
}

function formatDisplayDate(value?: string | null): string {
  if (!value) return "";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function normalizeQuoteStatus(status?: string): CustomOrderQuoteStatus {
  const key = String(status ?? "pending").toLowerCase();
  if (
    key === "accepted" ||
    key === "rejected" ||
    key === "expired" ||
    key === "withdrawn"
  ) {
    return key;
  }
  return "pending";
}

function normalizeQuote(quote: CustomRequestQuoteApi): CustomOrderQuote {
  const vendor = quote.vendor;
  const lineItems = (quote.breakdown ?? quote.lineItems ?? []).map((row) => ({
    description: row.item ?? row.description ?? "Item",
    amount: Number(row.price ?? row.amount ?? 0),
  }));
  const totalAmount = Number(
    quote.totalAmount ?? quote.total ?? quote.amount ?? lineItems.reduce((sum, row) => sum + row.amount, 0)
  );

  return {
    id: String(quote.id),
    vendorId: String(quote.vendorId ?? vendor?.id ?? ""),
    vendorName:
      quote.vendorName ??
      vendor?.businessName ??
      vendor?.name ??
      "Vendor",
    vendorAvatar: vendor?.profilePhoto ?? vendor?.image ?? undefined,
    totalAmount,
    lineItems,
    validUntil: quote.validUntil ?? "",
    message: quote.note ?? quote.message ?? undefined,
    status: normalizeQuoteStatus(quote.status),
    createdAt: formatDisplayDate(quote.createdAt),
  };
}

function getCategoryName(api: CustomRequestApi): string {
  if (typeof api.category === "string") return api.category;
  if (api.category && typeof api.category === "object") {
    return api.category.name ?? "Category";
  }
  return api.categoryName ?? "Category";
}

function getPaymentStatus(api: CustomRequestApi): CustomOrder["paymentStatus"] {
  const key = String(api.paymentStatus ?? "unpaid").toLowerCase();
  if (
    key === "paid" ||
    key === "released" ||
    key === "refunded" ||
    key === "disputed"
  ) {
    return key as CustomOrder["paymentStatus"];
  }
  if (api.acceptedQuote || api.acceptedQuoteId) return "unpaid";
  return "unpaid";
}

function mapApiStatusToUi(api: CustomRequestApi, quotes: CustomOrderQuote[]): CustomOrderStatus {
  const status = String(api.status ?? "pending").toLowerCase();
  const paymentStatus = String(api.paymentStatus ?? "").toLowerCase();
  const hasQuotes = quotes.length > 0;
  const hasAcceptedQuote = quotes.some((q) => q.status === "accepted");

  switch (status) {
    case "pending":
      return hasQuotes ? "quoting" : "submitted";
    case "accepted":
      if (paymentStatus === "released") return "closed";
      if (paymentStatus === "paid") return "paid";
      return hasAcceptedQuote ? "quote_accepted" : "payment_pending";
    case "completed":
      return paymentStatus === "released" ? "closed" : "completed";
    case "cancelled":
    case "rejected":
      return "cancelled";
    default:
      return hasQuotes ? "quoting" : "submitted";
  }
}

function buildTimeline(api: CustomRequestApi, quotes: CustomOrderQuote[]): CustomOrderTimelineEvent[] {
  const events: CustomOrderTimelineEvent[] = [];
  const createdAt = formatDisplayDate(api.createdAt);
  if (createdAt) {
    events.push({ at: createdAt, label: "Request submitted" });
  }

  for (const quote of quotes) {
    if (quote.createdAt) {
      events.push({
        at: quote.createdAt,
        label: `Quote received from ${quote.vendorName}`,
      });
    }
  }

  const accepted = quotes.find((q) => q.status === "accepted");
  if (accepted) {
    events.push({
      at: accepted.createdAt || createdAt,
      label: `Quote accepted — ${accepted.vendorName}`,
    });
  }

  const paymentStatus = String(api.paymentStatus ?? "").toLowerCase();
  if (paymentStatus === "paid" || paymentStatus === "released") {
    events.push({
      at: formatDisplayDate(api.updatedAt) || createdAt,
      label: "Payment received · funds in escrow",
    });
  }
  if (paymentStatus === "released" || api.fundsReleasedAt) {
    events.push({
      at: formatDisplayDate(api.fundsReleasedAt ?? api.updatedAt) || createdAt,
      label: "Funds released · order closed",
    });
  }

  const dispute = normalizeDisputeFromApi(api.dispute);
  if (dispute) {
    events.push({
      at: formatDisplayDate(dispute.createdAt) || createdAt,
      label: "Dispute opened",
    });
    if (dispute.escalatedAt) {
      events.push({
        at: formatDisplayDate(dispute.escalatedAt),
        label: "Dispute escalated to Afrivendors",
      });
    }
    if (dispute.resolvedAt) {
      events.push({
        at: formatDisplayDate(dispute.resolvedAt),
        label: "Dispute resolved",
      });
    }
  }

  return events;
}

export function mapCustomRequestToOrder(api: CustomRequestApi): CustomOrder {
  const quotes = (api.quotes ?? [])
    .map(normalizeQuote)
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt));

  if (api.acceptedQuote) {
    const accepted = normalizeQuote(api.acceptedQuote);
    if (!quotes.some((q) => q.id === accepted.id)) {
      quotes.push({ ...accepted, status: "accepted" });
    }
  }

  const acceptedQuoteId =
    api.acceptedQuoteId != null
      ? String(api.acceptedQuoteId)
      : quotes.find((q) => q.status === "accepted")?.id;

  const priority = String(api.priority ?? "medium").toLowerCase();
  const urgency: CustomOrder["urgency"] =
    priority === "high" ? "priority" : "normal";

  const categoryName = getCategoryName(api);

  return {
    id: String(api.id),
    referenceId:
      api.referenceId ??
      api.reference ??
      `CR-${String(api.id).padStart(4, "0")}`,
    title: api.requestTitle ?? api.title ?? "Custom request",
    category: categoryName,
    description: api.description ?? "",
    attachments: api.imageUrl ? [api.imageUrl] : [],
    openMarketLabel: `All vendors in ${categoryName}`,
    preferredDate: api.date ?? api.preferredDate ?? "",
    preferredTime: api.time ?? api.preferredTime ?? "",
    budget: Number(api.budget ?? 0),
    location: api.location ?? "",
    customerName: "",
    urgency,
    allowMultipleQuotes: true,
    status: mapApiStatusToUi(api, quotes),
    createdAt: formatDisplayDate(api.createdAt),
    quotes,
    acceptedQuoteId,
    paymentStatus: getPaymentStatus(api),
    paymentMethod:
      api.paymentMethod === "wallet" || api.paymentMethod === "online"
        ? api.paymentMethod
        : undefined,
    dispute: normalizeDisputeFromApi(api.dispute),
    timeline: buildTimeline(api, quotes),
  };
}
