/** Mirrors API booking lifecycle; `confirmed` kept for backward compatibility. */
export type AppointmentStatus =
  | "pending"
  | "confirmed"
  | "accepted"
  | "completed"
  | "cancelled"
  | "canceled"
  | "rejected";

/** Backend may return US spelling `canceled`; app logic uses `cancelled`. */
export function normalizeAppointmentStatus(status: string): AppointmentStatus {
  if (status.toLowerCase() === "canceled") return "cancelled";
  return status as AppointmentStatus;
}

/** Upcoming tab: vendor accepted (or legacy confirmed). */
export const isUpcomingStatus = (s: AppointmentStatus) =>
  s === "accepted" || s === "confirmed";

/** Pending tab: awaiting vendor action. */
export const isPendingStatus = (s: AppointmentStatus) => s === "pending";

export const isPastStatus = (s: AppointmentStatus) => s === "completed";

export const isCancelledStatus = (s: AppointmentStatus) =>
  s === "cancelled" || s === "canceled" || s === "rejected";

/** Can reschedule or cancel before the service is done or rejected. */
export const isActiveBookingStatus = (s: AppointmentStatus) =>
  isUpcomingStatus(s) || isPendingStatus(s);

export const isBookAgainStatus = (s: AppointmentStatus) =>
  isPastStatus(s) || isCancelledStatus(s);
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
