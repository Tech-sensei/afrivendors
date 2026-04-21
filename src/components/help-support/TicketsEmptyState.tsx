"use client";

import { MessageCircle, Loader2 } from "lucide-react";

export function TicketsEmptyState({
  hasSearch,
  isLoading,
}: {
  hasSearch: boolean;
  isLoading?: boolean;
}) {
  if (isLoading) {
    return (
      <div
        className="flex flex-col items-center justify-center gap-3 rounded-3xl border border-accent-20 bg-white px-6 py-20 text-center"
        role="status"
        aria-live="polite"
        aria-busy="true"
      >
        <Loader2 className="h-10 w-10 animate-spin text-primary-100" aria-hidden />
        <p className="font-unageo text-sm text-accent-80">Loading tickets…</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-accent-20 bg-white px-6 py-16 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary-700">
        <MessageCircle className="h-8 w-8 text-accent-60" />
      </div>
      <h3 className="font-unageo text-base font-semibold text-secondary-000">
        No tickets found
      </h3>
      <p className="mt-2 max-w-sm font-unageo text-sm text-accent-80">
        {hasSearch
          ? "Try adjusting your search or filters."
          : "Create your first support ticket when you need help."}
      </p>
    </div>
  );
}
