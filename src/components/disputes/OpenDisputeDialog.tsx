"use client";

import { useState } from "react";
import { AlertTriangle, Loader2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { formatVendorPrice } from "@/services/vendor";
import { useOpenDispute } from "@/services/useDisputes";
import type { DisputeOrderType } from "@/types/dispute";

type Props = {
  orderType: DisputeOrderType;
  orderId: number | null;
  vendorName: string;
  amount: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmitted?: () => void;
  onInvalidate?: () => void;
};

const MIN_REASON_LENGTH = 20;

export function OpenDisputeDialog({
  orderType,
  orderId,
  vendorName,
  amount,
  open,
  onOpenChange,
  onSubmitted,
  onInvalidate,
}: Props) {
  const [reason, setReason] = useState("");
  const { mutate: submitDispute, isPending } = useOpenDispute({
    onSuccess: () => {
      onInvalidate?.();
      reset();
      onOpenChange(false);
      onSubmitted?.();
    },
  });

  const reset = () => setReason("");

  const handleOpenChange = (next: boolean) => {
    if (!next) reset();
    onOpenChange(next);
  };

  const trimmedReason = reason.trim();

  const handleSubmit = () => {
    if (!orderId || trimmedReason.length < MIN_REASON_LENGTH) return;

    submitDispute({
      type: orderType,
      orderId,
      reason: trimmedReason,
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogContent className="max-w-md rounded-2xl border-accent-20">
        <AlertDialogHeader>
          <div className="mb-2 flex h-11 w-11 items-center justify-center rounded-xl bg-amber-100">
            <AlertTriangle className="h-5 w-5 text-amber-800" />
          </div>
          <AlertDialogTitle className="font-unbounded text-xl font-semibold text-secondary-000">
            Open a dispute
          </AlertDialogTitle>
          <AlertDialogDescription className="text-left text-sm leading-relaxed text-accent-80">
            {orderId ? (
              <>
                Payment for your order with{" "}
                <span className="font-semibold text-secondary-000">
                  {vendorName}
                </span>{" "}
                ({formatVendorPrice(amount)}) will stay on hold while Afrivendors
                reviews your case. Release funds will be disabled until this is
                resolved.
              </>
            ) : (
              "Tell us what went wrong with your completed order."
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label
              htmlFor="dispute-reason"
              className="text-xs font-semibold text-secondary-000"
            >
              What happened?
            </Label>
            <Textarea
              id="dispute-reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Describe the issue in detail (at least 20 characters)…"
              className="field-sizing-normal min-h-[140px] resize-y rounded-xl"
            />
            <p className="text-xs text-accent-80">
              {trimmedReason.length}/{MIN_REASON_LENGTH} characters minimum
            </p>
          </div>
        </div>

        <AlertDialogFooter className="flex-col gap-2 sm:flex-col">
          <Button
            type="button"
            className="h-11 w-full rounded-xl bg-amber-800 text-white hover:bg-amber-900"
            disabled={
              !orderId ||
              trimmedReason.length < MIN_REASON_LENGTH ||
              isPending
            }
            onClick={handleSubmit}
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting…
              </>
            ) : (
              "Submit dispute"
            )}
          </Button>
          <AlertDialogCancel asChild>
            <Button
              type="button"
              variant="outline"
              className="h-11 w-full rounded-xl border-accent-20"
              disabled={isPending}
            >
              Cancel
            </Button>
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
