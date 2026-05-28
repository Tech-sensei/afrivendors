export type AppReviewUserApi = {
  id: number;
  firstName?: string;
  lastName?: string;
  email?: string;
  accountType?: string;
  city?: string;
  state?: string;
  country?: string;
  profilePhoto?: string | null;
};

export type AppReviewApi = {
  id: number;
  comment: string;
  userId?: number;
  createdAt?: string;
  updatedAt?: string;
  user?: AppReviewUserApi;
};

/** GET /app-review paginated list */
export type AppReviewsListApiResponse = {
  items: AppReviewApi[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type AppReview = {
  id: number;
  comment: string;
  userId: number | null;
  authorName: string;
  location: string;
  avatarUrl: string | null;
  createdAt: string | null;
};

/** Card shape for the homepage carousel. */
export type AppReviewCarouselItem = {
  id: string | number;
  title: string;
  text: string;
  author: string;
  location: string;
  avatar: string;
  rating: number;
};

export type CreateAppReviewPayload = {
  comment: string;
};
