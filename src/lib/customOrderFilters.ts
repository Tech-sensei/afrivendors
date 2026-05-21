import type { CustomOrder, CustomOrderStatus, CustomOrderTabId } from "@/types/customOrders";

const WAITING: CustomOrderStatus[] = ["submitted", "quoting"];
const ACTIVE: CustomOrderStatus[] = [
  "paid",
  "scheduled",
  "in_progress",
  "completed",
  "quote_accepted",
  "payment_pending",
];
const COMPLETED: CustomOrderStatus[] = ["closed"];
const CANCELLED: CustomOrderStatus[] = ["cancelled", "expired", "draft"];

export const CUSTOM_ORDER_TABS: {
  id: CustomOrderTabId;
  label: string;
}[] = [
  { id: "all", label: "All" },
  { id: "waiting", label: "Waiting for quotes" },
  { id: "active", label: "Active" },
  { id: "completed", label: "Completed" },
  { id: "cancelled", label: "Cancelled" },
];

export function filterOrdersByTab(
  orders: CustomOrder[],
  tab: CustomOrderTabId
): CustomOrder[] {
  if (tab === "all") return orders;
  const map: Record<Exclude<CustomOrderTabId, "all">, CustomOrderStatus[]> = {
    waiting: WAITING,
    active: ACTIVE,
    completed: COMPLETED,
    cancelled: CANCELLED,
  };
  const statuses = map[tab];
  return orders.filter((o) => statuses.includes(o.status));
}

export function countOrdersByTab(
  orders: CustomOrder[],
  tab: CustomOrderTabId
): number {
  return filterOrdersByTab(orders, tab).length;
}
