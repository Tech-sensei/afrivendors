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
