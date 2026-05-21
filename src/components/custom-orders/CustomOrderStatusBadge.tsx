"use client";

import { cn } from "@/lib/utils";
import type { CustomOrderStatus } from "@/types/customOrders";

const statusStyles: Record<
  CustomOrderStatus,
  { label: string; className: string }
> = {
  draft: {
    label: "Draft",
    className: "bg-accent-10 text-accent-80 border-accent-20",
  },
  submitted: {
    label: "Waiting for quotes",
    className: "bg-sky-50 text-sky-800 border-sky-200",
  },
  quoting: {
    label: "Quotes received",
    className: "bg-amber-50 text-amber-900 border-amber-200",
  },
  quote_accepted: {
    label: "Processing",
    className: "bg-amber-50 text-amber-900 border-amber-200",
  },
  payment_pending: {
    label: "Processing payment",
    className: "bg-amber-50 text-amber-900 border-amber-200",
  },
  paid: {
    label: "Paid",
    className: "bg-emerald-50 text-emerald-800 border-emerald-200",
  },
  scheduled: {
    label: "Scheduled",
    className: "bg-violet-50 text-violet-800 border-violet-200",
  },
  in_progress: {
    label: "In progress",
    className: "bg-blue-50 text-blue-800 border-blue-200",
  },
  completed: {
    label: "Release funds",
    className: "bg-green-50 text-green-800 border-green-200",
  },
  closed: {
    label: "Completed",
    className: "bg-accent-10 text-accent-80 border-accent-20",
  },
  cancelled: {
    label: "Cancelled",
    className: "bg-red-50 text-red-800 border-red-200",
  },
  expired: {
    label: "Expired",
    className: "bg-accent-10 text-accent-80 border-accent-20",
  },
};

export function CustomOrderStatusBadge({
  status,
  size = "md",
}: {
  status: CustomOrderStatus;
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
        sizeClasses
      )}
    >
      {config.label}
    </span>
  );
}
