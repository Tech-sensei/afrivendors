import { useState } from 'react';
import { Star, X } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Label } from '../ui/label';
import type { ReviewFormProps } from '@/types/reviews';

export function ReviewForm({ vendorId, existingReview, onSave, onCancel }: ReviewFormProps) {
  const [rating, setRating] = useState(existingReview?.rating || 0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState(existingReview?.comment || '');
  const [author, setAuthor] = useState(existingReview?.author || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate save delay
    await new Promise(resolve => setTimeout(resolve, 500));

    onSave({ rating, comment, author });
    setIsSubmitting(false);

    // Reset form if it's a new review
    if (!existingReview) {
      setRating(0);
      setComment('');
      setAuthor('');
    }
  };

  return (
    <div>
      <Card className="rounded-2xl border border-accent-20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="font-unbounded text-xl font-semibold text-secondary-000">
              {existingReview ? 'Edit Your Review' : 'Write a Review'}
            </CardTitle>
            {onCancel && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onCancel}
                className="h-8 w-8 hover:bg-accent-10"
              >
                <X className="h-4 w-4 text-secondary-000" />
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Input */}
            {!existingReview && (
              <div className="space-y-2">
                <Label htmlFor="author" className="font-unageo text-sm font-medium text-secondary-000">
                  Your Name *
                </Label>
                <input
                  id="author"
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="Enter your name"
                  required
                  className="w-full h-10 px-4 rounded-lg border border-accent-20 bg-white text-secondary-000 placeholder:text-accent-60 focus:outline-none focus:ring-2 focus:ring-primary-100/20 focus:border-primary-100 transition-all font-unageo text-sm"
                />
              </div>
            )}

            {/* Star Rating */}
            <div className="space-y-2">
              <Label className="font-unageo text-sm font-medium text-secondary-000">
                Rating *
              </Label>
              <div className="flex gap-2">
                {Array.from({ length: 5 }).map((_, index) => {
                  const starValue = index + 1;
                  return (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setRating(starValue)}
                      onMouseEnter={() => setHoverRating(starValue)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary-100/20 focus:ring-offset-2 rounded"
                    >
                      <Star
                        className={`h-8 w-8 transition-colors ${starValue <= (hoverRating || rating)
                          ? 'fill-primary-100 text-primary-100'
                          : 'fill-accent-20 text-accent-20'
                          }`}
                      />
                    </button>
                  );
                })}
              </div>
              {rating > 0 && (
                <p className="font-unageo text-sm text-accent-80">
                  {rating === 1 && 'Poor'}
                  {rating === 2 && 'Fair'}
                  {rating === 3 && 'Good'}
                  {rating === 4 && 'Very Good'}
                  {rating === 5 && 'Excellent'}
                </p>
              )}
            </div>

            {/* Review Comment */}
            <div className="space-y-2">
              <Label htmlFor="comment" className="font-unageo text-sm font-medium text-secondary-000">
                Your Review *
              </Label>
              <textarea
                id="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your experience with this vendor..."
                required
                rows={5}
                className="w-full px-4 py-3 rounded-lg border border-accent-20 bg-white text-secondary-000 placeholder:text-accent-60 focus:outline-none focus:ring-2 focus:ring-primary-100/20 focus:border-primary-100 transition-all font-unageo text-sm resize-none"
              />
              <p className="font-unageo text-xs text-accent-80">
                {comment.length} characters
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                type="submit"
                disabled={!rating || !comment.trim() || (!existingReview && !author.trim()) || isSubmitting}
                className="flex-1 bg-primary-100 text-white hover:bg-primary-100/90 disabled:bg-accent-30 disabled:text-accent-60 rounded-[18px] h-11 font-unageo text-sm font-semibold"
              >
                {isSubmitting ? 'Saving...' : existingReview ? 'Update Review' : 'Submit Review'}
              </Button>
              {onCancel && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={onCancel}
                  className="rounded-[18px] h-11 border-accent-20 text-secondary-000 hover:bg-accent-10 font-unageo text-sm font-semibold"
                >
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
