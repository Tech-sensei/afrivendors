import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import http from "@/lib/http";
import type { QueryClient } from "@tanstack/react-query";
import {
  normalizeAppointmentStatus,
  normalizePaymentStatus,
  appointmentTabToApiStatuses,
  type Appointment,
  type AppointmentTabId,
  type AppointmentsApiStatus,
  type PaymentStatus,
} from "@/types/appointments";

export type OpenAppointmentDisputePayload = {
  appointmentId: number;
  reason: string;
};

const APPOINTMENTS_QUERY_KEY = "user-appointments";
const APPOINTMENTS_COUNTS_KEY = "user-appointments-counts";

function normalizeDisputeFromApi(raw: unknown): Appointment["dispute"] {
  if (!raw || typeof raw !== "object") return null;
  const d = raw as Record<string, unknown>;
  if (typeof d.reason !== "string") return null;
  return {
    id: Number(d.id),
    reason: d.reason,
    resolution: (d.resolution as string | null) ?? null,
    status: String(d.status ?? "pending"),
    resolver: (d.resolver as string | null) ?? null,
    resolvedBy: d.resolvedBy != null ? Number(d.resolvedBy) : null,
    resolvedAt: (d.resolvedAt as string | null) ?? null,
    createdAt: String(d.createdAt ?? ""),
    updatedAt: String(d.updatedAt ?? ""),
  };
}

function normalizeAppointmentFromApi(a: Appointment): Appointment {
  return {
    ...a,
    status: normalizeAppointmentStatus(String(a.status)),
    paymentStatus: normalizePaymentStatus(String(a.paymentStatus ?? "pending")),
    dispute: normalizeDisputeFromApi(a.dispute),
  };
}

async function fetchAppointmentsByStatuses(
  statuses: AppointmentsApiStatus[]
): Promise<Appointment[]> {
  const fetchOne = async (status: AppointmentsApiStatus) => {
    const { data } = await http.get("/users/appointments", {
      params: { status },
    });
    const list = (data?.data ?? data) as Appointment[];
    return Array.isArray(list) ? list : [];
  };

  if (statuses.length === 1) {
    const list = await fetchOne(statuses[0]);
    return list.map((a) => normalizeAppointmentFromApi(a));
  }

  const batches = await Promise.all(statuses.map(fetchOne));
  const byId = new Map<number, Appointment>();
  for (const batch of batches) {
    for (const row of batch) {
      const normalized = normalizeAppointmentFromApi(row);
      byId.set(normalized.id, normalized);
    }
  }
  return Array.from(byId.values());
}

function patchAppointmentPaymentStatus(
  queryClient: QueryClient,
  appointmentId: number,
  paymentStatus: PaymentStatus
) {
  queryClient.setQueriesData<Appointment[]>(
    { queryKey: [APPOINTMENTS_QUERY_KEY] },
    (old) => old?.map((a) => (a.id === appointmentId ? { ...a, paymentStatus } : a))
  );
  queryClient.setQueryData<Appointment>(
    ["appointment-detail", appointmentId],
    (old) => (old ? { ...old, paymentStatus } : undefined)
  );
}

function invalidateAppointmentLists(queryClient: QueryClient) {
  queryClient.invalidateQueries({ queryKey: [APPOINTMENTS_QUERY_KEY] });
  queryClient.invalidateQueries({ queryKey: [APPOINTMENTS_COUNTS_KEY] });
}

export function useAppointments(tab: AppointmentTabId) {
  const statuses = appointmentTabToApiStatuses(tab);

  return useQuery<Appointment[]>({
    queryKey: [APPOINTMENTS_QUERY_KEY, tab],
    queryFn: () => fetchAppointmentsByStatuses(statuses),
  });
}

/** Tab badge counts — one lightweight fetch per tab. */
export function useAppointmentTabCounts() {
  return useQuery<Record<AppointmentTabId, number>>({
    queryKey: [APPOINTMENTS_COUNTS_KEY],
    queryFn: async () => {
      const tabs: AppointmentTabId[] = [
        "pending",
        "upcoming",
        "past",
        "cancelled",
      ];
      const entries = await Promise.all(
        tabs.map(async (tab) => {
          const list = await fetchAppointmentsByStatuses(
            appointmentTabToApiStatuses(tab)
          );
          return [tab, list.length] as const;
        })
      );
      return Object.fromEntries(entries) as Record<AppointmentTabId, number>;
    },
    staleTime: 30_000,
  });
}

export async function fetchUserAppointmentById(
  id: number
): Promise<Appointment> {
  const { data } = await http.get(`/users/appointments/${id}`);
  const row = (data?.data ?? data) as Appointment;
  return normalizeAppointmentFromApi(row);
}

export function useReleaseAppointmentFunds() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (appointmentId: number) => {
      const { data } = await http.patch(
        `/users/appointments/${appointmentId}/release-fund`
      );
      return data;
    },
    onSuccess: (data, appointmentId) => {
      const msg =
        (data as { responseMessage?: string; message?: string })?.responseMessage ??
        (data as { message?: string })?.message ??
        "Funds released successfully.";
      toast.success(msg);
      invalidateAppointmentLists(queryClient);
      queryClient.invalidateQueries({
        queryKey: ["appointment-detail", appointmentId],
      });
    },
    onError: (error: { response?: { data?: { message?: string; responseMessage?: string } } }) => {
      toast.error(
        error?.response?.data?.responseMessage ??
          error?.response?.data?.message ??
          "Unable to release funds. Please try again."
      );
    },
  });
}

export function useResolveDisputePayVendor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      appointmentId,
      resolution,
    }: {
      appointmentId: number;
      resolution: string;
    }) => {
      const { data } = await http.post(
        `/users/appointments/${appointmentId}/dispute/resolve/release-funds`,
        { resolution }
      );
      return data;
    },
    onSuccess: (_data, { appointmentId }) => {
      toast.success("Dispute closed. Funds have been released to the vendor.");
      invalidateAppointmentLists(queryClient);
      queryClient.invalidateQueries({
        queryKey: ["appointment-detail", appointmentId],
      });
    },
    onError: (error: { response?: { data?: { message?: string; responseMessage?: string } } }) => {
      toast.error(
        error?.response?.data?.responseMessage ??
          error?.response?.data?.message ??
          "Could not close dispute. Please try again."
      );
    },
  });
}

export function useEscalateAppointmentDispute() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      appointmentId,
      resolution,
    }: {
      appointmentId: number;
      resolution: string;
    }) => {
      const { data } = await http.post(
        `/users/appointments/${appointmentId}/dispute/escalate`,
        { resolution }
      );
      return data;
    },
    onSuccess: (_data, { appointmentId }) => {
      toast.success("Escalated to Afrivendors. Our team will review and update you.");
      invalidateAppointmentLists(queryClient);
      queryClient.invalidateQueries({
        queryKey: ["appointment-detail", appointmentId],
      });
    },
    onError: (error: { response?: { data?: { message?: string; responseMessage?: string } } }) => {
      toast.error(
        error?.response?.data?.responseMessage ??
          error?.response?.data?.message ??
          "Could not escalate. Please try again."
      );
    },
  });
}

export function useOpenAppointmentDispute() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: OpenAppointmentDisputePayload) => {
      const { data } = await http.post("/users/disputes", {
        appointmentId: payload.appointmentId,
        reason: payload.reason,
      });
      return data;
    },
    onSuccess: (_data, { appointmentId }) => {
      toast.success(
        "Dispute submitted. Message the vendor to resolve it, or wait for Afrivendors to review."
      );
      invalidateAppointmentLists(queryClient);
      queryClient.invalidateQueries({
        queryKey: ["appointment-detail", appointmentId],
      });
    },
    onError: () => {
      toast.error("Could not submit dispute. Please try again.");
    },
  });
}

export function useCancelAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (appointmentId: number) => {
      await http.delete(`/users/appointments/${appointmentId}`);
    },
    onSuccess: (_, appointmentId) => {
      toast.success("Appointment cancelled successfully.");
      invalidateAppointmentLists(queryClient);
      queryClient.invalidateQueries({
        queryKey: ["appointment-detail", appointmentId],
      });
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      toast.error(
        error?.response?.data?.message ??
          "Unable to cancel appointment. Please try again."
      );
    },
  });
}
