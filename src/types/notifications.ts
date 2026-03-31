export type NotificationType = "booking" | "message" | "favorite" | "update";

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
  actionUrl?: string;
}

export interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate?: (page: string) => void;
}
