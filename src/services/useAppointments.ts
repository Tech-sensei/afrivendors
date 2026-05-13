import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import http from "@/lib/http";
import { normalizeAppointmentStatus, type Appointment } from "@/types/appointments";

export const useAppointments = () => {
  return useQuery<Appointment[]>({
    queryKey: ["user-appointments"],
    queryFn: async () => {
      const { data } = await http.get("/users/appointments");
      const list = (data?.data ?? data) as Appointment[];
      return list.map((a) => ({
        ...a,
        status: normalizeAppointmentStatus(String(a.status)),
      }));
    },
  });
};

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
      queryClient.invalidateQueries({ queryKey: ["user-appointments"] });
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

export function useCancelAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (appointmentId: number) => {
      await http.delete(`/users/appointments/${appointmentId}`);
    },
    onSuccess: (_, appointmentId) => {
      toast.success("Appointment cancelled successfully.");
      queryClient.invalidateQueries({ queryKey: ["user-appointments"] });
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
