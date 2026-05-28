"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Edit2, Loader2, MessageSquarePlus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useAppSelector } from "@/store/hooks";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { AppReviewDialog } from "@/components/views/AppReviewDialog";
import {
  useAppReviews,
  useCreateAppReview,
  useDeleteAppReview,
  useUpdateAppReview,
} from "@/services/useAppReviews";
import type { AppReview } from "@/types/app-review";

function findMyReview(reviews: AppReview[], userId?: number): AppReview | null {
  if (userId == null) return null;
  return reviews.find((r) => r.userId === userId) ?? null;
}

export function AppReviewCta() {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const { data: reviews = [] } = useAppReviews();
  const createReview = useCreateAppReview();
  const updateReview = useUpdateAppReview();
  const deleteReview = useDeleteAppReview();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const myReview = useMemo(
    () => findMyReview(reviews, user?.id),
    [reviews, user?.id]
  );

  if (!isAuthenticated) {
    return (
      <div className="mb-8 rounded-2xl border border-accent-20 bg-[#F7F4F2] px-6 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="font-unageo text-sm font-semibold text-secondary-000">
            Used Afrivendors?
          </p>
          <p className="font-unageo text-sm text-accent-80 mt-1">
            Sign in to share your experience with the community.
          </p>
        </div>
        <Button
          asChild
          className="rounded-xl bg-primary-100 text-white hover:bg-[#a65620] shrink-0"
        >
          <Link href="/sign-in">Sign in to review</Link>
        </Button>
      </div>
    );
  }

  const handleSubmit = (comment: string) => {
    if (myReview) {
      updateReview.mutate(
        { id: myReview.id, payload: { comment } },
        {
          onSuccess: () => {
            toast.success("Review updated.");
            setDialogOpen(false);
          },
          onError: (e: unknown) => {
            toast.error(
              (e as { response?: { data?: { message?: string } } })?.response?.data
                ?.message ?? "Could not update review."
            );
          },
        }
      );
      return;
    }

    createReview.mutate(
      { comment },
      {
        onSuccess: () => {
          toast.success("Thank you for your review!");
          setDialogOpen(false);
        },
        onError: (e: unknown) => {
          toast.error(
            (e as { response?: { data?: { message?: string } } })?.response?.data
              ?.message ?? "Could not submit review."
          );
        },
      }
    );
  };

  const handleDelete = () => {
    if (!myReview) return;
    deleteReview.mutate(myReview.id, {
      onSuccess: () => {
        toast.success("Review removed.");
        setDeleteOpen(false);
      },
      onError: () => {
        toast.error("Could not delete review.");
      },
    });
  };

  const isPending =
    createReview.isPending || updateReview.isPending || deleteReview.isPending;

  return (
    <>
      <div className="mb-8 rounded-2xl border border-accent-20 bg-[#F7F4F2] px-6 py-5">
        {myReview ? (
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0 flex-1">
              <p className="font-unageo text-xs font-bold uppercase tracking-widest text-accent-60 mb-2">
                Your review
              </p>
              <p className="font-unageo text-sm text-secondary-000 leading-relaxed line-clamp-4">
                {myReview.comment}
              </p>
            </div>
            <div className="flex shrink-0 gap-2">
              <Button
                type="button"
                variant="outline"
                className="rounded-xl border-accent-20 font-unageo text-sm font-semibold"
                onClick={() => setDialogOpen(true)}
                disabled={isPending}
              >
                <Edit2 className="mr-2 h-4 w-4" />
                Edit
              </Button>
              <Button
                type="button"
                variant="outline"
                className="rounded-xl border-red-200 font-unageo text-sm font-semibold text-red-700 hover:bg-red-50"
                onClick={() => setDeleteOpen(true)}
                disabled={isPending}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="font-unageo text-sm font-semibold text-secondary-000">
                Share your Afrivendors experience
              </p>
              <p className="font-unageo text-sm text-accent-80 mt-1">
                Help others discover trusted vendors across Africa and the diaspora.
              </p>
            </div>
            <Button
              type="button"
              className="rounded-xl bg-primary-100 text-white hover:bg-[#a65620] shrink-0"
              onClick={() => setDialogOpen(true)}
            >
              <MessageSquarePlus className="mr-2 h-4 w-4" />
              Write a review
            </Button>
          </div>
        )}
      </div>

      <AppReviewDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        initialComment={myReview?.comment ?? ""}
        title={myReview ? "Edit your review" : "Review Afrivendors"}
        description="Tell us about your experience using Afrivendors. Your review may appear on our homepage."
        confirmLabel={myReview ? "Save changes" : "Submit review"}
        isPending={createReview.isPending || updateReview.isPending}
        onConfirm={handleSubmit}
      />

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent className="rounded-2xl border-accent-20">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-unbounded text-lg font-semibold text-secondary-000">
              Delete your review?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-accent-80">
              This removes your review from the public list. You can write a new one
              later.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel asChild>
              <Button type="button" variant="outline" className="rounded-xl">
                Cancel
              </Button>
            </AlertDialogCancel>
            <Button
              type="button"
              className="rounded-xl bg-red-600 hover:bg-red-700"
              disabled={deleteReview.isPending}
              onClick={handleDelete}
            >
              {deleteReview.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Delete"
              )}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
