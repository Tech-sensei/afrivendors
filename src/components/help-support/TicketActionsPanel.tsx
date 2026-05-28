"use client";

import { Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { SupportTicketStatus } from "@/types/support";

export function TicketActionsPanel({
  status,
  onEdit,
  onReopen,
  onCloseTicket,
}: {
  status: SupportTicketStatus;
  onEdit: () => void;
  onReopen: () => void;
  onCloseTicket: () => void;
}) {
  return (
    <div className="space-y-2">
      <h4 className="font-unageo text-xs font-bold uppercase tracking-widest text-accent-60">
        Actions
      </h4>
      <div className="flex flex-col gap-2">
        {status !== "closed" && (
          <Button
            type="button"
            variant="outline"
            className="h-11 justify-start rounded-xl border-accent-20 font-unageo font-semibold"
            onClick={onEdit}
          >
            <Edit2 className="mr-2 h-4 w-4" />
            Edit ticket
          </Button>
        )}
        {status === "resolved" && (
          <>
            <Button
              type="button"
              variant="outline"
              className="h-11 rounded-xl border-accent-20 font-unageo font-semibold"
              onClick={onReopen}
            >
              Reopen ticket
            </Button>
            <Button
              type="button"
              variant="outline"
              className="h-11 rounded-xl border-red-200 font-unageo font-semibold text-red-700 hover:bg-red-50"
              onClick={onCloseTicket}
            >
              Close ticket
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
