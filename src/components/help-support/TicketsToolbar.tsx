"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import type { SupportTicketStatus } from "@/types/support";

const statusOptions: { value: string; label: string }[] = [
  { value: "all", label: "All status" },
  { value: "open", label: "Open" },
  { value: "pending", label: "Pending" },
  { value: "in-progress", label: "In progress" },
  { value: "resolved", label: "Resolved" },
  { value: "closed", label: "Closed" },
];

export function TicketsToolbar({
  searchQuery,
  onSearchChange,
  filterStatus,
  onFilterStatusChange,
}: {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  filterStatus: SupportTicketStatus | "all";
  onFilterStatusChange: (value: SupportTicketStatus | "all") => void;
}) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="relative flex-1">
        <Search className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-accent-60" />
        <Input
          type="search"
          placeholder="Search tickets…"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="h-12 rounded-xl border-accent-20 pl-11 font-unageo text-sm focus-visible:border-primary-100 focus-visible:ring-primary-100/20"
        />
      </div>
      <select
        value={filterStatus}
        onChange={(e) =>
          onFilterStatusChange(e.target.value as SupportTicketStatus | "all")
        }
        className="h-12 shrink-0 rounded-xl border border-accent-20 bg-white px-4 font-unageo text-sm text-secondary-000 outline-none transition-colors focus:border-primary-100 focus:ring-2 focus:ring-primary-100/20 cursor-pointer sm:min-w-[160px]"
      >
        {statusOptions.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}
