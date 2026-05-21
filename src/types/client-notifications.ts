import type { Notification, NotificationType } from "@/types/notifications";

export type { Notification, NotificationType };

export interface NotificationsListMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface NotificationsPage {
  items: Notification[];
  meta: NotificationsListMeta;
}
