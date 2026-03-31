import type { StoredReview as Review } from "@/types/reviews";

const STORAGE_KEY = 'afrivendor_reviews';

// Get all reviews from localStorage
export function getAllReviews(): Review[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error reading reviews from localStorage:', error);
    return [];
  }
}

// Get reviews for a specific vendor
export function getVendorReviews(vendorId: number): Review[] {
  const allReviews = getAllReviews();
  return allReviews.filter(review => review.vendorId === vendorId);
}

// Get user's review for a specific vendor
export function getUserReview(vendorId: number): Review | null {
  const reviews = getVendorReviews(vendorId);
  // For simplicity, we'll identify user reviews by checking localStorage
  // In a real app, you'd match against authenticated user ID
  const userReviewId = localStorage.getItem(`user_review_${vendorId}`);
  if (!userReviewId) return null;
  
  return reviews.find(review => review.id === userReviewId) || null;
}

// Save a new review
export function saveReview(
  vendorId: number,
  author: string,
  rating: number,
  comment: string
): Review {
  const allReviews = getAllReviews();
  
  const newReview: Review = {
    id: `review_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    vendorId,
    author,
    rating,
    comment,
    date: new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }),
    avatar: author
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2),
  };
  
  allReviews.push(newReview);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(allReviews));
  
  // Mark this as the user's review for this vendor
  localStorage.setItem(`user_review_${vendorId}`, newReview.id);
  
  return newReview;
}

// Update an existing review
export function updateReview(
  reviewId: string,
  rating: number,
  comment: string
): Review | null {
  const allReviews = getAllReviews();
  const reviewIndex = allReviews.findIndex(review => review.id === reviewId);
  
  if (reviewIndex === -1) return null;
  
  allReviews[reviewIndex] = {
    ...allReviews[reviewIndex],
    rating,
    comment,
    date: new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }),
  };
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(allReviews));
  
  return allReviews[reviewIndex];
}

// Delete a review
export function deleteReview(reviewId: string): boolean {
  const allReviews = getAllReviews();
  const review = allReviews.find(r => r.id === reviewId);
  
  if (!review) return false;
  
  const filteredReviews = allReviews.filter(review => review.id !== reviewId);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredReviews));
  
  // Remove user review marker
  localStorage.removeItem(`user_review_${review.vendorId}`);
  
  return true;
}

// Calculate average rating for a vendor
export function getVendorAverageRating(vendorId: number): { average: number; count: number } {
  const reviews = getVendorReviews(vendorId);
  
  if (reviews.length === 0) {
    return { average: 0, count: 0 };
  }
  
  const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
  const average = sum / reviews.length;
  
  return {
    average: Math.round(average * 10) / 10,
    count: reviews.length,
  };
}
