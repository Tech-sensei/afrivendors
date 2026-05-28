"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChevronLeft, X, ZoomIn } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
  imageSrc: string;
  alt: string;
  backHref?: string;
  backLabel?: string;
};

export function VendorProfileBanner({
  imageSrc,
  alt,
  backHref = "/categories",
  backLabel = "Back to Browse",
}: Props) {
  const router = useRouter();
  const [lightboxOpen, setLightboxOpen] = useState(false);

  useEffect(() => {
    if (!lightboxOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [lightboxOpen]);

  return (
    <>
      <div className="mx-auto w-full max-w-[1440px] px-4 pb-2 md:px-6 lg:px-24">
        <Button
          variant="ghost"
          onClick={() => router.push(backHref)}
          className="-ml-2 gap-2 text-sm font-semibold text-secondary-000 hover:bg-accent-10"
        >
          <ChevronLeft className="h-4 w-4" />
          {backLabel}
        </Button>

        <button
          type="button"
          onClick={() => setLightboxOpen(true)}
          className="group relative mt-3 block w-full cursor-zoom-in overflow-hidden rounded-2xl bg-accent-10 shadow-[0_8px_32px_rgba(35,19,5,0.08)] ring-1 ring-accent-20/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-100 focus-visible:ring-offset-2 lg:mt-4 lg:rounded-3xl"
          aria-label={`View ${alt} banner full size`}
        >
          <div className="relative aspect-[16/7] w-full min-h-[200px] max-h-[min(52vh,440px)] sm:min-h-[240px] lg:aspect-[21/8] lg:min-h-[280px]">
            <Image
              src={imageSrc}
              alt={alt}
              fill
              priority
              sizes="(max-width: 1440px) 100vw, 1440px"
              className="object-cover object-[center_42%] transition-transform duration-700 ease-out group-hover:scale-[1.02]"
            />
            <div
              className="pointer-events-none absolute inset-0 bg-gradient-to-t from-secondary-000/45 via-secondary-000/5 to-transparent"
              aria-hidden
            />
            <div
              className="pointer-events-none absolute inset-0 bg-gradient-to-r from-secondary-000/15 via-transparent to-transparent"
              aria-hidden
            />
          </div>

          <span className="absolute bottom-4 right-4 flex items-center gap-1.5 rounded-full border border-white/25 bg-secondary-000/55 px-3 py-1.5 text-xs font-medium text-white opacity-0 backdrop-blur-md transition-opacity duration-200 group-hover:opacity-100 sm:opacity-100">
            <ZoomIn className="h-3.5 w-3.5" aria-hidden />
            View full image
          </span>
        </button>
      </div>

      {lightboxOpen && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-secondary-000/90 p-4 backdrop-blur-sm sm:p-8"
          role="dialog"
          aria-modal="true"
          aria-label="Banner preview"
          onClick={() => setLightboxOpen(false)}
        >
          <button
            type="button"
            onClick={() => setLightboxOpen(false)}
            className="absolute top-4 right-4 z-10 rounded-xl bg-white/10 p-2.5 text-white transition-colors hover:bg-white/20"
            aria-label="Close preview"
          >
            <X className="h-6 w-6" />
          </button>
          <div
            className="relative max-h-[85vh] w-full max-w-5xl overflow-hidden rounded-2xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageSrc}
              alt={alt}
              className="max-h-[85vh] w-full object-contain"
            />
          </div>
        </div>
      )}
    </>
  );
}
