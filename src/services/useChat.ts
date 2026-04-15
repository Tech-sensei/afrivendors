import { useMutation } from "@tanstack/react-query";
import http from "@/lib/http";

type GenerateChatTokenResponse = {
  userChatToken: string;
};

type CreateChannelPayload = {
  otherUserId: number;
  appointmentId: number;
};

type CreateChannelResponse = {
  message: string;
  channel: string;
};

export const useGenerateChatToken = () =>
  useMutation({
    mutationFn: async () => {
      const { data } = await http.post("/messages");
      return (data?.data ?? data) as GenerateChatTokenResponse;
    },
  });

export const useCreateAppointmentChannel = () =>
  useMutation({
    mutationFn: async (payload: CreateChannelPayload) => {
      const { data } = await http.post("/messages/create-channel", payload);
      return (data?.data ?? data) as CreateChannelResponse;
    },
  });
