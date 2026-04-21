"use client";

import { SUPPORT_TICKET_CATEGORIES } from "@/data/supportTickets";
import { cn } from "@/lib/utils";

export function TicketCategorySelect({
  id,
  value,
  onChange,
  required,
  disabled,
  className,
}: {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <select
      id={id}
      value={value}
      required={required}
      disabled={disabled}
      onChange={(e) => onChange(e.target.value)}
      className={cn(
        "h-12 w-full rounded-xl border border-accent-20 bg-white px-4 font-unageo text-sm text-secondary-000 outline-none transition-colors focus:border-primary-100 focus:ring-2 focus:ring-primary-100/20 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60",
        !value && "text-accent-60",
        className
      )}
    >
      <option value="">Select a category</option>
      {SUPPORT_TICKET_CATEGORIES.map((c) => (
        <option key={c} value={c}>
          {c}
        </option>
      ))}
    </select>
  );
}
