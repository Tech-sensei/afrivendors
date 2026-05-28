"use client";

import { useEffect, useState } from "react";
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
import {
  APP_REVIEW_MAX_LENGTH,
  APP_REVIEW_MIN_LENGTH,
} from "@/lib/appReviewValidation";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialComment?: string;
  title: string;
  description: string;
  confirmLabel: string;
  isPending?: boolean;
  onConfirm: (comment: string) => void;
};

export function AppReviewDialog({
  open,
  onOpenChange,
  initialComment = "",
  title,
  description,
  confirmLabel,
  isPending = false,
  onConfirm,
}: Props) {
  const [comment, setComment] = useState(initialComment);

  useEffect(() => {
    if (open) setComment(initialComment);
  }, [open, initialComment]);

  const handleOpenChange = (next: boolean) => {
    if (!next) setComment("");
    onOpenChange(next);
  };

  const trimmed = comment.trim();
  const valid =
    trimmed.length >= APP_REVIEW_MIN_LENGTH &&
    trimmed.length <= APP_REVIEW_MAX_LENGTH;

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
          <Label htmlFor="app-review-comment" className="text-xs font-semibold text-secondary-000">
            Your review
          </Label>
          <Textarea
            id="app-review-comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share what you liked or what we could improve…"
            maxLength={APP_REVIEW_MAX_LENGTH}
            className="field-sizing-normal min-h-[140px] resize-y rounded-xl"
          />
          <p className="text-xs text-accent-80">
            {trimmed.length}/{APP_REVIEW_MIN_LENGTH} characters minimum
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
