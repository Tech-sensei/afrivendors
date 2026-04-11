export interface StoredReview {
  id: string;
  vendorId: number;
  author: string;
  rating: number;
  comment: string;
  date: string;
  avatar: string;
}

export interface ReviewFormExistingReview {
  id: string;
  rating: number;
  comment: string;
  author: string;
}

export interface ReviewFormSavePayload {
  rating: number;
  comment: string;
}

export interface ReviewFormProps {
  vendorId: number;
  existingReview?: ReviewFormExistingReview;
  /** Shown as "Posting as …" — from profile, not sent to API. */
  posterDisplayName?: string;
  onSave: (review: ReviewFormSavePayload) => void | Promise<void>;
  onCancel?: () => void;
  isSubmitting?: boolean;
}

export interface ReviewListItem {
  id: string;
  author: string;
  rating: number;
  date: string;
  comment: string;
  avatar: string;
  isUserReview?: boolean;
}

export interface ReviewsListProps {
  reviews: ReviewListItem[];
  /** Omit when edit/delete are not supported by the API yet. */
  onEdit?: (review: ReviewListItem) => void;
  onDelete?: (reviewId: string) => void;
}
