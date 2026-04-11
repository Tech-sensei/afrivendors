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

type CloseProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
};

type DeleteProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
};

export function CloseServiceFormDialog({
  open,
  onOpenChange,
  onConfirm,
}: CloseProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="rounded-2xl border-accent-20">
        <AlertDialogHeader>
          <AlertDialogTitle className="font-unbounded text-xl font-semibold text-secondary-000">
            Close Custom Service Form?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-sm text-accent-80">
            This will mark the form as closed. The vendor will be notified and
            you won&apos;t receive any further quotes.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel asChild>
            <Button
              type="button"
              variant="outline"
              className="rounded-[18px] border-accent-20"
            >
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
              Close Request
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export function DeleteServiceFormDialog({
  open,
  onOpenChange,
  onConfirm,
}: DeleteProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="rounded-2xl border-accent-20">
        <AlertDialogHeader>
          <AlertDialogTitle className="font-unbounded text-xl font-semibold text-secondary-000">
            Delete Custom Service Form?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-sm text-accent-80">
            This action cannot be undone. The form and all associated data will
            be permanently deleted.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel asChild>
            <Button
              type="button"
              variant="outline"
              className="rounded-[18px] border-accent-20"
            >
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
