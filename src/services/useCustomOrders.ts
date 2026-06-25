import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import http from "@/lib/http";
import {
  useEscalateDispute,
  useOpenDispute,
  useResolveDisputeReleaseFunds,
} from "@/services/useDisputes";
import {
  mapCustomRequestToOrder,
  unwrapCustomRequest,
  unwrapCustomRequestList,
} from "@/lib/customOrderFromApi";
import { customOrderTabToApiStatuses } from "@/lib/customOrderTabApi";
import type { CustomOrder, CustomOrderDraft, CustomOrderTabId } from "@/types/customOrders";
import type {
  CustomRequestApiStatus,
  PayCustomRequestPayload,
  PayCustomRequestResponse,
} from "@/types/customRequestApi";

export const CUSTOM_ORDERS_QUERY_KEY = "custom-orders";
export const CUSTOM_ORDERS_COUNTS_KEY = "custom-orders-counts";
export const CUSTOM_ORDER_DETAIL_KEY = "custom-order-detail";

function getErrorMessage(err: unknown): string {
  const ax = err as {
    response?: { data?: { message?: string; responseMessage?: string } };
  };
  return (
    ax?.response?.data?.responseMessage ||
    ax?.response?.data?.message ||
    "Something went wrong. Please try again."
  );
}

async function fetchCustomRequestsByStatuses(
  statuses?: CustomRequestApiStatus[]
): Promise<CustomOrder[]> {
  const fetchOne = async (status?: CustomRequestApiStatus) => {
    const { data } = await http.get("/custom-request/me", {
      params: status ? { status } : undefined,
    });
    return unwrapCustomRequestList(data);
  };

  if (!statuses || statuses.length === 0) {
    const list = await fetchOne();
    return list.map(mapCustomRequestToOrder);
  }

  if (statuses.length === 1) {
    const list = await fetchOne(statuses[0]);
    return list.map(mapCustomRequestToOrder);
  }

  const batches = await Promise.all(statuses.map((status) => fetchOne(status)));
  const byId = new Map<string, CustomOrder>();
  for (const batch of batches) {
    for (const row of batch) {
      byId.set(String(row.id), mapCustomRequestToOrder(row));
    }
  }
  return Array.from(byId.values());
}

export async function fetchCustomOrderById(id: number): Promise<CustomOrder> {
  const { data } = await http.get(`/custom-request/${id}`);
  const row = unwrapCustomRequest(data);
  if (!row) {
    throw new Error("Custom request not found");
  }
  return mapCustomRequestToOrder(row);
}

function buildCreateFormData(draft: CustomOrderDraft): FormData {
  if (!draft.categoryId) {
    throw new Error("Category is required");
  }

  const formData = new FormData();
  formData.append("requestTitle", draft.title.trim());
  formData.append("categoryId", String(draft.categoryId));
  formData.append("budget", String(Number.parseFloat(draft.budget)));
  formData.append("date", draft.date);
  formData.append("time", draft.time);

  if (draft.location.trim()) {
    formData.append("location", draft.location.trim());
  }
  if (draft.priority) {
    formData.append("priority", draft.priority);
  }
  if (draft.description.trim()) {
    formData.append("description", draft.description.trim());
  }
  if (draft.image) {
    formData.append("image", draft.image);
  } else if (draft.imageUrl.trim()) {
    formData.append("imageUrl", draft.imageUrl.trim());
  }

  return formData;
}

export function useCustomOrders(tab: CustomOrderTabId) {
  const statuses = customOrderTabToApiStatuses(tab);

  return useQuery<CustomOrder[]>({
    queryKey: [CUSTOM_ORDERS_QUERY_KEY, tab],
    queryFn: () => fetchCustomRequestsByStatuses(statuses),
  });
}

export function useCustomOrderTabCounts() {
  return useQuery<Record<CustomOrderTabId, number>>({
    queryKey: [CUSTOM_ORDERS_COUNTS_KEY],
    queryFn: async () => {
      const tabs: CustomOrderTabId[] = [
        "all",
        "waiting",
        "active",
        "completed",
        "cancelled",
      ];
      const entries = await Promise.all(
        tabs.map(async (tab) => {
          const list = await fetchCustomRequestsByStatuses(
            customOrderTabToApiStatuses(tab)
          );
          return [tab, list.length] as const;
        })
      );
      return Object.fromEntries(entries) as Record<CustomOrderTabId, number>;
    },
    staleTime: 30_000,
  });
}

export function useCustomOrderDetail(id: number | null, enabled: boolean) {
  return useQuery<CustomOrder>({
    queryKey: [CUSTOM_ORDER_DETAIL_KEY, id],
    queryFn: () => fetchCustomOrderById(id!),
    enabled: enabled && id != null,
    staleTime: 15_000,
  });
}

export function useCreateCustomOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (draft: CustomOrderDraft) => {
      const formData = buildCreateFormData(draft);
      const { data } = await http.post("/custom-request", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const created = unwrapCustomRequest(data);
      if (created) return mapCustomRequestToOrder(created);
      return null;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: [CUSTOM_ORDERS_QUERY_KEY] });
      void queryClient.invalidateQueries({ queryKey: [CUSTOM_ORDERS_COUNTS_KEY] });
    },
  });
}

function unwrapPayResponse(payload: unknown): PayCustomRequestResponse {
  const root = (payload as { data?: unknown })?.data ?? payload;
  if (!root || typeof root !== "object") return {};
  const record = root as Record<string, unknown>;
  if (typeof record.checkoutUrl === "string") {
    return {
      checkoutUrl: record.checkoutUrl,
      sessionId:
        typeof record.sessionId === "string" ? record.sessionId : undefined,
    };
  }
  const payment = record.payment;
  if (payment && typeof payment === "object") {
    const paymentRecord = payment as Record<string, unknown>;
    if (typeof paymentRecord.checkoutUrl === "string") {
      return { checkoutUrl: paymentRecord.checkoutUrl };
    }
  }
  return {};
}

export function usePayCustomOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      orderId,
      payload,
    }: {
      orderId: number;
      payload: PayCustomRequestPayload;
    }) => {
      const { data } = await http.post(`/custom-request/${orderId}/pay`, payload);
      return unwrapPayResponse(data);
    },
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({ queryKey: [CUSTOM_ORDERS_QUERY_KEY] });
      void queryClient.invalidateQueries({ queryKey: [CUSTOM_ORDERS_COUNTS_KEY] });
      void queryClient.invalidateQueries({
        queryKey: [CUSTOM_ORDER_DETAIL_KEY, variables.orderId],
      });
    },
  });
}

export function useReleaseCustomOrderFunds() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (orderId: number) => {
      const { data } = await http.patch(`/custom-request/${orderId}/release-fund`);
      const row = unwrapCustomRequest(data);
      return row ? mapCustomRequestToOrder(row) : null;
    },
    onSuccess: (_data, orderId) => {
      void queryClient.invalidateQueries({ queryKey: [CUSTOM_ORDERS_QUERY_KEY] });
      void queryClient.invalidateQueries({ queryKey: [CUSTOM_ORDERS_COUNTS_KEY] });
      void queryClient.invalidateQueries({
        queryKey: [CUSTOM_ORDER_DETAIL_KEY, orderId],
      });
    },
  });
}

function invalidateCustomOrderQueries(
  queryClient: ReturnType<typeof useQueryClient>,
  orderId?: number
) {
  void queryClient.invalidateQueries({ queryKey: [CUSTOM_ORDERS_QUERY_KEY] });
  void queryClient.invalidateQueries({ queryKey: [CUSTOM_ORDERS_COUNTS_KEY] });
  if (orderId != null) {
    void queryClient.invalidateQueries({
      queryKey: [CUSTOM_ORDER_DETAIL_KEY, orderId],
    });
  }
}

export function useOpenCustomOrderDispute() {
  const queryClient = useQueryClient();
  return useOpenDispute({
    onSuccess: ({ orderId }) =>
      invalidateCustomOrderQueries(queryClient, orderId),
  });
}

export function useEscalateCustomOrderDispute() {
  const queryClient = useQueryClient();
  return useEscalateDispute({
    onSuccess: ({ orderId }) =>
      invalidateCustomOrderQueries(queryClient, orderId),
  });
}

export function useResolveCustomOrderDispute() {
  const queryClient = useQueryClient();
  return useResolveDisputeReleaseFunds({
    onSuccess: ({ orderId }) =>
      invalidateCustomOrderQueries(queryClient, orderId),
  });
}

export { getErrorMessage as getCustomOrderErrorMessage };
