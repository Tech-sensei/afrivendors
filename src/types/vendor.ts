export interface PublicVendorListApiItem {
  id: number;
  firstName: string;
  lastName: string;
  country: string;
  aboutBusiness?: string | null;
  phoneNumber: string;
  profilePhoto: string | null;
  businessName: string;
  location: string;
  bannerImage: string | null;
  category: {
    id: number;
    name: string;
  } | null;
  averageRating: number;
  reviewCount: number;
  minServicePrice: number | null;
  maxServicePrice: number | null;
}

export interface PublicVendorListApiResponse {
  data: PublicVendorListApiItem[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface PublicVendorDetailApiResponse {
  vendor: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    country: string;
    phoneNumber: string;
    accountType: string;
    createdAt: string;
    updatedAt: string;
  };
  kyc: {
    id: number;
    businessName: string;
    location: string;
    aboutBusiness: string;
    website: string | null;
    bannerImage: string | null;
    approvalStatus: string;
    category: {
      id: number;
      name: string;
    } | null;
  } | null;
  openingHours: Array<{
    id: number;
    day: string;
    isOpen: boolean;
    openTime: string | null;
    closeTime: string | null;
  }>;
  gallery: Array<{
    id: number;
    imageUrl: string;
    isBanner: boolean;
  }>;
  services: Array<{
    id: number;
    serviceName: string;
    category: {
      id: number;
      name: string;
    } | null;
    price: string;
    duration: string;
    description: string;
    imageUrl: string | null;
    isPublished: boolean;
  }>;
  reviews: Array<{
    id: number;
    rating: number;
    comment?: string;
    review?: string;
    createdAt?: string;
    user?: {
      id?: number;
      firstName?: string;
      lastName?: string;
    };
  }>;
  averageRating: number;
}

export interface GetPublicVendorsParams {
  limit?: number;
  page?: number;
  sort?: string;
  ratingStar?: number;
  minAverageRating?: number;
  maxAverageRating?: number;
  country?: string;
  categoryId?: number;
  minServicePrice?: number;
  maxServicePrice?: number;
}

export interface VendorListItem {
  id: string;
  numericId: number;
  name: string;
  businessName: string;
  category: string;
  categoryId: number | null;
  location: string;
  country: string;
  rating: number;
  reviewCount: number;
  minPrice: number;
  maxPrice: number;
  image: string;
  description: string;
  aboutBusiness?: string;
}

export interface VendorDetailService {
  id: string;
  name: string;
  price: number;
  duration: string;
  description: string;
  image: string | null;
  category: string;
}

export interface VendorDetailReview {
  id: string;
  author: string;
  rating: number;
  comment: string;
  date: string;
  /** When present, used to detect the current user's review for UI. */
  reviewerUserId?: number | null;
}

/** One row for the opening hours schedule (from API `openingHours` array). */
export interface VendorOpeningHoursDay {
  dayKey: string;
  dayLabel: string;
  isOpen: boolean;
  /** e.g. "9:00 AM – 7:00 PM" or "Closed" */
  hoursLine: string;
}

export interface VendorDetail {
  id: string;
  numericId: number;
  name: string;
  businessName: string;
  category: string;
  categoryId: number | null;
  location: string;
  country: string;
  rating: number;
  reviewCount: number;
  phoneNumber: string;
  email: string;
  website: string | null;
  bannerImage: string;
  gallery: string[];
  about: string;
  /** Legacy single-line summary (comma-separated). Prefer `openingHoursSchedule` in UI. */
  openingHours: string;
  openingHoursSchedule: VendorOpeningHoursDay[];
  services: VendorDetailService[];
  reviews: VendorDetailReview[];
}

export interface VendorFilters {
  country: string;
  categoryId: string;
  ratingStar: string;
  minAverageRating: string;
  maxAverageRating: string;
  minServicePrice: string;
  maxServicePrice: string;
}

export interface VendorCategoryOption {
  id: string;
  name: string;
}

export interface FilterSectionProps {
  isMobile?: boolean;
  filters: VendorFilters;
  categoryOptions: VendorCategoryOption[];
  countryOptions: string[];
  onFilterChange: (key: string, value: string) => void;
  onClearFilters: () => void;
}

export interface VendorCardProps {
  vendor: any;
  index: number;
  onClick?: () => void;
  isFavourite?: boolean;
  favouritePending?: boolean;
  onFavouriteToggle?: (vendorId: string, isFavourite: boolean) => void;
}
