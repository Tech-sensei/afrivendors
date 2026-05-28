"use client";

import { useMemo } from "react";
import { ChevronRight, Loader2 } from "lucide-react";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { usePublicCategories } from "@/services/usePublicCategories";
import { getCategoryIconComponent } from "@/lib/categoryIcons";
import type { PublicCategory } from "@/types/category";

const INITIAL_VISIBLE = 8;

function CategoryCard({
  category,
  index,
  onNavigate,
}: {
  category: PublicCategory;
  index: number;
  onNavigate: (c: PublicCategory) => void;
}) {
  const Icon = getCategoryIconComponent(category.iconName);
  const count = category.vendorCount ?? 0;

  return (
    <motion.div
      key={category.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.04, 0.4), ease: "easeOut" }}
    >
      <Card
        className="cursor-pointer py-0 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl rounded-3xl border-2 border-[#EFE6E1] shadow-[0_2px_8px_rgba(35,19,5,0.06)]"
        onClick={() => onNavigate(category)}
      >
        <CardContent className="flex flex-col items-center gap-3 p-4 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[rgba(188,109,57,0.1)]">
            <Icon className="h-8 w-8 text-primary-100" strokeWidth={1.75} />
          </div>
          <div>
            <h4 className="mb-1 text-base font-semibold text-secondary-000">{category.name}</h4>
            <p className="text-xs tracking-[-0.16px] text-secondary-100">
              {count} vendor{count !== 1 ? "s" : ""}
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function BrowseCategoriesSection() {
  const router = useRouter();
  const { data: categories = [], isLoading, isError, refetch } = usePublicCategories();

  const sorted = useMemo(
    () =>
      [...categories].sort((a, b) => {
        const diff = (b.vendorCount ?? 0) - (a.vendorCount ?? 0);
        return diff !== 0 ? diff : a.name.localeCompare(b.name);
      }),
    [categories]
  );

  const visible = sorted.slice(0, INITIAL_VISIBLE);
  const hasMore = sorted.length > INITIAL_VISIBLE;

  const goToBrowse = (category: PublicCategory) => {
    router.push(`/categories?categoryId=${category.id}`);
  };

  return (
    <section className="bg-white px-6 py-12 sm:px-8 sm:py-16 md:py-20 lg:px-24 lg:py-24">
      <div className="mx-auto max-w-[1440px]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <h2 className="mb-2 font-unbounded text-2xl font-semibold leading-[125%] text-secondary-000 md:text-3xl lg:text-4xl">
            Browse by Category
          </h2>
          <p className="text-base tracking-[-0.16px] text-accent-80">
            Find vendors in your preferred service category
          </p>
        </motion.div>

        {isLoading ? (
          <div className="flex min-h-[200px] items-center justify-center rounded-3xl border border-[#EFE6E1] bg-accent-10/30 py-16">
            <Loader2 className="h-10 w-10 animate-spin text-primary-100" aria-hidden />
            <span className="sr-only">Loading categories</span>
          </div>
        ) : isError ? (
          <div className="rounded-3xl border border-accent-30 bg-accent-10/50 px-6 py-12 text-center">
            <p className="mb-3 font-unageo text-secondary-000">Couldn&apos;t load categories</p>
            <Button type="button" variant="outline" className="rounded-xl" onClick={() => refetch()}>
              Try again
            </Button>
          </div>
        ) : sorted.length === 0 ? (
          <p className="rounded-3xl border border-[#EFE6E1] py-12 text-center text-accent-80">
            No categories available yet.
          </p>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-4 lg:grid-cols-4">
              {visible.map((category, index) => (
                <CategoryCard
                  key={category.id}
                  category={category}
                  index={index}
                  onNavigate={goToBrowse}
                />
              ))}
            </div>

            {hasMore && (
              <div className="mt-8 w-full">
                <Button
                  type="button"
                  variant="outline"
                  className="h-12 w-full rounded-2xl border-2 border-[#EFE6E1] font-semibold text-secondary-000 hover:bg-primary-300/20"
                  onClick={() => router.push("/categories")}
                >
                  Browse all categories
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
