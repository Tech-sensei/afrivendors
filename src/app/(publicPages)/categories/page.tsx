"use client";

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { motion } from 'motion/react';
import { vendors, categories as allCategories, locations } from '@/data/vendorsData';
import { FilterSection } from '@/components/views/FilterSection';
import VendorCard from '@/components/views/VendorCard';

interface CategoryPageProps {
  onNavigate: (page: string, data?: any) => void;
  initialCategory?: string;
}

interface Filters {
  categories: string[];
  priceRanges: string[];
  locations: string[];
  minRating: number | null;
}

const CategoryPage = ({ onNavigate, initialCategory }: CategoryPageProps) => {
  const router = useRouter();
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('rating');
  const [filters, setFilters] = useState<Filters>({
    categories: initialCategory ? [initialCategory] : [],
    priceRanges: [],
    locations: [],
    minRating: null
  });

  // Price range mapping
  const priceRangeMap = {
    '$': { min: 0, max: 50, label: '$ (0–50)' },
    '$$': { min: 50, max: 100, label: '$$ (50–100)' },
    '$$$': { min: 100, max: 200, label: '$$$ (100–200)' },
    '$$$$': { min: 200, max: 999999, label: '$$$$ (200+)' }
  };

  // Filter vendors
  const filteredVendors = useMemo(() => {
    let result = [...vendors];

    // Category filter
    if (filters.categories.length > 0) {
      result = result.filter(v => filters.categories.includes(v.category));
    }

    // Price range filter
    if (filters.priceRanges.length > 0) {
      result = result.filter(v => {
        return filters.priceRanges.some(range => {
          const { min, max } = priceRangeMap[range as keyof typeof priceRangeMap];
          return v.minPrice >= min && v.maxPrice <= max;
        });
      });
    }

    // Location filter
    if (filters.locations.length > 0) {
      result = result.filter(v => filters.locations.includes(v.location));
    }

    // Rating filter
    if (filters.minRating !== null) {
      result = result.filter(v => v.rating >= filters.minRating!);
    }

    // Sort
    switch (sortBy) {
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'reviews':
        result.sort((a, b) => b.reviewCount - a.reviewCount);
        break;
      case 'price-low':
        result.sort((a, b) => a.minPrice - b.minPrice);
        break;
      case 'price-high':
        result.sort((a, b) => b.maxPrice - a.maxPrice);
        break;
    }

    return result;
  }, [filters, sortBy]);

  const toggleFilter = (type: keyof Filters, value: string | number) => {
    setFilters(prev => {
      if (type === 'minRating') {
        return { ...prev, minRating: prev.minRating === value ? null : value as number };
      }

      const array = prev[type] as string[];
      const newArray = array.includes(value as string)
        ? array.filter(item => item !== value)
        : [...array, value as string];

      return { ...prev, [type]: newArray };
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
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 px-6 sm:px-8 lg:px-24 bg-accent-10">
        <div className="mx-auto max-w-[1440px]">
          <h2 className="mb-3 font-unbounded text-3xl font-semibold text-secondary-000">
            Browse Vendors
          </h2>
          <p className="font-unageo text-base text-secondary-200 opacity-70">
            Discover trusted service providers across Africa
          </p>
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
                    allCategories={allCategories}
                    locations={locations}
                    priceRangeMap={priceRangeMap}
                    toggleFilter={toggleFilter}
                  />
                </CardContent>
              </Card>
            </aside>

            {/* Results */}
            <div className="flex-1">
              {/* Toolbar */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6 items-start sm:items-center justify-between">
                <p className="font-unageo text-sm text-secondary-200 opacity-70">
                  Showing {filteredVendors.length} vendor{filteredVendors.length !== 1 ? 's' : ''}
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
                      <SelectItem value="rating">Highest Rated</SelectItem>
                      <SelectItem value="reviews">Most Reviews</SelectItem>
                      <SelectItem value="price-low">Price: Low to High</SelectItem>
                      <SelectItem value="price-high">Price: High to Low</SelectItem>
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
                      allCategories={allCategories}
                      locations={locations}
                      priceRangeMap={priceRangeMap}
                      toggleFilter={toggleFilter}
                    />
                  </CardContent>
                </Card>
              )}

              {/* Vendor Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredVendors.map((vendor, index) => (
                  <VendorCard
                    key={vendor.id}
                    vendor={vendor}
                    index={index}
                    onClick={() => router.push(`/categories/${vendor.id}`)}
                  />
                ))}
              </div>

              {/* Empty State */}
              {filteredVendors.length === 0 && (
                <div className="text-center py-16 rounded-3xl bg-accent-10">
                  <p className="mb-2 font-unageo text-lg font-semibold text-secondary-000">
                    No vendors found
                  </p>
                  <p className="font-unageo text-sm text-secondary-200 opacity-70">
                    Try adjusting your filters to see more results
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </motion.div>
  );
}

export default CategoryPage;