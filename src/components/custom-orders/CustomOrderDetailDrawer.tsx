"use client";

import type { ReactNode } from "react";
import { AlertTriangle, Banknote, Loader2, MessageCircle } from "lucide-react";
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
import type { CustomOrder, CustomOrderQuote } from "@/types/customOrders";
import { CustomOrderStatusBadge } from "./CustomOrderStatusBadge";
import { CustomOrderTimeline } from "./CustomOrderTimeline";
import { CustomOrderQuoteCard } from "./CustomOrderQuoteCard";
import { formatVendorPrice } from "@/services/vendor";
import {
  canCancelOrder,
  canEscalateCustomOrderDispute,
  canOpenCustomOrderDispute,
  canReleaseCustomOrderFunds,
  canResolveCustomOrderDispute,
  customOrderPaymentStatusLabel,
  getAcceptedQuote,
  getPendingQuotes,
  isCustomOrderDisputed,
  isCustomOrderFundsReleased,
} from "@/lib/customOrderUi";
import { isOrderDisputeEscalated } from "@/lib/orderDispute";

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
  isLoading?: boolean;
  onCancel?: (orderId: string) => void;
  onAcceptQuote: (orderId: string, quoteId: string) => void;
  onReleaseFunds: (orderId: string) => void;
  onOpenDispute?: (orderId: string) => void;
  onPayVendor?: (orderId: string) => void;
  onEscalateDispute?: (orderId: string) => void;
  onMessageQuote?: (order: CustomOrder, quote: CustomOrderQuote) => void;
  onMessageVendor?: (order: CustomOrder) => void;
  isReleasingFunds?: boolean;
  onSimulateQuote?: (orderId: string) => void;
};

export function CustomOrderDetailDrawer({
  open,
  onOpenChange,
  order,
  isLoading = false,
  onCancel,
  onAcceptQuote,
  onReleaseFunds,
  onOpenDispute,
  onPayVendor,
  onEscalateDispute,
  onMessageQuote,
  onMessageVendor,
  isReleasingFunds = false,
  onSimulateQuote,
}: Props) {
  if (!order) {
    if (!open) return null;
    return (
      <Drawer open={open} onOpenChange={onOpenChange} title="Custom order" size="lg">
        <div className="flex h-48 items-center justify-center">
          {isLoading ? (
            <Loader2 className="h-8 w-8 animate-spin text-primary-100" />
          ) : (
            <p className="text-sm text-accent-80">Custom order not found.</p>
          )}
        </div>
      </Drawer>
    );
  }

  const pendingQuotes = getPendingQuotes(order);
  const acceptedQuote = getAcceptedQuote(order);
  const isCompleted = order.status === "completed" || order.status === "closed";
  const fundsReleased = isCustomOrderFundsReleased(order);
  const disputed = isCustomOrderDisputed(order);
  const disputeEscalated = isOrderDisputeEscalated(order.dispute);
  const canRelease = canReleaseCustomOrderFunds(order);
  const canDispute = canOpenCustomOrderDispute(order);
  const canEscalate = canEscalateCustomOrderDispute(order);
  const canPayVendor = canResolveCustomOrderDispute(order);
  const showQuotes =
    order.quotes.length > 0 ||
    ["submitted", "quoting", "quote_accepted", "payment_pending"].includes(
      order.status
    );

  const canMessageAcceptedVendor =
    acceptedQuote?.vendorUserId != null &&
    !["cancelled", "expired", "draft"].includes(order.status);

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
      {isCompleted && fundsReleased ? null : isCompleted ? (
        disputed ? (
          <>
            <div className={`grid gap-3 ${canPayVendor ? "grid-cols-2" : "grid-cols-1"}`}>
              {canPayVendor && (
                <Button
                  type="button"
                  className="h-11 min-w-0 w-full gap-2 rounded-[18px] bg-primary-100 text-white hover:bg-primary-100/90"
                  onClick={() => onPayVendor?.(order.id)}
                >
                  <Banknote className="h-4 w-4 shrink-0" />
                  <span className="truncate">Pay vendor</span>
                </Button>
              )}
              {canMessageAcceptedVendor && (
                <Button
                  type="button"
                  variant="outline"
                  className="h-11 min-w-0 w-full gap-2 rounded-[18px]"
                  onClick={() => onMessageVendor?.(order)}
                >
                  <MessageCircle className="h-4 w-4 shrink-0" />
                  <span className="truncate">Message</span>
                </Button>
              )}
            </div>
            {canEscalate && (
              <Button
                type="button"
                variant="outline"
                className="h-11 w-full gap-2 rounded-[18px] border-amber-200 bg-amber-50/50 font-semibold text-amber-950 hover:bg-amber-100"
                onClick={() => onEscalateDispute?.(order.id)}
              >
                <AlertTriangle className="h-4 w-4 shrink-0" />
                Escalate to Afrivendors
              </Button>
            )}
          </>
        ) : !fundsReleased ? (
          <>
            <div className="grid grid-cols-2 gap-3">
              <Button
                type="button"
                className="h-11 min-w-0 w-full gap-2 rounded-[18px] bg-primary-100 text-white hover:bg-primary-100/90 disabled:cursor-not-allowed disabled:opacity-60"
                disabled={!canRelease || isReleasingFunds}
                onClick={() => onReleaseFunds(order.id)}
              >
                <Banknote className="h-4 w-4 shrink-0" />
                <span className="truncate">
                  {isReleasingFunds ? "Releasing…" : "Release funds"}
                </span>
              </Button>
              <Button
                type="button"
                variant="outline"
                className="h-11 min-w-0 w-full gap-2 rounded-[18px] border-amber-200 bg-amber-50/50 font-semibold text-amber-950 hover:bg-amber-100"
                disabled={!canDispute}
                onClick={() => onOpenDispute?.(order.id)}
              >
                <AlertTriangle className="h-4 w-4 shrink-0" />
                <span className="truncate">Open dispute</span>
              </Button>
            </div>
            {canMessageAcceptedVendor && (
              <Button
                type="button"
                variant="outline"
                className="h-11 w-full gap-2 rounded-[18px]"
                onClick={() => onMessageVendor?.(order)}
              >
                <MessageCircle className="h-4 w-4 shrink-0" />
                <span className="truncate">Message vendor</span>
              </Button>
            )}
          </>
        ) : null
      ) : canMessageAcceptedVendor ? (
        <Button
          type="button"
          variant="outline"
          className="h-11 w-full gap-2 rounded-[18px]"
          onClick={() => onMessageVendor?.(order)}
        >
          <MessageCircle className="h-4 w-4 shrink-0" />
          <span className="truncate">Message vendor</span>
        </Button>
      ) : null}
      {onCancel && canCancelOrder(order) && (
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
          {(order.paymentStatus === "paid" ||
            order.paymentStatus === "released" ||
            order.paymentStatus === "disputed" ||
            disputed) && (
            <p className="mt-2 text-xs font-semibold text-secondary-000">
              Payment: {customOrderPaymentStatusLabel(order)}
            </p>
          )}
        </SoftPanel>
      </DrawerSection>

      {fundsReleased && isCompleted && (
        <DrawerSection title="Payment">
          <SoftPanel>
            <p className="text-xs font-semibold text-slate-800">Payment released</p>
            <p className="mt-1 text-sm text-accent-80">
              Funds were sent to the vendor. This request is closed.
            </p>
          </SoftPanel>
        </DrawerSection>
      )}

      {disputed && order.dispute?.reason && (
        <DrawerSection title="Dispute">
          <SoftPanel
            className={cn(
              disputeEscalated
                ? "border-blue-200 bg-blue-50/80"
                : "border-amber-200 bg-amber-50/80"
            )}
          >
            <p
              className={cn(
                "text-xs font-semibold",
                disputeEscalated ? "text-blue-900" : "text-amber-900"
              )}
            >
              {disputeEscalated ? "Escalated to Afrivendors" : "Dispute reason"}
            </p>
            <p className="mt-1 text-sm text-secondary-000">{order.dispute.reason}</p>
            <p className="mt-2 text-xs text-accent-80">
              {disputeEscalated
                ? "Afrivendors is reviewing this dispute and will decide on the payout."
                : "Resolve with the vendor, pay the vendor if you have agreed, or escalate to Afrivendors."}
            </p>
          </SoftPanel>
        </DrawerSection>
      )}

      {acceptedQuote && (
        <DrawerSection title="Vendor">
          <SoftPanel>
            <p className="font-unbounded text-sm font-semibold text-secondary-000">
              {acceptedQuote.vendorName}
            </p>
            <p className="mt-1 text-sm text-primary-100">
              {formatVendorPrice(acceptedQuote.totalAmount)}
            </p>
          </SoftPanel>
        </DrawerSection>
      )}

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
                onMessage={(quote) => onMessageQuote?.(order, quote)}
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
          {order.customerName ? (
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-accent-60" />
              {order.customerName}
            </div>
          ) : null}
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
