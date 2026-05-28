import { useQuery } from "@tanstack/react-query";
import { fetchPublicCategories } from "@/services/categories";

export const PUBLIC_CATEGORIES_QUERY_KEY = ["public-categories"] as const;

export function usePublicCategories() {
  return useQuery({
    queryKey: PUBLIC_CATEGORIES_QUERY_KEY,
    queryFn: fetchPublicCategories,
    staleTime: 60_000,
  });
}
