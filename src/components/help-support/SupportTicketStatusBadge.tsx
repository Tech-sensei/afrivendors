"use client";

import { cn } from "@/lib/utils";
import type { SupportTicketStatus } from "@/types/support";

const styles: Record<SupportTicketStatus, string> = {
  open: "bg-blue-100 text-blue-800 border-blue-200",
  pending: "bg-violet-100 text-violet-800 border-violet-200",
  "in-progress": "bg-amber-100 text-amber-800 border-amber-200",
  resolved: "bg-emerald-100 text-emerald-800 border-emerald-200",
  closed: "bg-zinc-100 text-zinc-600 border-zinc-200",
};

const labels: Record<SupportTicketStatus, string> = {
  open: "Open",
  pending: "Pending",
  "in-progress": "In progress",
  resolved: "Resolved",
  closed: "Closed",
};

export function SupportTicketStatusBadge({
  status,
  className,
}: {
  status: SupportTicketStatus;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-lg border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider",
        styles[status],
        className
      )}
    >
      {labels[status]}
    </span>
  );
}
