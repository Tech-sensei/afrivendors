import http from "@/lib/http";
import type {
  GetPublicVendorsParams,
  PublicVendorDetailApiResponse,
  PublicVendorListApiItem,
  PublicVendorListApiResponse,
  VendorDetail,
  VendorDetailReview,
  VendorDetailService,
  VendorListItem,
} from "@/types/vendor";

const FALLBACK_VENDOR_IMAGE = "/assets/images/vendor.jpeg";

const currencyFormatter = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  maximumFractionDigits: 0,
});

function getVendorImage(image?: string | null) {
  return image || FALLBACK_VENDOR_IMAGE;
}

function formatTime(time?: string | null) {
  if (!time) return null;
  const [hours, minutes] = time.split(":").map(Number);
  if (Number.isNaN(hours) || Number.isNaN(minutes)) return time;

  const period = hours >= 12 ? "PM" : "AM";
  const normalizedHours = hours % 12 || 12;
  return `${normalizedHours}:${minutes.toString().padStart(2, "0")} ${period}`;
}

function formatOpeningHours(
  openingHours: PublicVendorDetailApiResponse["openingHours"]
) {
  return openingHours
    .map((entry) => {
      const day = entry.day.charAt(0).toUpperCase() + entry.day.slice(1);
      if (!entry.isOpen || !entry.openTime || !entry.closeTime) {
        return `${day}: Closed`;
      }

      return `${day}: ${formatTime(entry.openTime)} - ${formatTime(entry.closeTime)}`;
    })
    .join(", ");
}

function mapReview(review: PublicVendorDetailApiResponse["reviews"][number]): VendorDetailReview {
  const firstName = review.user?.firstName?.trim() || "";
  const lastName = review.user?.lastName?.trim() || "";
  const author = `${firstName} ${lastName}`.trim() || "Anonymous";

  return {
    id: String(review.id),
    author,
    rating: Number(review.rating) || 0,
    comment: review.comment || review.review || "",
    date: review.createdAt
      ? new Date(review.createdAt).toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        })
      : "Recent",
  };
}

function mapService(
  service: PublicVendorDetailApiResponse["services"][number]
): VendorDetailService {
  return {
    id: String(service.id),
    name: service.serviceName,
    price: Number(service.price) || 0,
    duration: service.duration,
    description: service.description,
    image: service.imageUrl && service.imageUrl !== "string" ? service.imageUrl : null,
    category: service.category?.name || "General",
  };
}

export function mapPublicVendorListItem(vendor: PublicVendorListApiItem): VendorListItem {
  const businessName = vendor.businessName?.trim() || `${vendor.firstName} ${vendor.lastName}`.trim();

  return {
    id: String(vendor.id),
    numericId: vendor.id,
    name: businessName,
    businessName,
    category: vendor.category?.name || "Uncategorized",
    categoryId: vendor.category?.id ?? null,
    location: vendor.location,
    country: vendor.country,
    rating: Number(vendor.averageRating) || 0,
    reviewCount: Number(vendor.reviewCount) || 0,
    minPrice: Number(vendor.minServicePrice) || 0,
    maxPrice: Number(vendor.maxServicePrice) || 0,
    image: getVendorImage(vendor.bannerImage || vendor.profilePhoto),
    description:
      vendor.aboutBusiness?.trim() ||
      `${vendor.firstName} ${vendor.lastName}`.trim(),
    aboutBusiness: vendor.aboutBusiness?.trim() || undefined,
  };
}

export function mapPublicVendorDetail(
  payload: PublicVendorDetailApiResponse
): VendorDetail {
  const businessName =
    payload.kyc?.businessName?.trim() ||
    `${payload.vendor.firstName} ${payload.vendor.lastName}`.trim();

  const services = payload.services
    .filter((service) => service.isPublished)
    .map(mapService);

  const reviews = payload.reviews.map(mapReview);
  const bannerImage =
    getVendorImage(payload.kyc?.bannerImage || payload.gallery.find((item) => item.isBanner)?.imageUrl);
  const gallery = payload.gallery.length
    ? payload.gallery.map((item) => item.imageUrl)
    : [bannerImage];

  return {
    id: String(payload.vendor.id),
    numericId: payload.vendor.id,
    name: businessName,
    businessName,
    category: payload.kyc?.category?.name || "Uncategorized",
    categoryId: payload.kyc?.category?.id ?? null,
    location: payload.kyc?.location || payload.vendor.country,
    country: payload.vendor.country,
    rating: Number(payload.averageRating) || 0,
    reviewCount: reviews.length,
    phoneNumber: payload.vendor.phoneNumber,
    email: payload.vendor.email,
    website: payload.kyc?.website || null,
    bannerImage,
    gallery,
    about:
      payload.kyc?.aboutBusiness ||
      `Welcome to ${businessName}. We are committed to providing exceptional service.`,
    openingHours: formatOpeningHours(payload.openingHours),
    services,
    reviews,
  };
}

export async function getPublicVendors(params: GetPublicVendorsParams) {
  const response = await http.get<PublicVendorListApiResponse>("/vendor/public/list", {
    params,
  });

  return {
    vendors: response.data.data.map(mapPublicVendorListItem),
    meta: response.data.meta,
  };
}

export async function getPublicVendorById(id: string) {
  const response = await http.get<PublicVendorDetailApiResponse>(`/vendor/${id}/public`);
  return mapPublicVendorDetail(response.data);
}

export function formatVendorPriceRange(minPrice: number, maxPrice: number) {
  if (minPrice > 0 && maxPrice > minPrice) {
    return `${currencyFormatter.format(minPrice)} - ${currencyFormatter.format(maxPrice)}`;
  }

  if (minPrice > 0) {
    return `From ${currencyFormatter.format(minPrice)}`;
  }

  if (maxPrice > 0) {
    return `Up to ${currencyFormatter.format(maxPrice)}`;
  }

  return "Price on request";
}

export function formatVendorPrice(price: number) {
  if (!price) return currencyFormatter.format(0);
  return currencyFormatter.format(price);
}
