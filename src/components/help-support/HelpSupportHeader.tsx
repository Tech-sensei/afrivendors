"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HelpSupportHeader({ onNewTicket }: { onNewTicket: () => void }) {
  return (
    <div className="border-b border-accent-20 bg-white px-5 py-8 sm:px-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="font-unbounded text-2xl font-bold text-secondary-000 sm:text-3xl">
            Help &amp; Support
          </h1>
          <p className="mt-2 max-w-xl font-unageo text-sm text-accent-80 sm:text-base">
            Get help with your account, bookings, and more
          </p>
        </div>
        <Button
          type="button"
          onClick={onNewTicket}
          className="h-12 shrink-0 rounded-full bg-primary-100 px-6 font-unageo text-sm font-semibold text-white hover:bg-primary-100/90"
        >
          <Plus className="mr-2 h-4 w-4" />
          Create new ticket
        </Button>
      </div>
    </div>
  );
}
