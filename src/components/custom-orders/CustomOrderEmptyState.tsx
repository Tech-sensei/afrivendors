"use client";

import { FileText, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { CustomOrderTabId } from "@/types/customOrders";

const MESSAGES: Partial<Record<CustomOrderTabId, { title: string; body: string }>> = {
  waiting: {
    title: "No requests waiting for quotes",
    body: "Submit a custom order and vendors will send you quotes to compare.",
  },
  active: {
    title: "No active custom orders",
    body: "Paid orders and work in progress show up here.",
  },
  completed: {
    title: "No completed orders yet",
    body: "Finished orders and receipts will be listed here.",
  },
  cancelled: {
    title: "No cancelled orders",
    body: "Cancelled or expired requests appear in this tab.",
  },
};

type Props = {
  tab: CustomOrderTabId;
  onCreate: () => void;
};

export function CustomOrderEmptyState({ tab, onCreate }: Props) {
  const copy = MESSAGES[tab] ?? {
    title: "No custom orders yet",
    body: "Describe what you need, receive quotes from vendors, accept and pay in one step, then track delivery.",
  };

  return (
    <div className="flex flex-col items-center justify-center rounded-2xl bg-accent-10 px-4 py-16">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary-100/10">
        <FileText className="h-8 w-8 text-primary-100" />
      </div>
      <h3 className="mb-2 font-unbounded text-lg font-semibold text-secondary-000">
        {copy.title}
      </h3>
      <p className="mb-6 max-w-[400px] text-center text-sm text-accent-80">
        {copy.body}
      </p>
      {tab === "all" || tab === "waiting" ? (
        <Button
          type="button"
          className="h-11 gap-2 rounded-[18px] bg-primary-100 px-5 font-semibold text-white hover:bg-primary-100/90"
          onClick={onCreate}
        >
          <Plus className="h-4 w-4" />
          New custom order
        </Button>
      ) : null}
    </div>
  );
}
