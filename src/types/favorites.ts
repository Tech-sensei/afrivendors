import type { VendorDetail, VendorListItem } from "@/types/vendor";

export interface FavoriteVendorCard {
  id: string;
  numericId?: number;
  name: string;
  businessName?: string;
  category: string;
  location: string;
  rating: number;
  reviewCount: number;
  minPrice: number;
  maxPrice: number;
  image: string;
  description: string;
}

export interface FavoritesApiResponse {
  data?: unknown;
}

export type FavoriteCandidate = VendorListItem | VendorDetail;
