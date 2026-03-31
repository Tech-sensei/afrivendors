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
  author: string;
}

export interface ReviewFormProps {
  vendorId: number;
  existingReview?: ReviewFormExistingReview;
  onSave: (review: ReviewFormSavePayload) => void;
  onCancel?: () => void;
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
  onEdit: (review: ReviewListItem) => void;
  onDelete: (reviewId: string) => void;
}
