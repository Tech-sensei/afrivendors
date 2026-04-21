"use client";

import type { SupportTicket } from "@/types/support";
import { SupportTicketStatusBadge } from "./SupportTicketStatusBadge";
import { SupportPriorityPill } from "./SupportPriorityPill";
import { formatSupportRelativeDate } from "@/lib/supportDates";
import { Separator } from "@/components/ui/separator";

export function TicketOverviewCard({ ticket }: { ticket: SupportTicket }) {
  return (
    <div className="rounded-2xl border border-accent-20 bg-white p-5">
      <h3 className="font-unageo text-lg font-semibold text-secondary-000">
        {ticket.subject}
      </h3>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <SupportTicketStatusBadge status={ticket.status} />
        <span className="rounded-md bg-secondary-700 px-2 py-0.5 font-unageo text-xs text-accent-80">
          {ticket.category}
        </span>
        <SupportPriorityPill priority={ticket.priority} />
      </div>
      <p className="mt-4 font-unageo text-sm leading-relaxed text-accent-80">
        {ticket.description}
      </p>
      <Separator className="my-4 bg-accent-20" />
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="font-unageo text-[11px] font-medium uppercase tracking-wide text-accent-60">
            Created
          </p>
          <p className="mt-1 font-unageo text-sm font-medium text-secondary-000">
            {formatSupportRelativeDate(ticket.createdAt)}
          </p>
        </div>
        <div>
          <p className="font-unageo text-[11px] font-medium uppercase tracking-wide text-accent-60">
            Last updated
          </p>
          <p className="mt-1 font-unageo text-sm font-medium text-secondary-000">
            {formatSupportRelativeDate(ticket.updatedAt)}
          </p>
        </div>
      </div>
    </div>
  );
}
