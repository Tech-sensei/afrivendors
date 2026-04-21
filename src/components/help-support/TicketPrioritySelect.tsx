"use client";

import type { SupportTicketPriority } from "@/types/support";
import { cn } from "@/lib/utils";

const options: SupportTicketPriority[] = ["low", "medium", "high", "urgent"];

export function TicketPrioritySelect({
  id,
  value,
  onChange,
  disabled,
  className,
}: {
  id?: string;
  value: SupportTicketPriority;
  onChange: (value: SupportTicketPriority) => void;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <select
      id={id}
      value={value}
      disabled={disabled}
      onChange={(e) =>
        onChange(e.target.value as SupportTicketPriority)
      }
      className={cn(
        "h-12 w-full rounded-xl border border-accent-20 bg-white px-4 font-unageo text-sm text-secondary-000 capitalize outline-none transition-colors focus:border-primary-100 focus:ring-2 focus:ring-primary-100/20 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60",
        className
      )}
    >
      {options.map((p) => (
        <option key={p} value={p}>
          {p}
        </option>
      ))}
    </select>
  );
}
