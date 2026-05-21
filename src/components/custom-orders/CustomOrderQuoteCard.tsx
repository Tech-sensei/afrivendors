"use client";

import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { formatVendorPrice } from "@/services/vendor";
import type { CustomOrder, CustomOrderQuote } from "@/types/customOrders";
import { toast } from "sonner";

type Props = {
  order: CustomOrder;
  quote: CustomOrderQuote;
  onAccept: (quoteId: string) => void;
  onDecline: (quoteId: string) => void;
};

export function CustomOrderQuoteCard({
  order,
  quote,
  onAccept,
  onDecline,
}: Props) {
  const isAccepted = quote.status === "accepted";
  const isRejected =
    quote.status === "rejected" ||
    quote.status === "expired" ||
    quote.status === "withdrawn";
  const canAct =
    quote.status === "pending" &&
    ["submitted", "quoting"].includes(order.status);

  return (
    <div
      className={cn(
        "rounded-xl border p-4 transition-colors",
        isAccepted
          ? "border-emerald-300 bg-emerald-50/60"
          : isRejected
            ? "border-accent-20 bg-accent-10/40 opacity-70"
            : "border-amber-200 bg-amber-50/50"
      )}
    >
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <p className="font-unbounded text-sm font-semibold text-secondary-000">
            {quote.vendorName}
          </p>
          <p className="text-xs text-accent-80">
            Valid until{" "}
            {new Date(quote.validUntil).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </p>
        </div>
        <p className="font-unbounded text-lg font-semibold text-primary-100 shrink-0">
          {formatVendorPrice(quote.totalAmount)}
        </p>
      </div>

      <div className="mb-3 space-y-1.5">
        {quote.lineItems.map((item, idx) => (
          <div
            key={`${item.description}-${idx}`}
            className="flex justify-between gap-2 text-sm"
          >
            <span className="text-secondary-000">{item.description}</span>
            <span className="shrink-0 font-semibold text-secondary-000">
              {formatVendorPrice(item.amount)}
            </span>
          </div>
        ))}
      </div>

      {quote.message ? (
        <p className="mb-3 text-sm italic text-accent-80">&ldquo;{quote.message}&rdquo;</p>
      ) : null}

      {isAccepted && (
        <p className="text-xs font-semibold text-emerald-800">Selected quote</p>
      )}
      {isRejected && !isAccepted && (
        <p className="text-xs font-semibold text-accent-80">Not selected</p>
      )}

      {canAct && (
        <div className="flex flex-wrap gap-2 pt-1">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="rounded-[18px] gap-1.5"
            onClick={() => {
              toast.info("Messaging will open when chat is linked to this order.");
            }}
          >
            <MessageCircle className="h-3.5 w-3.5" />
            Message
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="rounded-[18px]"
            onClick={() => onDecline(quote.id)}
          >
            Decline
          </Button>
          <Button
            type="button"
            size="sm"
            className="rounded-[18px] bg-primary-100 text-white hover:bg-primary-100/90"
            onClick={() => onAccept(quote.id)}
          >
            Accept quote
          </Button>
        </div>
      )}
    </div>
  );
}
