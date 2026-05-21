"use client";

import type { ReactNode } from "react";
import {
  Calendar,
  Clock,
  MapPin,
  PoundSterling,
  Sparkles,
  User,
} from "lucide-react";
import { Drawer, DrawerSection } from "@/app/(dashboard)/Drawer";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import type { CustomOrder } from "@/types/customOrders";
import { CustomOrderStatusBadge } from "./CustomOrderStatusBadge";
import { CustomOrderTimeline } from "./CustomOrderTimeline";
import { CustomOrderQuoteCard } from "./CustomOrderQuoteCard";
import { formatVendorPrice } from "@/services/vendor";
import {
  canCancelOrder,
  getPendingQuotes,
  orderNeedsRelease,
} from "@/lib/customOrderUi";

function SoftPanel({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        "rounded-xl border border-accent-20 bg-secondary-800 p-4",
        className
      )}
    >
      {children}
    </div>
  );
}

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: CustomOrder | null;
  onCancel: (orderId: string) => void;
  onAcceptQuote: (orderId: string, quoteId: string) => void;
  onDeclineQuote: (orderId: string, quoteId: string) => void;
  onReleaseFunds: (orderId: string) => void;
  onSimulateQuote?: (orderId: string) => void;
};

export function CustomOrderDetailDrawer({
  open,
  onOpenChange,
  order,
  onCancel,
  onAcceptQuote,
  onDeclineQuote,
  onReleaseFunds,
  onSimulateQuote,
}: Props) {
  if (!order) return null;

  const pendingQuotes = getPendingQuotes(order);
  const showQuotes =
    order.quotes.length > 0 ||
    ["submitted", "quoting", "quote_accepted", "payment_pending"].includes(
      order.status
    );

  const dateDisplay = order.flexibleDates
    ? `${order.flexibleDates.start} to ${order.flexibleDates.end}`
    : order.preferredDate
      ? new Date(order.preferredDate).toLocaleDateString("en-GB", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })
      : "Flexible";

  const footer = (
    <div className="flex flex-col gap-3">
      {orderNeedsRelease(order) && (
        <Button
          type="button"
          className="w-full rounded-[18px] bg-primary-100 text-white hover:bg-primary-100/90"
          onClick={() => onReleaseFunds(order.id)}
        >
          Release funds
        </Button>
      )}
      {canCancelOrder(order) && (
        <div className="flex flex-wrap gap-3">
          <Button
            type="button"
            variant="destructive"
            className="rounded-[18px]"
            onClick={() => onCancel(order.id)}
          >
            Cancel order
          </Button>
        </div>
      )}
    </div>
  );

  return (
    <Drawer
      open={open}
      onOpenChange={onOpenChange}
      title="Custom order"
      description={order.referenceId}
      size="lg"
      footer={footer}
    >
      <DrawerSection title="Summary">
        <SoftPanel>
          <div className="mb-3 flex items-start justify-between gap-3">
            <h4 className="font-unbounded text-base font-semibold text-secondary-000">
              {order.title}
            </h4>
            <CustomOrderStatusBadge status={order.status} size="sm" />
          </div>
          <p className="text-xs text-accent-80">Created {order.createdAt}</p>
        </SoftPanel>
      </DrawerSection>

      <DrawerSection title="Timeline">
        <CustomOrderTimeline events={order.timeline} />
      </DrawerSection>

      <DrawerSection title="Who receives quotes">
        <SoftPanel>
          <p className="font-unbounded text-sm font-semibold text-secondary-000">
            {order.openMarketLabel}
          </p>
          <p className="mt-1 text-xs text-accent-80">
            Every verified vendor in this category can view your request and
            submit a quote.
          </p>
        </SoftPanel>
      </DrawerSection>

      {showQuotes && (
        <DrawerSection title={`Quotes (${order.quotes.length})`}>
          {order.status === "submitted" && order.quotes.length === 0 && (
            <SoftPanel className="mb-4">
              <p className="text-sm text-accent-80">
                Vendors typically respond within 24 hours. You&apos;ll be
                notified when quotes arrive.
              </p>
              {onSimulateQuote && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-3 rounded-[18px] gap-1.5"
                  onClick={() => onSimulateQuote(order.id)}
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  Simulate vendor quote (demo)
                </Button>
              )}
            </SoftPanel>
          )}
          <div className="space-y-4">
            {order.quotes.map((quote) => (
              <CustomOrderQuoteCard
                key={quote.id}
                order={order}
                quote={quote}
                onAccept={(quoteId) => onAcceptQuote(order.id, quoteId)}
                onDecline={(quoteId) => onDeclineQuote(order.id, quoteId)}
              />
            ))}
          </div>
          {pendingQuotes.length > 1 && (
            <p className="mt-3 text-xs text-accent-80">
              Compare quotes, then accept one to proceed to payment.
            </p>
          )}
        </DrawerSection>
      )}

      <DrawerSection title="Request details">
        <div className="space-y-3 text-sm">
          <p>
            <span className="text-accent-80">Category · </span>
            {order.category}
          </p>
          <Separator className="bg-accent-20" />
          <p className="leading-relaxed text-secondary-000">{order.description}</p>
        </div>
      </DrawerSection>

      <DrawerSection title="Schedule & budget">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-start gap-2">
            <Calendar className="mt-0.5 h-4 w-4 text-accent-60" />
            <div>
              <p className="text-xs text-accent-80">Date</p>
              <p className="font-medium text-secondary-000">{dateDisplay}</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Clock className="mt-0.5 h-4 w-4 text-accent-60" />
            <div>
              <p className="text-xs text-accent-80">Time</p>
              <p className="font-medium text-secondary-000">{order.preferredTime}</p>
            </div>
          </div>
          <div className="col-span-2 flex items-start gap-2">
            <PoundSterling className="mt-0.5 h-4 w-4 text-accent-60" />
            <div>
              <p className="text-xs text-accent-80">Budget</p>
              <p className="font-unbounded font-semibold text-primary-100">
                {formatVendorPrice(order.budget)}
              </p>
            </div>
          </div>
        </div>
      </DrawerSection>

      <DrawerSection title="Fulfillment">
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-accent-60" />
            {order.customerName}
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-accent-60" />
            {order.location}
          </div>
          {order.scheduledAt && (
            <p className="text-accent-80">Scheduled: {order.scheduledAt}</p>
          )}
        </div>
      </DrawerSection>

      {order.notes && (
        <DrawerSection title="Notes">
          <p className="text-sm text-accent-80">{order.notes}</p>
        </DrawerSection>
      )}
    </Drawer>
  );
}
