"use client";

import { FileText } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { CustomOrder, CustomOrderTabId } from "@/types/customOrders";
import { CustomOrderStatusBadge } from "./CustomOrderStatusBadge";
import {
  canCancelOrder,
  getPendingQuotes,
  getQuoteSummary,
} from "@/lib/customOrderUi";
import { formatVendorPrice } from "@/services/vendor";

type Props = {
  order: CustomOrder;
  activeTab?: CustomOrderTabId;
  onViewDetails: (order: CustomOrder) => void;
  onCancel?: (orderId: string) => void;
};

export function CustomOrderListCard({
  order,
  activeTab,
  onViewDetails,
  onCancel,
}: Props) {
  const vendorLine = order.openMarketLabel ?? `All vendors in ${order.category}`;

  const pendingCount = getPendingQuotes(order).length;
  const isWaitingTab = activeTab === "waiting";

  const reviewQuoteLabel =
    pendingCount > 1 ? `Review quotes (${pendingCount})` : "Review quote";
  const detailsLabel = isWaitingTab ? "Review quote" : "View details";

  let primaryLabel = detailsLabel;
  if (pendingCount > 0) primaryLabel = reviewQuoteLabel;
  else if (isWaitingTab) primaryLabel = "Review quote";

  return (
    <Card className="rounded-2xl border border-[#EFE6E1] bg-white shadow-[0_8px_24px_rgba(35,19,5,0.06)]">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-300/40 sm:flex">
            <FileText className="h-6 w-6 text-primary-100" />
          </div>

          <div className="min-w-0 flex-1">
            <div className="mb-2 flex items-start justify-between gap-4">
              <h3 className="font-unbounded text-base font-semibold text-secondary-000">
                {order.title}
              </h3>
              <CustomOrderStatusBadge status={order.status} />
            </div>

            <p className="mb-1 text-xs font-medium text-accent-80">
              {order.referenceId} · {order.createdAt}
            </p>

            <div className="mb-2 flex flex-wrap items-center gap-2 text-sm text-accent-80">
              <span>{vendorLine}</span>
              <span className="text-accent-60">·</span>
              <span>Budget {formatVendorPrice(order.budget)}</span>
            </div>

            <p className="mb-4 text-sm font-medium text-primary-100">
              {getQuoteSummary(order)}
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <Button
                type="button"
                className="h-11 rounded-[18px] bg-primary-100 px-5 text-white hover:bg-primary-100/90"
                onClick={() => onViewDetails(order)}
              >
                {primaryLabel}
              </Button>

              {onCancel && canCancelOrder(order) && (
                <Button
                  type="button"
                  variant="outline"
                  className="h-11 rounded-[18px] border-accent-20 px-5 text-destructive hover:bg-destructive/5 hover:text-destructive"
                  onClick={() => onCancel(order.id)}
                >
                  Cancel order
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
