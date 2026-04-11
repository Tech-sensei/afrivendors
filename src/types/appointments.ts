export type AppointmentStatus = "pending" | "confirmed" | "completed" | "cancelled";
export type PaymentStatus = "pending" | "paid" | "failed";
export type AppointmentPaymentMethod = "online" | "wallet";

export interface AppointmentService {
  id: number;
  serviceName: string;
  category: { id: number; name: string; iconName: string | null };
  price: string;
  duration: string;
  description: string;
  imageUrl: string | null;
  isPublished: boolean;
}

export interface AppointmentVendor {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  country: string;
  profilePhoto: string | null;
  phoneNumber: string;
  accountType: string;
}

export interface Appointment {
  id: number;
  vendor: AppointmentVendor;
  services: AppointmentService[];
  date: string;
  time: string;
  rescheduleDate: string | null;
  rescheduleTime: string | null;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  specificRequest: string;
  paymentMethod: AppointmentPaymentMethod;
  status: AppointmentStatus;
  totalAmount: number;
  paymentStatus: PaymentStatus;
  createdAt: string;
  updatedAt: string;
}

export interface AppointmentCardProps {
  appointment: Appointment;
  onViewDetails: (appointment: Appointment) => void;
  onReschedule: (appointment: Appointment) => void;
  onMessageVendor?: (appointment: Appointment) => void;
}

export interface AppointmentDetailsDrawerProps {
  appointment: Appointment | null;
  isOpen: boolean;
  onClose: () => void;
  onReschedule: (appointment: Appointment) => void;
  onMessageVendor?: (appointment: Appointment) => void;
}

export interface MessageVendorDrawerProps {
  appointment: Appointment | null;
  isOpen: boolean;
  onClose: () => void;
}

export interface RescheduleModalProps {
  appointment: Appointment | null;
  isOpen: boolean;
  onClose: () => void;
}
