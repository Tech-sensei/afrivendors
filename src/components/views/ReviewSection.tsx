"use client";

import { useState, useEffect } from "react";
import { ChevronRight, ChevronLeft, Star } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const reviews = [
  {
    id: 1,
    title: "A Stress-Free Experience!",
    text: '"Afrivendor made it so easy to find reliable vendors for my online business. I didn\'t have to worry about stress communication and payment were seamless. I felt good supporting local African talent in such a professional space"',
    author: "Amara Eze",
    location: "Lagos, Nigeria",
    avatar: "/assets/images/female04.png",
    rating: 5,
  },
  {
    id: 2,
    title: "Trust and Convenience in One App",
    text: '"I love how the app connects me with trusted vendors without the fear of being scammed. The secure payment and review system make the whole experience smooth and reliable"',
    author: "Zainele Dlamini",
    location: "Johannesburg, South Africa",
    avatar: "/assets/images/male04.png",
    rating: 5,
  },
  {
    id: 3,
    title: "Bridging the Gap for the Diaspora",
    text: '"Finally, a platform that connects Africans in the diaspora back home. I ordered custom fashion pieces from Nigeria through Afrivendor and got exactly what I envisioned"',
    author: "Chinedu Okoro",
    location: "London, UK",
    avatar: "/assets/images/male05.png",
    rating: 5,
  },
  {
    id: 4,
    title: "Reliable Vendor Network",
    text: '"The verification process gives me confidence in the vendors. Every transaction has been smooth and professional. Highly recommend for anyone looking for quality African products"',
    author: "Nia Johnson",
    location: "Atlanta, USA",
    avatar: "/assets/images/female04.png",
    rating: 5,
  },
];

const StarRating = ({ rating }: { rating: number }) => {
  return (
    <div className="flex gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} size={16} className={i < rating ? "fill-[#E1B62C91] text-[#1D0D04]" : "text-gray-300"} />
      ))}
    </div>
  );
};

export default function Reviews() {
  const [current, setCurrent] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (isHovered) return;

    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % reviews.length);
    }, 5000); // 5 seconds

    return () => clearInterval(interval);
  }, [isHovered]);

  const next = () => {
    setCurrent((prev) => (prev + 1) % reviews.length);
  };

  const prev = () => {
    setCurrent((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  const visibleReviews = [reviews[current], reviews[(current + 1) % reviews.length], reviews[(current + 2) % reviews.length]];

  return (
    <section className="w-full bg-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <h2 className="text-2xl md:text-3xl lg:text-[40px] font-semibold font-unbounded text-secondary-000 leading-[125%] mb-2">
            Reviews
          </h2>
          <p className="text-accent-60 text-base tracking-[-0.16px]">What are clients saying?</p>
        </motion.div>

        {/* Reviews Carousel */}
        <div className="relative" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
          <div className="flex gap-6 overflow-hidden">
            <AnimatePresence mode="wait">
              {visibleReviews.map((review, idx) => (
                <motion.div
                  key={`${current}-${idx}`}
                  initial={{ opacity: 1, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  // exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.5 }}
                  className="shrink-0 w-full sm:w-1/2 lg:w-1/3"
                >
                  <div className="bg-[#F7F4F2] rounded-lg p-6 h-full flex flex-col justify-between">
                    {/* Stars */}
                    <div className="mb-4">
                      <StarRating rating={review.rating} />
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-semibold text-secondary-000 leading-[ 160%] tracking-[-0.22px] mb-3">{review.title}</h3>

                    {/* Review Text */}
                    <p className="text-accent-60 italic text-base leading-relaxed mb-6 grow">{review.text}</p>

                    {/* Author Info */}
                    <div className="flex items-center gap-3">
                      <Image
                        src={review.avatar || "/placeholder.svg"}
                        alt={review.author}
                        width={48}
                        height={48}
                        className="rounded-full object-cover"
                      />
                      <div>
                        <p className="font-medium text-secondary-000 text-base tracking-[-0.16px]">{review.author}</p>
                        <p className="text-base text-accent-60 tracking-[-0.16px]">{review.location}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Navigation Buttons */}
          <button
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
        </div>

        {/* Pagination Dots */}
        <div className="flex justify-center gap-2 mt-8">
          {reviews.map((_, idx) => (
            <button
              type="button"
              key={idx}
              onClick={() => setCurrent(idx)}
              className={`w-2 h-2 rounded-full transition-all ${idx === current ? "bg-primary-100 w-6" : "bg-gray-300 hover:bg-gray-400"}`}
              aria-label={`Go to review ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
