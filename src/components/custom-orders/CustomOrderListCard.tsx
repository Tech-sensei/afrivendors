"use client";

import { FileText } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { CustomOrder } from "@/types/customOrders";
import { CustomOrderStatusBadge } from "./CustomOrderStatusBadge";
import {
  canCancelOrder,
  getPendingQuotes,
  getQuoteSummary,
  orderNeedsRelease,
} from "@/lib/customOrderUi";
import { formatVendorPrice } from "@/services/vendor";

type Props = {
  order: CustomOrder;
  onViewDetails: (order: CustomOrder) => void;
  onPrimaryAction: (order: CustomOrder) => void;
  onCancel: (orderId: string) => void;
};

export function CustomOrderListCard({
  order,
  onViewDetails,
  onPrimaryAction,
  onCancel,
}: Props) {
  const vendorLine = order.openMarketLabel ?? `All vendors in ${order.category}`;

  const pendingCount = getPendingQuotes(order).length;

  let primaryLabel = "View details";
  if (orderNeedsRelease(order)) primaryLabel = "Release funds";
  else if (pendingCount > 0) primaryLabel = `Review quotes (${pendingCount})`;

  const primaryOpensDetail =
    !orderNeedsRelease(order) && pendingCount === 0;

  return (
    <Card className="rounded-2xl border border-[#EFE6E1] bg-white shadow-[0_8px_24px_rgba(35,19,5,0.06)]">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-300/40">
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
                size="sm"
                className="h-9 rounded-[18px] bg-primary-100 text-white hover:bg-primary-100/90"
                onClick={() => {
                  if (primaryOpensDetail) {
                    onViewDetails(order);
                  } else {
                    onPrimaryAction(order);
                  }
                }}
              >
                {primaryLabel}
              </Button>

              {!primaryOpensDetail && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-9 rounded-[18px] border-accent-20"
                  onClick={() => onViewDetails(order)}
                >
                  View details
                </Button>
              )}

              {canCancelOrder(order) && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-9 rounded-[18px] border-accent-20 text-destructive hover:bg-destructive/5 hover:text-destructive"
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
