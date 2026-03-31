export type AppointmentStatus = "upcoming" | "pending" | "past" | "cancelled";

export interface Appointment {
  id: string;
  serviceName: string;
  serviceImage: string;
  providerName: string;
  providerSlug: string;
  providerAvatar: string;
  rating: number;
  reviewCount: number;
  date: string;
  time: string;
  duration: string;
  status: AppointmentStatus;
  location: string;
  price: number;
  description?: string;
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
