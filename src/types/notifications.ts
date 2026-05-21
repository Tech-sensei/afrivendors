export type NotificationType = "booking" | "message" | "favorite" | "update";

export type NotificationReferenceType =
  | "appointment_booking"
  | "chat_message"
  | (string & {});

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
  actionUrl?: string;
  referenceType?: NotificationReferenceType;
  itemId?: number | null;
}

export interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate?: (notification: Notification) => void;
}
