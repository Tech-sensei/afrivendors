import { useQuery } from "@tanstack/react-query";
import http from "@/lib/http";
import type { Appointment } from "@/types/appointments";

export const useAppointments = () => {
  return useQuery<Appointment[]>({
    queryKey: ["user-appointments"],
    queryFn: async () => {
      const { data } = await http.get("/users/appointments");
      return (data?.data ?? data) as Appointment[];
    },
  });
};
