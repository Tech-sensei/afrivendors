export interface StatusBadgeProps {
  status: "completed" | "pending" | "refunded";
  size?: "sm" | "md";
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export interface OTPVerificationProps {
  open: boolean;
  onClose: () => void;
  onVerify: () => void;
  phoneNumber: string;
  phoneCode: string;
}

export interface ReviewPageProps {
  onNavigate: (page: string, data?: any) => void;
  vendor: any;
  service?: any;
  services?: any[];
  date: Date;
  time: string;
  name: string;
  email: string;
  phone: string;
  notes?: string;
  paymentMethod?: "venue" | "online";
}

export interface MobilePhoneProps {
  rotation?: number;
  zIndex?: number;
}

export interface PricingCardProps {
  title: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  isPopular?: boolean;
  buttonText: string;
  onButtonClick: () => void;
}

export interface MockVendorService {
  id: string;
  name: string;
  price: number;
  duration: string;
  description: string;
}

export interface MockVendor {
  id: string;
  name: string;
  category: string;
  location: string;
  rating: number;
  reviewCount: number;
  priceRange: string;
  minPrice: number;
  maxPrice: number;
  image: string;
  description: string;
  services: MockVendorService[];
  about: string;
  openingHours: string;
}
