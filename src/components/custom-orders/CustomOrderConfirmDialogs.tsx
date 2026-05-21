"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { formatVendorPrice } from "@/services/vendor";

export function CancelCustomOrderDialog({
  open,
  onOpenChange,
  onConfirm,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="rounded-2xl border-accent-20">
        <AlertDialogHeader>
          <AlertDialogTitle className="font-unbounded text-xl font-semibold text-secondary-000">
            Cancel custom order?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-sm text-accent-80">
            Vendors will no longer be able to quote on this request. This cannot
            be undone if you have already paid.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel asChild>
            <Button type="button" variant="outline" className="rounded-[18px]">
              Keep order
            </Button>
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button
              type="button"
              variant="destructive"
              className="rounded-[18px]"
              onClick={onConfirm}
            >
              Cancel order
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export function DeleteCustomOrderDialog({
  open,
  onOpenChange,
  onConfirm,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="rounded-2xl border-accent-20">
        <AlertDialogHeader>
          <AlertDialogTitle className="font-unbounded text-xl font-semibold text-secondary-000">
            Delete custom order?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-sm text-accent-80">
            This removes the order from your list. Demo data only — no server
            record is affected.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel asChild>
            <Button type="button" variant="outline" className="rounded-[18px]">
              Cancel
            </Button>
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button
              type="button"
              variant="destructive"
              className="rounded-[18px]"
              onClick={onConfirm}
            >
              Delete
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export function PayCustomOrderDialog({
  open,
  onOpenChange,
  amount,
  vendorName,
  onConfirm,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  amount: number;
  vendorName: string;
  onConfirm: () => void;
}) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="rounded-2xl border-accent-20">
        <AlertDialogHeader>
          <AlertDialogTitle className="font-unbounded text-xl font-semibold text-secondary-000">
            Confirm payment
          </AlertDialogTitle>
          <AlertDialogDescription className="text-sm text-accent-80">
            Pay {formatVendorPrice(amount)} to {vendorName}. Funds are held in
            escrow until you release them after the service is complete. (Demo —
            no real charge.)
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel asChild>
            <Button type="button" variant="outline" className="rounded-[18px]">
              Cancel
            </Button>
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button
              type="button"
              className="rounded-[18px] bg-primary-100 text-white hover:bg-primary-100/90"
              onClick={onConfirm}
            >
              Pay {formatVendorPrice(amount)}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
