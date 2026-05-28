"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion } from "motion/react";
import { FilterSection } from "@/components/views/FilterSection";
import VendorCard from "@/components/views/VendorCard";
import { getPublicVendors } from "@/services/vendor";
import { usePublicCategories } from "@/services/usePublicCategories";
import svgPaths from "@/lib/svgPath7";
import type { VendorFilters } from "@/types/vendor";

const CategoryPage = () => {
  const router = useRouter();
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("rating_desc");
  const [page, setPage] = useState(1);
  const limit = 9;
  const [filters, setFilters] = useState<VendorFilters>({
    country: "",
    categoryId: "",
    ratingStar: "",
    minAverageRating: "",
    maxAverageRating: "",
    minServicePrice: "",
    maxServicePrice: "",
  });

  const categoryFromUrlApplied = useRef(false);
  useEffect(() => {
    if (categoryFromUrlApplied.current || typeof window === "undefined") return;
    const cid = new URLSearchParams(window.location.search).get("categoryId");
    if (cid) {
      categoryFromUrlApplied.current = true;
      setFilters((prev) => ({ ...prev, categoryId: cid }));
      setPage(1);
    }
  }, []);

  const { data: publicCategories } = usePublicCategories();

  const { data, isLoading, isError, error, isFetching } = useQuery({
    queryKey: ["public-vendors", page, sortBy, filters],
    queryFn: () =>
      getPublicVendors({
        page,
        limit,
        sort: sortBy,
        country: filters.country || undefined,
        categoryId: filters.categoryId ? Number(filters.categoryId) : undefined,
        ratingStar: filters.ratingStar ? Number(filters.ratingStar) : undefined,
        minAverageRating: filters.minAverageRating ? Number(filters.minAverageRating) : undefined,
        maxAverageRating: filters.maxAverageRating ? Number(filters.maxAverageRating) : undefined,
        minServicePrice: filters.minServicePrice ? Number(filters.minServicePrice) : undefined,
        maxServicePrice: filters.maxServicePrice ? Number(filters.maxServicePrice) : undefined,
      }),
  });

  const categoryOptions = useMemo(() => {
    const entries = new Map<string, { id: string; name: string }>();

    for (const c of publicCategories ?? []) {
      entries.set(String(c.id), { id: String(c.id), name: c.name });
    }

    for (const vendor of data?.vendors || []) {
      if (vendor.categoryId) {
        const id = String(vendor.categoryId);
        if (!entries.has(id)) {
          entries.set(id, { id, name: vendor.category });
        }
      }
    }

    if (filters.categoryId && !entries.has(filters.categoryId)) {
      entries.set(filters.categoryId, {
        id: filters.categoryId,
        name: `Category ${filters.categoryId}`,
      });
    }

    return Array.from(entries.values()).sort((a, b) => a.name.localeCompare(b.name));
  }, [publicCategories, data?.vendors, filters.categoryId]);

  const countryOptions = useMemo(() => {
    const countries = new Set<string>();
    for (const vendor of data?.vendors || []) {
      if (vendor.country) {
        countries.add(vendor.country);
      }
    }
    return Array.from(countries).sort((a, b) => a.localeCompare(b));
  }, [data?.vendors]);

  const handleFilterChange = (key: string, value: string) => {
    setPage(1);
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const clearFilters = () => {
    setPage(1);
    setFilters({
      country: "",
      categoryId: "",
      ratingStar: "",
      minAverageRating: "",
      maxAverageRating: "",
      minServicePrice: "",
      maxServicePrice: "",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="flex flex-col min-h-screen"
    >
      {/* Header */}
      <section className="py-12 sm:py-16 md:py-18 px-6 sm:px-8 lg:px-24 bg-[#f9f5f2]">

        {/* Centered Hero Content */}
        <div className="flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1, ease: "easeOut" }}
            className="flex flex-col items-center w-full"
          >
            {/* Hero Header Image */}
            <div className="mb-8 w-full max-w-4xl px-4 sm:px-6 md:px-8 lg:px-0">
              <div className="w-full max-w-full overflow-hidden">
                <div className="content-stretch flex flex-col gap-2 items-center relative w-full" data-name="Home-Hero-Header">
                  <p className="font-unbounded font-medium leading-[normal] w-full relative shrink-0 text-center text-[#562A03] text-[clamp(28px,6vw,76px)] tracking-[-0.06em]">
                    {`   Discover Vendors `}
                  </p>
                  <div className="relative shrink-0 w-full h-auto max-w-[782px] aspect-[782 / 118]">
                    <svg className="block w-full h-full" fill="none" preserveAspectRatio="xMidYMid meet" viewBox="0 0 782 118">
                      <path d={svgPaths.p16a30100} fill="var(--fill-0, #C56C31)" id="Subtract" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Sub-heading */}
            <p className="mb-10 max-w-4xl  text-secondary-100 text-[clamp(16px,2vw,20px)] leading-[1.6]">
              Discover trusted service providers across Africa
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      {/* <section className="py-8 flex-1 bg-white"> */}
      <section className="py-8 px-6 sm:px-8 lg:px-24 bg-white">
        <div className="mx-auto max-w-[1440px]">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar - Desktop */}
            <aside className="hidden lg:block w-72 shrink-0">
              <Card className="sticky top-24 rounded-3xl border border-accent-30 shadow-[0_4px_12px_rgba(35,19,5,0.06)]">
                <CardContent className="p-6 py-0">
                  <FilterSection
                    filters={filters}
                    categoryOptions={categoryOptions}
                    countryOptions={countryOptions}
                    onFilterChange={handleFilterChange}
                    onClearFilters={clearFilters}
                  />
                </CardContent>
              </Card>
            </aside>

            {/* Results */}
            <div className="flex-1">
              {/* Toolbar */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6 items-start sm:items-center justify-between">
                <p className="font-unageo text-sm text-secondary-200 opacity-70">
                  Showing {data?.vendors.length || 0} of {data?.meta.total || 0} vendor{(data?.meta.total || 0) !== 1 ? "s" : ""}
                </p>
                <div className="flex gap-2 w-full sm:w-auto">
                  <Button
                    variant="outline"
                    className="lg:hidden flex-1 sm:flex-initial rounded-[18px] h-11 border-accent-40 text-secondary-000 font-unageo text-sm font-semibold"
                    onClick={() => setShowFilters(!showFilters)}
                  >
                    <SlidersHorizontal className="h-4 w-4 mr-2" />
                    Filters
                  </Button>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-full sm:w-[200px] rounded-[18px] h-11 border-accent-40 font-unageo text-sm">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="rating_desc">Highest Rated</SelectItem>
                      <SelectItem value="rating_asc">Lowest Rated</SelectItem>
                      <SelectItem value="price_low">Price: Low to High</SelectItem>
                      <SelectItem value="price_high">Price: High to Low</SelectItem>
                      <SelectItem value="newest">Newest</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Mobile Filters */}
              {showFilters && (
                <Card className="lg:hidden mb-6 rounded-3xl border border-accent-30">
                  <CardContent className="p-4">
                    <FilterSection
                      isMobile
                      filters={filters}
                      categoryOptions={categoryOptions}
                      countryOptions={countryOptions}
                      onFilterChange={handleFilterChange}
                      onClearFilters={clearFilters}
                    />
                  </CardContent>
                </Card>
              )}

              {/* Vendor Grid */}
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <div
                      key={index}
                      className="overflow-hidden rounded-2xl border border-[#EFE6E1] shadow-[0_4px_12px_rgba(35,19,5,0.08)]"
                    >
                      <div className="relative h-56 animate-pulse bg-accent-10">
                        <div className="absolute left-4 top-4 h-8 w-28 rounded-full bg-white/70" />
                        <div className="absolute right-4 top-4 h-10 w-10 rounded-full bg-white/70" />
                      </div>
                      <div className="space-y-4 p-5">
                        <div className="space-y-2">
                          <div className="h-5 w-3/4 animate-pulse rounded bg-accent-10" />
                          <div className="h-4 w-full animate-pulse rounded bg-accent-10" />
                          <div className="h-4 w-2/3 animate-pulse rounded bg-accent-10" />
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="h-4 w-16 animate-pulse rounded bg-accent-10" />
                          <div className="h-4 w-20 animate-pulse rounded bg-accent-10" />
                        </div>

                        <div className="h-4 w-1/2 animate-pulse rounded bg-accent-10" />

                        <div className="flex items-center justify-between border-t border-[#EFE6E1] pt-3">
                          <div className="h-5 w-28 animate-pulse rounded bg-accent-10" />
                          <div className="h-9 w-28 animate-pulse rounded-[18px] bg-accent-10" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : isError ? (
                <div className="text-center py-16 rounded-3xl bg-red-50">
                  <p className="mb-2 font-unageo text-lg font-semibold text-secondary-000">
                    Couldn&apos;t load vendors
                  </p>
                  <p className="font-unageo text-sm text-secondary-200 opacity-70">
                    {(error as Error)?.message || "Please try again."}
                  </p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {data?.vendors.map((vendor, index) => (
                  <VendorCard
                    key={vendor.id}
                    vendor={vendor}
                    index={index}
                    onClick={() => router.push(`/categories/${vendor.id}`)}
                  />
                    ))}
                  </div>

                  {data?.vendors.length === 0 && (
                    <div className="text-center py-16 rounded-3xl bg-accent-10">
                      <p className="mb-2 font-unageo text-lg font-semibold text-secondary-000">
                        No vendors found
                      </p>
                      <p className="font-unageo text-sm text-secondary-200 opacity-70">
                        Try adjusting your filters to see more results
                      </p>
                    </div>
                  )}

                  {!!data?.meta.totalPages && data.meta.totalPages > 1 && (
                    <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <p className="text-sm text-secondary-100">
                        Page {data.meta.page} of {data.meta.totalPages}
                        {isFetching ? " . Updating..." : ""}
                      </p>
                      <div className="flex gap-3">
                        <Button
                          variant="outline"
                          disabled={page <= 1 || isFetching}
                          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                        >
                          Previous
                        </Button>
                        <Button
                          disabled={page >= data.meta.totalPages || isFetching}
                          onClick={() => setPage((prev) => prev + 1)}
                        >
                          Next
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </motion.div>
  );
};

export default CategoryPage;