export interface WalletInfo {
  id: number;
  balance: number;
  currency: string;
  escrowBalance: number;
  createdAt: string;
  updatedAt: string;
}

export interface TransactionUser {
  id: number;
  firstName: string;
  lastName: string;
}

export interface TransactionVendor {
  id: number;
  firstName: string;
  lastName: string;
}

export interface TransactionAppointmentService {
  id: number;
  serviceName: string;
  category: { id: number; name: string; iconName: string | null };
  price: string;
  duration: string;
  description: string;
  imageUrl: string | null;
  isPublished: boolean;
}

export interface TransactionAppointment {
  id: number;
  date: string;
  time: string;
  status: string;
  paymentMethod: string;
  totalAmount: number;
  paymentStatus: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  specificRequest: string;
  createdAt: string;
  updatedAt: string;
  services: TransactionAppointmentService[];
}

export type TransactionType = "wallet_top_up" | "appointment_payment" | "refund";
export type TransactionStatus = "pending" | "completed" | "failed" | "refunded";

export interface Transaction {
  id: number;
  amount: number;
  commissionAmount: number;
  netToVendorAmount: number | null;
  currency: string;
  status: TransactionStatus;
  type: TransactionType;
  description: string;
  referenceId: string;
  referenceType: string;
  createdAt: string;
  updatedAt: string;
  user: TransactionUser;
  vendor: TransactionVendor | null;
  appointment: TransactionAppointment | null;
}

export interface TransactionsResponse {
  items: Transaction[];
  total: number;
  page: number;
  limit: number;
}

export interface TransactionDetailProps {
  transaction: Transaction | null;
  isOpen: boolean;
  onClose: () => void;
}

export interface FundWalletDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

// Kept for booking/FundWalletDrawer.tsx
export interface BookingFundWalletDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}
