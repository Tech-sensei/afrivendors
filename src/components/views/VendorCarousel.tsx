"use client";
import { useRef } from "react";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { Button } from "../ui/button";
import { motion } from "motion/react";
import VendorCard from "./VendorCard";
import { useRouter } from "next/navigation";
import type { VendorListItem } from "@/types/vendor";

// ─── Skeleton ────────────────────────────────────────────────────────────────

const VendorCardSkeleton = () => (
  <div className="rounded-2xl border border-[#EFE6E1] overflow-hidden animate-pulse flex-none w-[80vw] sm:w-[300px] lg:w-[calc(25%-15px)]">
    <div className="h-56 bg-accent-20" />
    <div className="p-5 space-y-3">
      <div className="h-4 bg-accent-20 rounded w-3/4" />
      <div className="h-3 bg-accent-20 rounded w-full" />
      <div className="h-3 bg-accent-20 rounded w-1/2" />
      <div className="h-3 bg-accent-20 rounded w-2/3" />
      <div className="flex justify-between pt-3 border-t border-[#EFE6E1]">
        <div className="h-4 bg-accent-20 rounded w-1/4" />
        <div className="h-8 bg-accent-20 rounded-full w-1/3" />
      </div>
    </div>
  </div>
);

// ─── Props ────────────────────────────────────────────────────────────────────

interface VendorCarouselProps {
  title: string;
  subtitle: string;
  vendors: VendorListItem[];
  isLoading: boolean;
  bg?: string;
}

// ─── Component ────────────────────────────────────────────────────────────────

const VendorCarousel = ({ title, subtitle, vendors, isLoading, bg = "bg-[#F7F4F2]" }: VendorCarouselProps) => {
  const router = useRouter();
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    // scroll by ~1 card width + gap
    scrollRef.current.scrollBy({
      left: dir === "left" ? -324 : 324,
      behavior: "smooth",
    });
  };

  const items = isLoading ? Array.from({ length: 4 }) : vendors;

  return (
    <section className={`py-12 sm:py-16 md:py-20 lg:py-24 ${bg} overflow-hidden`}>
      <div className="max-w-[1440px] mx-auto px-6 sm:px-8 lg:px-24">
        {/* Header */}
        <div className="mb-8 flex items-end justify-between">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold font-unbounded text-secondary-000 leading-[125%] mb-2">
              {title}
            </h2>
            <p className="text-accent-80 text-base tracking-[-0.16px]">{subtitle}</p>
          </motion.div>

          {/* Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => scroll("left")}
              aria-label="Scroll left"
              className="hidden sm:flex w-10 h-10 rounded-full border border-accent-20 bg-white items-center justify-center text-secondary-000 transition-all duration-200 hover:bg-secondary-000 hover:text-white hover:border-secondary-000 cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scroll("right")}
              aria-label="Scroll right"
              className="hidden sm:flex w-10 h-10 rounded-full border border-accent-20 bg-white items-center justify-center text-secondary-000 transition-all duration-200 hover:bg-secondary-000 hover:text-white hover:border-secondary-000 cursor-pointer"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
            <Button
              variant="ghost"
              className="text-sm font-semibold text-primary-100"
              onClick={() => router.push("/categories")}
            >
              View All
              <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Carousel — contained within the section padding */}
        <div
          ref={scrollRef}
          className="flex gap-5 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-2
            [&::-webkit-scrollbar]:hidden [scrollbar-width:none] [-ms-overflow-style:none]"
        >
          {items.map((vendor, index) =>
            isLoading ? (
              <VendorCardSkeleton key={index} />
            ) : (
              <div
                key={(vendor as VendorListItem).id}
                className="snap-start flex-none w-[80vw] sm:w-[300px] lg:w-[calc(25%-15px)] h-full"
              >
                <VendorCard
                  vendor={vendor as VendorListItem}
                  index={index}
                  onClick={() => router.push(`/categories/${(vendor as VendorListItem).id}`)}
                />
              </div>
            )
          )}
        </div>
      </div>
    </section>
  );
};

export default VendorCarousel;
