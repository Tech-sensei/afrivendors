import type { Notification } from "@/types/notifications";

export const CLIENT_NOTIFICATION_ROUTE_MAP: Record<string, string> = {
  "dashboard-appointments": "/appointments",
  "dashboard-messages": "/messages",
  "dashboard-wallet": "/wallet",
  "dashboard-favourites": "/favourites",
  "dashboard-profile": "/profile",
  "dashboard-settings": "/settings",
};

export function buildClientNotificationHref(
  notification: Pick<
    Notification,
    "referenceType" | "itemId" | "type" | "actionUrl"
  >
): string | undefined {
  const itemId = notification.itemId;
  const ref = notification.referenceType?.toLowerCase();

  if (ref === "chat_message" && itemId != null) {
    return `/messages?itemId=${itemId}`;
  }
  if (ref === "appointment_booking" && itemId != null) {
    return `/appointments?appointmentId=${itemId}`;
  }

  if (notification.actionUrl) {
    return mapNotificationUrl(notification.actionUrl);
  }

  if (notification.type === "message" && itemId != null) {
    return `/messages?itemId=${itemId}`;
  }
  if (notification.type === "booking" && itemId != null) {
    return `/appointments?appointmentId=${itemId}`;
  }

  if (notification.type === "message") return "/messages";
  if (notification.type === "booking") return "/appointments";
  if (notification.type === "favorite") return "/favourites";

  return undefined;
}

export function mapNotificationUrl(url: string): string {
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }
  if (url.startsWith("dashboard-")) {
    return CLIENT_NOTIFICATION_ROUTE_MAP[url] ?? `/${url.replace(/^dashboard-/, "")}`;
  }
  if (url.startsWith("/")) {
    return url;
  }
  return `/${url}`;
}
