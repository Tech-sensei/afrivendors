"use client";

import { Loader2 } from "lucide-react";
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

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isPending?: boolean;
  onConfirm: () => void;
};

export function EscalateDisputeDialog({
  open,
  onOpenChange,
  isPending = false,
  onConfirm,
}: Props) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md rounded-2xl border-accent-20">
        <AlertDialogHeader>
          <AlertDialogTitle className="font-unbounded text-xl font-semibold text-secondary-000">
            Escalate to Afrivendors
          </AlertDialogTitle>
          <AlertDialogDescription className="text-left text-sm leading-relaxed text-accent-80">
            If you could not resolve this with the vendor, our team will review the
            dispute and decide. A dispute can only be escalated once.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="flex-col gap-2 sm:flex-col">
          <Button
            type="button"
            className="h-11 w-full rounded-xl bg-primary-100 text-white hover:bg-[#a65620]"
            disabled={isPending}
            onClick={onConfirm}
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting…
              </>
            ) : (
              "Submit escalation"
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
