import { useState } from 'react';
import { Star, Edit2, Trash2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../ui/alert-dialog';
import type { ReviewListItem as Review, ReviewsListProps } from '@/types/reviews';

export function ReviewsList({ reviews, onEdit, onDelete }: ReviewsListProps) {
  const [deleteReviewId, setDeleteReviewId] = useState<string | null>(null);

  const handleDelete = () => {
    if (deleteReviewId) {
      onDelete(deleteReviewId);
      setDeleteReviewId(null);
    }
  };

  if (reviews.length === 0) {
    return (
      <Card className="rounded-2xl border border-accent-20">
        <CardContent className="p-12 text-center">
          <div className="mb-4">
            <Star className="h-12 w-12 mx-auto text-accent-80" />
          </div>
          <h4 className="mb-2 font-unageo text-lg font-semibold text-secondary-000">
            No Reviews Yet
          </h4>
          <p className="font-unageo text-sm text-accent-80">
            Be the first to share your experience with this vendor!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {reviews.map((review, index) => (
          <div
            key={review.id}
            className="animate-in fade-in slide-in-from-bottom-4 duration-300"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <Card
              className={`rounded-2xl border ${review.isUserReview
                ? 'border-primary-100/30 bg-primary-100/5'
                : 'border-accent-20 bg-white'
                }`}
            >
              <CardContent className="p-6 py-0">
                <div className="flex items-start gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback
                      className={
                        review.isUserReview
                          ? 'bg-primary-100 text-white font-unbounded font-bold'
                          : 'bg-accent-20 text-accent-80 font-unbounded font-semibold'
                      }
                    >
                      {review.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-unageo text-base font-semibold text-secondary-000">
                            {review.author}
                          </h4>
                          {review.isUserReview && (
                            <span className="px-2 py-0.5 rounded-lg bg-primary-100/10 text-primary-100 font-unageo text-xs font-semibold">
                              You
                            </span>
                          )}
                        </div>
                        <span className="font-unageo text-sm text-accent-80">
                          {review.date}
                        </span>
                      </div>
                      {review.isUserReview && (
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 hover:bg-accent-10"
                            onClick={() => onEdit(review)}
                          >
                            <Edit2 className="h-4 w-4 text-secondary-000" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => setDeleteReviewId(review.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${i < review.rating
                            ? 'fill-primary-100 text-primary-100'
                            : 'fill-accent-20 text-accent-20'
                            }`}
                        />
                      ))}
                    </div>
                    <p className="font-unageo text-base text-secondary-000 leading-relaxed">
                      {review.comment}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteReviewId} onOpenChange={(open) => !open && setDeleteReviewId(null)}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-unbounded text-xl font-semibold text-secondary-000">
              Delete Review
            </AlertDialogTitle>
            <AlertDialogDescription className="font-unageo text-sm text-accent-80">
              Are you sure you want to delete your review? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="font-unageo text-sm font-semibold rounded-lg border-accent-20 hover:bg-accent-10">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 text-white hover:bg-red-700 font-unageo text-sm font-semibold rounded-lg"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
