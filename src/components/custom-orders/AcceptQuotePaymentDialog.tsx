"use client";

import type { ReactNode } from "react";
import { CreditCard, Loader2, ShieldCheck, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import { formatVendorPrice } from "@/services/vendor";
import type { CustomOrderQuote } from "@/types/customOrders";
import type { PaymentMethod } from "@/types/booking";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  quote: CustomOrderQuote | null;
  orderTitle?: string;
  paymentMethod: PaymentMethod;
  onPaymentMethodChange: (method: PaymentMethod) => void;
  walletBalance: number;
  walletLoading?: boolean;
  onFundWallet: () => void;
  onConfirm: () => void;
  isSubmitting?: boolean;
};

function PaymentOption({
  id,
  value,
  selected,
  title,
  description,
  badge,
  children,
}: {
  id: string;
  value: PaymentMethod;
  selected: boolean;
  title: string;
  description: string;
  badge?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <label
      htmlFor={id}
      className={cn(
        "flex cursor-pointer gap-3 rounded-2xl border-2 p-4 transition-colors",
        selected
          ? "border-primary-100 bg-primary-300/50"
          : "border-[#EFE6E1] bg-white hover:border-accent-40"
      )}
    >
      <RadioGroupItem value={value} id={id} className="mt-0.5" />
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <p className="font-semibold text-secondary-000">{title}</p>
          {badge}
        </div>
        <p className="mt-0.5 text-sm text-accent-80">{description}</p>
        {children}
      </div>
    </label>
  );
}

export function AcceptQuotePaymentDialog({
  open,
  onOpenChange,
  quote,
  orderTitle,
  paymentMethod,
  onPaymentMethodChange,
  walletBalance,
  walletLoading,
  onFundWallet,
  onConfirm,
  isSubmitting = false,
}: Props) {
  if (!quote) return null;

  const total = quote.totalAmount;
  const hasInsufficientFunds =
    paymentMethod === "wallet" && total > walletBalance;

  const confirmLabel =
    paymentMethod === "online"
      ? "Accept & pay online"
      : "Accept & pay with wallet";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton
        className={cn(
          "flex max-h-[min(90vh,720px)] flex-col gap-0 overflow-hidden rounded-2xl border-[#EFE6E1] p-0 sm:max-w-[440px]",
          "[&>button]:top-5 [&>button]:right-5"
        )}
      >
        <div className="border-b border-[#EFE6E1] px-6 pt-6 pb-5 pr-12">
          <DialogTitle className="font-unbounded text-xl font-semibold text-secondary-000">
            Accept quote & pay
          </DialogTitle>
          <p className="mt-2 text-sm font-semibold text-secondary-000">
            {quote.vendorName}
          </p>
          {orderTitle ? (
            <p className="mt-0.5 line-clamp-2 text-sm text-accent-80">
              {orderTitle}
            </p>
          ) : null}
        </div>

        <div className="flex-1 space-y-6 overflow-y-auto px-6 py-5">
          <section>
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-accent-80">
              Quote summary
            </h3>
            <ul className="space-y-2.5">
              {quote.lineItems.map((item, idx) => (
                <li
                  key={`${item.description}-${idx}`}
                  className="flex justify-between gap-3 text-sm"
                >
                  <span className="text-secondary-000">{item.description}</span>
                  <span className="shrink-0 font-medium tabular-nums text-secondary-000">
                    {formatVendorPrice(item.amount)}
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex items-center justify-between border-t border-[#EFE6E1] pt-4">
              <span className="font-unbounded text-sm font-semibold text-secondary-000">
                Total
              </span>
              <span className="font-unbounded text-xl font-semibold text-primary-100 tabular-nums">
                {formatVendorPrice(total)}
              </span>
            </div>
          </section>

          <section>
            <h3 className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-accent-80">
              <CreditCard className="h-3.5 w-3.5" />
              Payment method
            </h3>
            <RadioGroup
              value={paymentMethod}
              onValueChange={(v) => onPaymentMethodChange(v as PaymentMethod)}
              className="space-y-3"
            >
              <PaymentOption
                id="co-quote-online"
                value="online"
                selected={paymentMethod === "online"}
                title="Pay online"
                description="Secure checkout via our payment gateway"
              />
              <PaymentOption
                id="co-quote-wallet"
                value="wallet"
                selected={paymentMethod === "wallet"}
                title="Afrivendor wallet"
                description="Pay from your wallet balance"
                badge={
                  walletLoading ? (
                    <Loader2 className="h-4 w-4 shrink-0 animate-spin text-accent-60" />
                  ) : (
                    <span
                      className={cn(
                        "shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold",
                        hasInsufficientFunds
                          ? "bg-amber-50 text-amber-800"
                          : "bg-emerald-50 text-emerald-800"
                      )}
                    >
                      £{walletBalance.toFixed(2)}
                    </span>
                  )
                }
              >
                {hasInsufficientFunds && (
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    className="mt-3 rounded-[14px]"
                    onClick={(e) => {
                      e.preventDefault();
                      onFundWallet();
                    }}
                  >
                    Add funds
                  </Button>
                )}
              </PaymentOption>
            </RadioGroup>

            {paymentMethod === "online" && (
              <p className="mt-3 flex items-start gap-2 rounded-xl bg-secondary-800 px-3 py-2.5 text-xs text-accent-80">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary-100" />
                You&apos;ll be redirected to complete payment after confirming.
              </p>
            )}
          </section>

          <p className="flex items-start gap-2 rounded-xl border border-[#EFE6E1] bg-[#FAF7F5] px-3 py-2.5 text-xs leading-relaxed text-accent-80">
            <Wallet className="mt-0.5 h-4 w-4 shrink-0 text-primary-100" />
            Payment is held in escrow until you release funds after the service
            is complete.
          </p>
        </div>

        <div className="flex gap-3 border-t border-[#EFE6E1] bg-[#FAF7F5] px-6 py-4">
          <Button
            type="button"
            variant="outline"
            className="h-11 flex-1 rounded-[18px] border-accent-20"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="button"
            className="h-11 flex-1 rounded-[18px] bg-primary-100 font-semibold text-white hover:bg-primary-100/90"
            disabled={isSubmitting || hasInsufficientFunds}
            onClick={onConfirm}
          >
            {isSubmitting ? "Processing…" : confirmLabel}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
