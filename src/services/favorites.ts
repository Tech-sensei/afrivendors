import http from "@/lib/http";
import { normalizeVendorLocation } from "@/services/vendor";
import type {
  FavoriteVendorCard,
  FavoritesApiResponse,
} from "@/types/favorites";
import type { VendorDetail, VendorListItem } from "@/types/vendor";

const FAVORITE_VENDORS_STORAGE_KEY = "favoriteVendors";
const FAVORITES_UPDATED_EVENT = "favorites:updated";

function emitFavoritesUpdated() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(FAVORITES_UPDATED_EVENT));
  }
}

export function getFavoriteStorageEventName() {
  return FAVORITES_UPDATED_EVENT;
}

export function readFavoriteVendors(): FavoriteVendorCard[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(FAVORITE_VENDORS_STORAGE_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeFavoriteVendors(vendors: FavoriteVendorCard[]) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(FAVORITE_VENDORS_STORAGE_KEY, JSON.stringify(vendors));
  emitFavoritesUpdated();
}

export function isVendorFavorited(vendorId: string) {
  return readFavoriteVendors().some((vendor) => vendor.id === vendorId);
}

export function addFavoriteVendorToStorage(vendor: FavoriteVendorCard) {
  const current = readFavoriteVendors();
  const next = current.some((item) => item.id === vendor.id)
    ? current.map((item) => (item.id === vendor.id ? vendor : item))
    : [vendor, ...current];

  writeFavoriteVendors(next);
  return next;
}

export function removeFavoriteVendorFromStorage(vendorId: string) {
  const next = readFavoriteVendors().filter((vendor) => vendor.id !== vendorId);
  writeFavoriteVendors(next);
  return next;
}

export function mapVendorListItemToFavorite(vendor: VendorListItem): FavoriteVendorCard {
  return {
    id: vendor.id,
    numericId: vendor.numericId,
    name: vendor.name,
    businessName: vendor.businessName,
    category: vendor.category,
    location: vendor.location,
    rating: vendor.rating,
    reviewCount: vendor.reviewCount,
    minPrice: vendor.minPrice,
    maxPrice: vendor.maxPrice,
    image: vendor.image,
    description: vendor.description,
  };
}

export function mapVendorDetailToFavorite(vendor: VendorDetail): FavoriteVendorCard {
  const prices = vendor.services.map((service) => service.price).filter((price) => price > 0);
  const minPrice = prices.length ? Math.min(...prices) : 0;
  const maxPrice = prices.length ? Math.max(...prices) : 0;

  return {
    id: vendor.id,
    numericId: vendor.numericId,
    name: vendor.name,
    businessName: vendor.businessName,
    category: vendor.category,
    location: vendor.location,
    rating: vendor.rating,
    reviewCount: vendor.reviewCount,
    minPrice,
    maxPrice,
    image: vendor.bannerImage,
    description: vendor.about,
  };
}

export async function addFavoriteVendor(vendorId: string) {
  const response = await http.post(`/users/favorites/${vendorId}`);
  return response.data;
}

export async function removeFavoriteVendor(vendorId: string) {
  const response = await http.delete(`/users/favorites/${vendorId}`);
  return response.data;
}

function mapFavoriteApiItemToCard(item: any): FavoriteVendorCard {
  return {
    id: String(item.id ?? item.vendorId),
    numericId: Number(item.id ?? item.vendorId) || undefined,
    name:
      item.businessName ||
      item.vendor?.businessName ||
      `${item.firstName || item.vendor?.firstName || ""} ${item.lastName || item.vendor?.lastName || ""}`.trim() ||
      "Vendor",
    businessName: item.businessName || item.vendor?.businessName,
    category: item.category?.name || item.vendor?.category?.name || "Uncategorized",
    location: normalizeVendorLocation(
      item.location ?? item.vendor?.location,
      item.country || item.vendor?.country || "Location unavailable"
    ),
    rating: Number(item.averageRating ?? item.vendor?.averageRating) || 0,
    reviewCount: Number(item.reviewCount ?? item.vendor?.reviewCount) || 0,
    minPrice: Number(item.minServicePrice ?? item.vendor?.minServicePrice) || 0,
    maxPrice: Number(item.maxServicePrice ?? item.vendor?.maxServicePrice) || 0,
    image:
      item.bannerImage ||
      item.vendor?.bannerImage ||
      item.profilePhoto ||
      item.vendor?.profilePhoto ||
      "/assets/images/vendor.jpeg",
    description:
      item.description ||
      item.aboutBusiness ||
      item.vendor?.aboutBusiness ||
      `${item.firstName || item.vendor?.firstName || ""} ${item.lastName || item.vendor?.lastName || ""}`.trim(),
  };
}

export async function getFavoriteVendors() {
  const response = await http.get<FavoritesApiResponse>("/users/favorites");
  const payload = response.data?.data ?? response.data;

  const items = Array.isArray(payload)
    ? payload
    : Array.isArray((payload as any)?.favorites)
      ? (payload as any).favorites
      : Array.isArray((payload as any)?.data)
        ? (payload as any).data
        : [];

  return items.map(mapFavoriteApiItemToCard);
}
