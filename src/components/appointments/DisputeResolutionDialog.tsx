"use client";

import { useState } from "react";
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DISPUTE_RESOLUTION_MIN_LENGTH } from "@/lib/disputeResolution";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmLabel: string;
  isPending?: boolean;
  onConfirm: (resolution: string) => void;
};

export function DisputeResolutionDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel,
  isPending = false,
  onConfirm,
}: Props) {
  const [resolution, setResolution] = useState("");

  const reset = () => setResolution("");

  const handleOpenChange = (next: boolean) => {
    if (!next) reset();
    onOpenChange(next);
  };

  const trimmed = resolution.trim();
  const valid = trimmed.length >= DISPUTE_RESOLUTION_MIN_LENGTH;

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogContent className="max-w-md rounded-2xl border-accent-20">
        <AlertDialogHeader>
          <AlertDialogTitle className="font-unbounded text-xl font-semibold text-secondary-000">
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-left text-sm leading-relaxed text-accent-80">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-2 py-2">
          <Label htmlFor="dispute-resolution" className="text-xs font-semibold text-secondary-000">
            Resolution note
          </Label>
          <Textarea
            id="dispute-resolution"
            value={resolution}
            onChange={(e) => setResolution(e.target.value)}
            placeholder="Describe what you agreed (minimum 20 characters)…"
            className="field-sizing-normal min-h-[120px] resize-y rounded-xl"
          />
          <p className="text-xs text-accent-80">
            {trimmed.length}/{DISPUTE_RESOLUTION_MIN_LENGTH} characters minimum
          </p>
        </div>

        <AlertDialogFooter className="flex-col gap-2 sm:flex-col">
          <Button
            type="button"
            className="h-11 w-full rounded-xl bg-primary-100 text-white hover:bg-[#a65620]"
            disabled={!valid || isPending}
            onClick={() => {
              if (!valid) return;
              onConfirm(trimmed);
            }}
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting…
              </>
            ) : (
              confirmLabel
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
