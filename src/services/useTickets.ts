"use client";

import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
  type InfiniteData,
  type QueryClient,
} from "@tanstack/react-query";
import { AxiosHeaders } from "axios";
import http from "@/lib/http";
import type {
  NewTicketFormState,
  SupportMessage,
  SupportTicket,
  SupportTicketStatus,
} from "@/types/support";
import {
  buildCreateTicketFormData,
  mapApiTicketToSupportTicket,
  mapTicketMessageApiToSupportMessage,
  supportStatusFilterToApiParam,
} from "@/lib/mapSupportTicketApi";

export const DEFAULT_TICKETS_LIMIT = 10;

export const TICKETS_LIST_ROOT_KEY = ["tickets", "list"] as const;

export function ticketMessagesQueryKey(ticketId: string) {
  return ["tickets", ticketId, "messages"] as const;
}

export function useTicketMessages(ticketId: string | null, enabled: boolean) {
  const id = ticketId ?? "";
  return useQuery({
    queryKey: ticketMessagesQueryKey(id || "__none__"),
    queryFn: async (): Promise<SupportMessage[]> => {
      const { data } = await http.get(`/tickets/${ticketId}/messages`);
      const raw = Array.isArray(data)
        ? data
        : data &&
            typeof data === "object" &&
            "data" in data &&
            Array.isArray((data as { data: unknown }).data)
          ? (data as { data: unknown[] }).data
          : [];
      return raw.map((row) =>
        mapTicketMessageApiToSupportMessage(row as Record<string, unknown>)
      );
    },
    enabled: Boolean(ticketId) && enabled,
    staleTime: 30_000,
  });
}

export interface TicketsListMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface TicketsPage {
  items: SupportTicket[];
  meta: TicketsListMeta;
}

function unwrapPayload(data: unknown): unknown {
  if (data && typeof data === "object" && "data" in (data as object)) {
    return (data as { data: unknown }).data;
  }
  return data;
}

function parseTicketsListResponse(body: unknown): TicketsPage {
  const root = body as Record<string, unknown>;
  const rawList = Array.isArray(root.data) ? root.data : [];
  const items = rawList.map((row) => mapApiTicketToSupportTicket(row));
  const metaRaw = (root.meta ?? {}) as Record<string, unknown>;
  const page = Number(metaRaw.page ?? 1);
  const limit = Number(metaRaw.limit ?? DEFAULT_TICKETS_LIMIT);
  const total = Number(metaRaw.total ?? items.length);
  const totalPages = Math.max(
    1,
    Number(
      metaRaw.totalPages ??
        (limit > 0 ? Math.ceil(total / limit) : 1)
    )
  );
  return {
    items,
    meta: { page, limit, total, totalPages },
  };
}

async function fetchTicketsPage(params: {
  page: number;
  limit: number;
  subject?: string;
  status?: string;
}): Promise<TicketsPage> {
  const { data } = await http.get("/tickets", {
    params: {
      page: params.page,
      limit: params.limit,
      ...(params.subject ? { subject: params.subject } : {}),
      ...(params.status ? { status: params.status } : {}),
    },
  });
  return parseTicketsListResponse(data);
}

export function useTicketsInfinite(filters: {
  subject: string;
  filterStatus: SupportTicketStatus | "all";
}) {
  const limit = DEFAULT_TICKETS_LIMIT;
  const apiStatus = supportStatusFilterToApiParam(filters.filterStatus);
  const subject = filters.subject.trim() || undefined;

  return useInfiniteQuery({
    queryKey: [
      ...TICKETS_LIST_ROOT_KEY,
      { subject: subject ?? "", status: apiStatus ?? "" },
    ],
    initialPageParam: 1,
    queryFn: async ({ pageParam }) =>
      fetchTicketsPage({
        page: pageParam as number,
        limit,
        subject,
        status: apiStatus,
      }),
    getNextPageParam: (last) =>
      last.meta.page < last.meta.totalPages ? last.meta.page + 1 : undefined,
  });
}

export function patchTicketInListInfiniteCache(
  queryClient: QueryClient,
  ticketId: string,
  updater: (t: SupportTicket) => SupportTicket
) {
  queryClient.setQueriesData<InfiniteData<TicketsPage>>(
    { queryKey: TICKETS_LIST_ROOT_KEY },
    (old) => {
      if (!old?.pages?.length) return old;
      return {
        ...old,
        pages: old.pages.map((page) => ({
          ...page,
          items: page.items.map((t) =>
            t.id === ticketId ? updater(t) : t
          ),
        })),
      };
    }
  );
}

async function postCreateTicket(form: NewTicketFormState): Promise<SupportTicket> {
  const body = buildCreateTicketFormData(form);
  const { data } = await http.post("/tickets", body, {
    transformRequest: [
      (payload, headers) => {
        if (payload instanceof FormData && headers) {
          if (headers instanceof AxiosHeaders) {
            headers.delete("Content-Type");
          } else {
            delete (headers as Record<string, unknown>)["Content-Type"];
          }
        }
        return payload;
      },
    ],
  });
  const raw = unwrapPayload(data);
  return mapApiTicketToSupportTicket(raw, form);
}

export function useCreateTicket() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postCreateTicket,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...TICKETS_LIST_ROOT_KEY] });
    },
  });
}
