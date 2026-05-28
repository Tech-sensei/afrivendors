/** UI tabs on the appointments page. */
export type AppointmentTabId = "pending" | "upcoming" | "past" | "cancelled";

/** `GET /users/appointments?status=` — API enum (US spelling for canceled). */
export type AppointmentsApiStatus =
  | "pending"
  | "accepted"
  | "rejected"
  | "canceled"
  | "completed";

export function appointmentTabToApiStatuses(
  tab: AppointmentTabId
): AppointmentsApiStatus[] {
  switch (tab) {
    case "pending":
      return ["pending"];
    case "upcoming":
      return ["accepted"];
    case "past":
      return ["completed"];
    case "cancelled":
      return ["canceled", "rejected"];
    default:
      return ["pending"];
  }
}

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

export const isCompletedStatus = (s: AppointmentStatus) => s === "completed";

/** Past / Completed tab: finished appointments. */
export const isPastStatus = isCompletedStatus;

export const isCancelledStatus = (s: AppointmentStatus) =>
  s === "cancelled" || s === "canceled" || s === "rejected";

/** Message / cancel while booking is still open (pending or accepted). */
export const isActiveBookingStatus = (s: AppointmentStatus) =>
  isUpcomingStatus(s) || isPendingStatus(s);

/** Pending or accepted — client can request a new date/time. */
export function canRescheduleAppointment(appt: { status: string }): boolean {
  return isActiveBookingStatus(normalizeAppointmentStatus(appt.status));
}

export const isBookAgainStatus = (s: AppointmentStatus) =>
  isCompletedStatus(s) || isCancelledStatus(s);
export type PaymentStatus =
  | "pending"
  | "paid"
  | "failed"
  | "released"
  | "disputed"
  | "refunded";

export function normalizePaymentStatus(status: string): PaymentStatus {
  const key = status.toLowerCase();
  if (
    key === "paid" ||
    key === "released" ||
    key === "failed" ||
    key === "pending" ||
    key === "disputed" ||
    key === "refunded"
  ) {
    return key;
  }
  return "pending";
}

export interface AppointmentDispute {
  id: number;
  reason: string;
  resolution: string | null;
  status: string;
  resolver: string | null;
  resolvedBy: number | null;
  resolvedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export function isAppointmentDisputeOpen(
  dispute: AppointmentDispute | null | undefined
): boolean {
  if (!dispute) return false;
  const s = dispute.status.toLowerCase();
  return s !== "resolved" && s !== "closed" && s !== "cancelled";
}

/** Client may escalate when peer resolution failed (status still pending). */
export function canEscalateAppointmentDispute(appointment: {
  dispute?: AppointmentDispute | null;
}): boolean {
  if (!isAppointmentDisputeOpen(appointment.dispute)) return false;
  const s = appointment.dispute!.status.toLowerCase();
  return s === "pending" || s === "open";
}

export function canResolveDisputePayVendor(appointment: {
  status: AppointmentStatus;
  paymentStatus: PaymentStatus;
  dispute?: AppointmentDispute | null;
}): boolean {
  return isAppointmentDisputeOpen(appointment.dispute) && appointment.paymentStatus === "paid";
}

/** Completed booking with payment held — client may release if no open dispute. */
export function canReleaseAppointmentFunds(appointment: {
  status: AppointmentStatus;
  paymentStatus: PaymentStatus;
  dispute?: AppointmentDispute | null;
}): boolean {
  return (
    isCompletedStatus(appointment.status) &&
    appointment.paymentStatus === "paid" &&
    !isAppointmentDisputeOpen(appointment.dispute)
  );
}

export function canOpenAppointmentDispute(appointment: {
  status: AppointmentStatus;
  paymentStatus: PaymentStatus;
  dispute?: AppointmentDispute | null;
}): boolean {
  return canReleaseAppointmentFunds(appointment);
}

export function isAppointmentFundsReleased(appointment: {
  paymentStatus: PaymentStatus;
}): boolean {
  return appointment.paymentStatus === "released";
}

export function isAppointmentDisputed(appointment: {
  paymentStatus: PaymentStatus;
  dispute?: AppointmentDispute | null;
}): boolean {
  return (
    isAppointmentDisputeOpen(appointment.dispute) ||
    appointment.paymentStatus === "disputed"
  );
}

export function paymentStatusDisplayLabel(
  status: PaymentStatus,
  dispute?: AppointmentDispute | null
): string {
  if (isAppointmentDisputeOpen(dispute)) {
    return "Dispute open";
  }
  switch (status) {
    case "paid":
      return "Paid";
    case "released":
      return "Released to vendor";
    case "disputed":
      return "Dispute under review";
    case "refunded":
      return "Refunded";
    case "failed":
      return "Payment failed";
    default:
      return "Pending";
  }
}
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
  dispute?: AppointmentDispute | null;
  createdAt: string;
  updatedAt: string;
}

export interface AppointmentCardProps {
  appointment: Appointment;
  onViewDetails: (appointment: Appointment) => void;
  onReschedule: (appointment: Appointment) => void;
  onMessageVendor?: (appointment: Appointment) => void;
  onOpenDispute?: (appointment: Appointment) => void;
  onPayVendor?: (appointment: Appointment) => void;
  onEscalateDispute?: (appointment: Appointment) => void;
}

export interface AppointmentDetailsDrawerProps {
  appointment: Appointment | null;
  isOpen: boolean;
  onClose: () => void;
  onReschedule: (appointment: Appointment) => void;
  onMessageVendor?: (appointment: Appointment) => void;
  onOpenDispute?: (appointment: Appointment) => void;
  onPayVendor?: (appointment: Appointment) => void;
  onEscalateDispute?: (appointment: Appointment) => void;
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
