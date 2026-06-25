import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import http from "@/lib/http";
import type { DisputeOrderType } from "@/types/dispute";

export type OpenDisputePayload = {
  type: DisputeOrderType;
  orderId: number;
  reason: string;
};

export type ResolveDisputePayload = {
  type: DisputeOrderType;
  orderId: number;
  resolution: string;
};

type DisputeMutationOptions<TVariables = void> = {
  onSuccess?: (variables: TVariables) => void;
  successMessage?: string;
  errorMessage?: string;
};

function getErrorMessage(
  error: unknown,
  fallback: string
): string {
  const ax = error as {
    response?: { data?: { message?: string; responseMessage?: string } };
  };
  return (
    ax?.response?.data?.responseMessage ||
    ax?.response?.data?.message ||
    fallback
  );
}

export function useOpenDispute(options?: DisputeMutationOptions<OpenDisputePayload>) {
  return useMutation({
    mutationFn: async (payload: OpenDisputePayload) => {
      const { data } = await http.post("/users/disputes", payload);
      return data;
    },
    onSuccess: (_data, variables) => {
      toast.success(
        options?.successMessage ??
          "Dispute submitted. Message the vendor to resolve it, or wait for Afrivendors to review."
      );
      options?.onSuccess?.(variables);
    },
    onError: (error) => {
      toast.error(
        getErrorMessage(error, options?.errorMessage ?? "Could not submit dispute.")
      );
    },
  });
}

type EscalateDisputeVariables = {
  type: DisputeOrderType;
  orderId: number;
};

export function useEscalateDispute(
  options?: DisputeMutationOptions<EscalateDisputeVariables>
) {
  return useMutation({
    mutationFn: async ({ type, orderId }: EscalateDisputeVariables) => {
      const { data } = await http.patch(
        `/users/disputes/${type}/${orderId}/escalate`
      );
      return data;
    },
    onSuccess: (_data, variables) => {
      toast.success(
        options?.successMessage ??
          "Escalated to Afrivendors. Our team will review and update you."
      );
      options?.onSuccess?.(variables);
    },
    onError: (error) => {
      toast.error(
        getErrorMessage(error, options?.errorMessage ?? "Could not escalate.")
      );
    },
  });
}

export function useResolveDisputeReleaseFunds(
  options?: DisputeMutationOptions<ResolveDisputePayload>
) {
  return useMutation({
    mutationFn: async (payload: ResolveDisputePayload) => {
      const { data } = await http.patch(
        `/users/disputes/${payload.type}/${payload.orderId}/resolve/release-funds`,
        { resolution: payload.resolution }
      );
      return data;
    },
    onSuccess: (_data, variables) => {
      toast.success(
        options?.successMessage ??
          "Dispute closed. Funds have been released to the vendor."
      );
      options?.onSuccess?.(variables);
    },
    onError: (error) => {
      toast.error(
        getErrorMessage(
          error,
          options?.errorMessage ?? "Could not close dispute."
        )
      );
    },
  });
}
