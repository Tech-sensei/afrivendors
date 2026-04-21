"use client";

import { ChevronRight } from "lucide-react";
import type { SupportTicket } from "@/types/support";
import { SupportTicketStatusBadge } from "./SupportTicketStatusBadge";
import { formatSupportRelativeDate } from "@/lib/supportDates";

export function TicketRow({
  ticket,
  onClick,
}: {
  ticket: SupportTicket;
  onClick: (ticket: SupportTicket) => void;
}) {
  const msgCount = ticket.messages.length;
  const msgLabel = msgCount === 1 ? "message" : "messages";

  return (
    <button
      type="button"
      onClick={() => onClick(ticket)}
      className="group w-full rounded-2xl border border-accent-20 bg-white p-5 text-left transition-all hover:border-primary-100/40 hover:shadow-sm active:scale-[0.99] cursor-pointer"
    >
      <div className="mb-3 flex items-start justify-between gap-3">
        <h3 className="font-unageo text-base font-semibold text-secondary-000 group-hover:text-primary-100">
          {ticket.subject}
        </h3>
        <ChevronRight className="mt-0.5 h-5 w-5 shrink-0 text-accent-60 transition-transform group-hover:translate-x-0.5" />
      </div>
      <p className="mb-3 line-clamp-1 font-unageo text-sm text-accent-80">
        {ticket.description}
      </p>
      <div className="flex flex-wrap items-center gap-2 text-xs text-accent-60">
        <SupportTicketStatusBadge status={ticket.status} />
        <span className="rounded-md bg-secondary-700 px-2 py-0.5 font-unageo text-[11px] font-medium text-accent-80">
          {ticket.category}
        </span>
        <span aria-hidden>·</span>
        <span className="font-unageo">Updated {formatSupportRelativeDate(ticket.updatedAt)}</span>
        <span aria-hidden>·</span>
        <span className="font-unageo">
          {msgCount} {msgLabel}
        </span>
      </div>
    </button>
  );
}
