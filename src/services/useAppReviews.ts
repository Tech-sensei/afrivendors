"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import http from "@/lib/http";
import { mapAppReviewsList, normalizeAppReview } from "@/lib/mapAppReview";
import type { AppReview, CreateAppReviewPayload } from "@/types/app-review";

export const APP_REVIEWS_QUERY_KEY = ["app-reviews"] as const;

export function useAppReviews() {
  return useQuery<AppReview[]>({
    queryKey: APP_REVIEWS_QUERY_KEY,
    queryFn: async () => {
      const { data } = await http.get<unknown>("/app-review");
      return mapAppReviewsList(data);
    },
    staleTime: 60_000,
  });
}

export function useCreateAppReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateAppReviewPayload) => {
      const { data } = await http.post<unknown>("/app-review", payload);
      const created = normalizeAppReview(
        (data as { data?: unknown })?.data ?? data
      );
      if (!created) throw new Error("Invalid review response");
      return created;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: APP_REVIEWS_QUERY_KEY });
    },
  });
}

export function useUpdateAppReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: number;
      payload: CreateAppReviewPayload;
    }) => {
      const { data } = await http.patch<unknown>(`/app-review/${id}`, payload);
      const updated = normalizeAppReview(
        (data as { data?: unknown })?.data ?? data
      );
      if (!updated) throw new Error("Invalid review response");
      return updated;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: APP_REVIEWS_QUERY_KEY });
    },
  });
}

export function useDeleteAppReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      await http.delete(`/app-review/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: APP_REVIEWS_QUERY_KEY });
    },
  });
}
