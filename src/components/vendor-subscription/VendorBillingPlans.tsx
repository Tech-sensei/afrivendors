"use client";

import { useState } from "react";
import { Check, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  VENDOR_BILLING_INTERVALS,
  VENDOR_SUBSCRIPTION_FEATURES,
  VENDOR_TRIAL_MONTHS,
  type VendorBillingIntervalId,
} from "@/data/vendorSubscription";

type Props = {
  onSelectPlan?: (intervalId: VendorBillingIntervalId) => void;
  ctaLabel?: string;
  showFeatures?: boolean;
  title?: string;
  subtitle?: string;
};

export function VendorBillingPlans({
  onSelectPlan,
  ctaLabel = "Start as a vendor",
  showFeatures = true,
  title = "Choose your billing cycle",
  subtitle = `All plans include the same features. You won't be charged until after your ${VENDOR_TRIAL_MONTHS}-month free trial.`,
}: Props) {
  const [highlighted, setHighlighted] = useState<VendorBillingIntervalId>(
    "quarterly"
  );

  return (
    <div className="space-y-10">
      {(title || subtitle) && (
        <div className="text-center">
          {title && (
            <h2 className="font-unbounded text-2xl font-semibold text-secondary-000 sm:text-3xl">
              {title}
            </h2>
          )}
          {subtitle && (
            <p className="mx-auto mt-3 max-w-2xl text-accent-80">{subtitle}</p>
          )}
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {VENDOR_BILLING_INTERVALS.map((interval) => {
          const isPopular = interval.popular;
          const isActive = highlighted === interval.id;
          return (
            <div
              key={interval.id}
              role="button"
              tabIndex={0}
              onClick={() => setHighlighted(interval.id)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setHighlighted(interval.id);
                }
              }}
              className={cn(
                "relative flex cursor-pointer flex-col rounded-2xl border-2 p-6 text-left transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-primary-100",
                isActive || isPopular
                  ? "z-[1] scale-[1.02] border-primary-100 bg-white shadow-[0_12px_32px_rgba(197,108,49,0.12)]"
                  : "border-[#EFE6E1] bg-white hover:border-primary-100/40 hover:shadow-md"
              )}
            >
              {isPopular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-primary-100 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-white">
                  Most popular
                </span>
              )}
              <p className="text-sm font-semibold uppercase tracking-wide text-accent-80">
                {interval.label}
              </p>
              <div className="mt-4 flex items-end gap-1">
                <span className="font-unbounded text-4xl font-semibold leading-none text-secondary-000">
                  {interval.priceLabel}
                </span>
              </div>
              <p className="mt-2 text-sm font-medium text-primary-100">
                {interval.perMonthLabel}
                {interval.months > 1 && (
                  <span className="text-accent-80">
                    {" "}
                    · billed every {interval.months} months
                  </span>
                )}
              </p>
              {interval.saveLabel && (
                <span className="mt-3 inline-flex w-fit rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-800">
                  {interval.saveLabel}
                </span>
              )}
              {onSelectPlan && (
                <Button
                  type="button"
                  className={cn(
                    "mt-6 h-11 w-full rounded-xl text-sm font-semibold",
                    isPopular
                      ? "bg-primary-100 text-white hover:bg-primary-100/90"
                      : "border border-[#EFE6E1] bg-white text-secondary-000 hover:bg-accent-10"
                  )}
                  variant={isPopular ? "default" : "outline"}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectPlan(interval.id);
                  }}
                >
                  {ctaLabel}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              )}
            </div>
          );
        })}
      </div>

      {showFeatures && (
        <div className="overflow-hidden rounded-3xl border border-[#EFE6E1] bg-white shadow-sm">
          <div className="border-b border-[#EFE6E1] bg-[#FAF7F5] px-6 py-4 sm:px-8">
            <h3 className="font-unbounded text-lg font-semibold text-secondary-000">
              Everything included
            </h3>
            <p className="mt-1 text-sm text-accent-80">
              Same platform access on every billing cycle
            </p>
          </div>
          <ul className="grid gap-4 p-6 sm:grid-cols-2 sm:p-8">
            {VENDOR_SUBSCRIPTION_FEATURES.map((feature) => (
              <li
                key={feature}
                className="flex gap-3 text-sm text-secondary-000"
              >
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-100/10">
                  <Check className="h-3.5 w-3.5 text-primary-100" />
                </span>
                {feature}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
