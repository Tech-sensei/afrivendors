"use client";

import { Loader2 } from "lucide-react";
import type { SupportTicket, SupportTicketStatus } from "@/types/support";
import { TicketsToolbar } from "./TicketsToolbar";
import { TicketRow } from "./TicketRow";
import { TicketsEmptyState } from "./TicketsEmptyState";

export function TicketsListSection({
  tickets,
  searchQuery,
  onSearchChange,
  filterStatus,
  onFilterStatusChange,
  onSelectTicket,
  isLoading,
  isError,
  errorMessage,
  hasNextPage,
  isFetchingNextPage,
  onLoadMore,
}: {
  tickets: SupportTicket[];
  searchQuery: string;
  onSearchChange: (value: string) => void;
  filterStatus: SupportTicketStatus | "all";
  onFilterStatusChange: (value: SupportTicketStatus | "all") => void;
  onSelectTicket: (ticket: SupportTicket) => void;
  isLoading?: boolean;
  isError?: boolean;
  errorMessage?: string | null;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  onLoadMore?: () => void;
}) {
  const showEmpty = tickets.length === 0;
  const showInitialLoading = Boolean(isLoading) && showEmpty;

  return (
    <div>
      <TicketsToolbar
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
        filterStatus={filterStatus}
        onFilterStatusChange={onFilterStatusChange}
      />

      {isError && errorMessage && (
        <div className="mb-4 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 font-unageo text-sm text-red-700">
          {errorMessage}
        </div>
      )}

      {showEmpty ? (
        <TicketsEmptyState
          hasSearch={Boolean(searchQuery.trim())}
          isLoading={showInitialLoading}
        />
      ) : (
        <div className="grid gap-3">
          {tickets.map((ticket) => (
            <TicketRow
              key={ticket.id}
              ticket={ticket}
              onClick={onSelectTicket}
            />
          ))}
        </div>
      )}

      {!showEmpty && hasNextPage && onLoadMore && (
        <div className="flex justify-center pt-6">
          <button
            type="button"
            onClick={onLoadMore}
            disabled={isFetchingNextPage}
            className="inline-flex min-w-[140px] items-center justify-center gap-2 rounded-full border border-accent-20 bg-white px-6 py-3 font-unageo text-sm font-semibold text-secondary-000 transition-colors hover:border-primary-100/40 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
          >
            {isFetchingNextPage ? (
              <>
                <Loader2 className="h-4 w-4 shrink-0 animate-spin text-primary-100" />
                Loading…
              </>
            ) : (
              "Load more"
            )}
          </button>
        </div>
      )}
    </div>
  );
}
