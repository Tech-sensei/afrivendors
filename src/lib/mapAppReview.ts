import type {
  AppReview,
  AppReviewApi,
  AppReviewCarouselItem,
} from "@/types/app-review";

const FALLBACK_AVATARS = [
  "/assets/images/female04.png",
  "/assets/images/male04.png",
  "/assets/images/male05.png",
];

function itemsFromPayload(payload: unknown): unknown[] | null {
  if (!payload || typeof payload !== "object") return null;
  const record = payload as Record<string, unknown>;
  if (Array.isArray(record.items)) return record.items;
  if (Array.isArray(record.data)) return record.data;
  return null;
}

function unwrapList(body: unknown): unknown[] {
  if (Array.isArray(body)) return body;

  const topLevel = itemsFromPayload(body);
  if (topLevel) return topLevel;

  if (body && typeof body === "object" && "data" in (body as object)) {
    const nested = itemsFromPayload((body as { data: unknown }).data);
    if (nested) return nested;
  }

  return [];
}

function authorFromUser(user: AppReviewApi["user"]): string {
  if (!user) return "Afrivendors client";
  const name = [user.firstName, user.lastName].filter(Boolean).join(" ").trim();
  return name || "Afrivendors client";
}

function locationFromUser(user: AppReviewApi["user"]): string {
  if (!user) return "";
  const parts = [user.city, user.state, user.country].filter(Boolean);
  return parts.join(", ");
}

function titleFromComment(comment: string): string {
  const trimmed = comment.trim();
  if (!trimmed) return "Shared on Afrivendors";
  const firstSentence = trimmed.split(/[.!?]/)[0]?.trim() ?? trimmed;
  if (firstSentence.length <= 48) return firstSentence;
  return `${firstSentence.slice(0, 45).trim()}…`;
}

export function normalizeAppReview(raw: unknown): AppReview | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as AppReviewApi;
  if (typeof r.id !== "number" || typeof r.comment !== "string") return null;

  const userId =
    typeof r.userId === "number"
      ? r.userId
      : typeof r.user?.id === "number"
        ? r.user.id
        : null;

  return {
    id: r.id,
    comment: r.comment,
    userId,
    authorName: authorFromUser(r.user),
    location: locationFromUser(r.user),
    avatarUrl: r.user?.profilePhoto ?? null,
    createdAt: r.createdAt ?? null,
  };
}

export function mapAppReviewsList(body: unknown): AppReview[] {
  return unwrapList(body)
    .map(normalizeAppReview)
    .filter((r): r is AppReview => r != null);
}

export function appReviewToCarouselItem(
  review: AppReview,
  index: number
): AppReviewCarouselItem {
  const avatar =
    review.avatarUrl ||
    FALLBACK_AVATARS[index % FALLBACK_AVATARS.length] ||
    "/assets/images/female04.png";

  return {
    id: review.id,
    title: titleFromComment(review.comment),
    text: review.comment,
    author: review.authorName,
    location: review.location || "Afrivendors community",
    avatar,
    rating: 5,
  };
}

export function buildCarouselReviews(apiReviews: AppReview[]): AppReviewCarouselItem[] {
  if (apiReviews.length === 0) return [];
  return apiReviews.map(appReviewToCarouselItem);
}
