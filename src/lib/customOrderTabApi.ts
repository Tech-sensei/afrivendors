import type { CustomOrderTabId } from "@/types/customOrders";
import type { CustomRequestApiStatus } from "@/types/customRequestApi";

export function customOrderTabToApiStatuses(
  tab: CustomOrderTabId
): CustomRequestApiStatus[] | undefined {
  switch (tab) {
    case "all":
      return undefined;
    case "waiting":
      return ["pending"];
    case "active":
      return ["accepted"];
    case "completed":
      return ["completed"];
    case "cancelled":
      return ["cancelled", "rejected"];
    default:
      return undefined;
  }
}
