"use client";

import { cn } from "@/lib/utils";
import type { SupportTicketPriority } from "@/types/support";

export function SupportPriorityPill({
  priority,
  className,
}: {
  priority: SupportTicketPriority;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "rounded-md bg-secondary-700 px-2 py-0.5 font-unageo text-xs text-accent-80 capitalize",
        className
      )}
    >
      {priority} priority
    </span>
  );
}
