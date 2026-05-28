"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronRight, ChevronLeft, Star } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";
import { STATIC_APP_REVIEWS } from "@/data/staticAppReviews";
import { buildCarouselReviews } from "@/lib/mapAppReview";
import { useAppReviews } from "@/services/useAppReviews";
import type { AppReviewCarouselItem } from "@/types/app-review";
import { AppReviewCta } from "@/components/views/AppReviewCta";

const StarRating = ({ rating }: { rating: number }) => {
  return (
    <div className="flex gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={16}
          className={i < rating ? "fill-primary-100 text-[#1D0D04]" : "text-gray-300"}
        />
      ))}
    </div>
  );
};

export default function Reviews() {
  const [current, setCurrent] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const { data: apiReviews } = useAppReviews();

  const reviews: AppReviewCarouselItem[] = useMemo(() => {
    const fromApi = buildCarouselReviews(apiReviews ?? []);
    if (fromApi.length > 0) return fromApi;
    return STATIC_APP_REVIEWS;
  }, [apiReviews]);

  useEffect(() => {
    setCurrent(0);
  }, [reviews.length]);

  useEffect(() => {
    if (isHovered || reviews.length === 0) return;

    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % reviews.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isHovered, reviews.length]);

  const next = () => {
    setCurrent((prev) => (prev + 1) % reviews.length);
  };

  const prev = () => {
    setCurrent((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  const visibleReviews = [
    reviews[current],
    reviews[(current + 1) % reviews.length],
    reviews[(current + 2) % reviews.length],
  ].filter(Boolean);

  return (
    <section className="py-12 sm:py-16 md:py-20 lg:py-24 px-6 sm:px-8 lg:px-24 bg-white">
      <div className="max-w-[1440px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold font-unbounded text-secondary-000 leading-[125%] mb-2">
            Reviews
          </h2>
          <p className="text-accent-80 text-base tracking-[-0.16px]">
            What are clients saying?
          </p>
        </motion.div>

        <AppReviewCta />

        <div
          className="relative"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="flex gap-6 overflow-hidden">
            <AnimatePresence>
              {visibleReviews.map((review, idx) => (
                <motion.div
                    key={`${review.id}-${current}-${idx}`}
                    initial={{ opacity: 1, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="shrink-0 w-full sm:w-1/2 lg:w-1/3"
                  >
                    <div className="bg-[#F7F4F2] rounded-lg p-6 h-full flex flex-col justify-between">
                      <div className="mb-4">
                        <StarRating rating={review.rating} />
                      </div>

                      <p className="text-secondary-300 italic text-base leading-relaxed mb-6 grow">
                        &ldquo;{review.text}&rdquo;
                      </p>

                      <div className="flex items-center gap-3">
                        <Image
                          src={review.avatar || "/placeholder.svg"}
                          alt={review.author}
                          width={48}
                          height={48}
                          className="rounded-full object-cover"
                        />
                        <div>
                          <p className="font-medium text-secondary-000 text-base tracking-[-0.16px]">
                            {review.author}
                          </p>
                          <p className="text-base text-accent-60 tracking-[-0.16px]">
                            {review.location}
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {reviews.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={prev}
                  className="absolute left-14 md:left-1 top-1/2 -translate-y-1/2 -translate-x-16 p-2 hover:bg-gray-200 rounded-full transition-colors inline-flex items-center justify-center gap-2 border border-[#1D0D04] cursor-pointer"
                  aria-label="Previous review"
                >
                  <ChevronLeft size={24} className="text-secondary-000" />
                </button>

                <button
                  type="button"
                  onClick={next}
                  className="absolute right-14 md:right-1 top-1/2 -translate-y-1/2 translate-x-16 p-2 hover:bg-gray-200 rounded-full transition-colors inline-flex items-center justify-center gap-2 border border-[#1D0D04] cursor-pointer"
                  aria-label="Next review"
                >
                  <ChevronRight size={24} className="text-secondary-000" />
                </button>
              </>
            )}
          </div>

        {reviews.length > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            {reviews.map((_, idx) => (
              <button
                type="button"
                key={idx}
                onClick={() => setCurrent(idx)}
                className={`w-2 h-2 rounded-full transition-all ${
                  idx === current ? "bg-primary-100 w-6" : "bg-gray-300 hover:bg-gray-400"
                }`}
                aria-label={`Go to review ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
