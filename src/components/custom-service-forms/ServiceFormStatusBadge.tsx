"use client";

import { cn } from "@/lib/utils";
import type { ServiceFormStatus } from "@/types/customServiceForms";

const statusStyles: Record<
  ServiceFormStatus,
  { label: string; className: string }
> = {
  open: {
    label: "Open",
    className: "bg-sky-50 text-sky-800 border-sky-200",
  },
  quoted: {
    label: "Quoted",
    className: "bg-amber-50 text-amber-900 border-amber-200",
  },
  accepted: {
    label: "Accepted",
    className: "bg-emerald-50 text-emerald-800 border-emerald-200",
  },
  scheduled: {
    label: "Scheduled",
    className: "bg-violet-50 text-violet-800 border-violet-200",
  },
  completed: {
    label: "Completed",
    className: "bg-green-50 text-green-800 border-green-200",
  },
  closed: {
    label: "Closed",
    className: "bg-accent-10 text-accent-80 border-accent-20",
  },
};

export function ServiceFormStatusBadge({
  status,
  size = "md",
}: {
  status: ServiceFormStatus;
  size?: "sm" | "md";
}) {
  const config = statusStyles[status];
  const sizeClasses =
    size === "sm" ? "text-xs px-2 py-0.5" : "text-xs px-3 py-1";

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border font-semibold shrink-0",
        config.className,
        sizeClasses,
      )}
    >
      {config.label}
    </span>
  );
}
