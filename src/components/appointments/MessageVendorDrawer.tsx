import type { MessageVendorDrawerProps } from "@/types/appointments";
import { MessagingPlaceholderSheet } from "@/components/messages/MessagingPlaceholderSheet";

export function MessageVendorDrawer({
  appointment,
  isOpen,
  onClose,
}: MessageVendorDrawerProps) {
  if (!appointment) return null;

  const v = appointment.vendor;
  const fallback = `${v.firstName[0] ?? ""}${v.lastName[0] ?? ""}`;

  return (
    <MessagingPlaceholderSheet
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
      title={`${v.firstName} ${v.lastName}`}
      subtitle={appointment.services[0]?.serviceName ?? ""}
      avatarUrl={v.profilePhoto ?? undefined}
      avatarFallback={fallback}
      contactName={v.firstName}
    />
  );
}
