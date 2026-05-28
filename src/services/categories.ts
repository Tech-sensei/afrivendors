import http from "@/lib/http";
import type { PublicCategory } from "@/types/category";

export async function fetchPublicCategories(): Promise<PublicCategory[]> {
  const { data } = await http.get("/categories");
  const raw = (data?.data ?? data) as PublicCategory[];
  return Array.isArray(raw) ? raw : [];
}
