"use client";

import { Star } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface FilterSectionProps {
    isMobile?: boolean;
    filters: {
        categories: string[];
        priceRanges: string[];
        locations: string[];
        minRating: number | null;
    };
    allCategories: string[];
    locations: string[];
    priceRangeMap: Record<string, { min: number; max: number; label: string }>;
    toggleFilter: (type: 'categories' | 'priceRanges' | 'locations' | 'minRating', value: string | number) => void;
}

export function FilterSection({
    isMobile = false,
    filters,
    allCategories,
    locations,
    priceRangeMap,
    toggleFilter
}: FilterSectionProps) {
    return (
        <div className={`space-y-6 ${isMobile ? 'space-y-4' : ''}`}>
            {/* Category Filter */}
            <div>
                <h4 className="mb-4 text-lg font-semibold text-secondary-000">
                    Category
                </h4>
                <div className="space-y-3">
                    {allCategories.map((cat) => (
                        <div key={cat} className="flex items-center space-x-2">
                            <Checkbox
                                id={`${isMobile ? 'mobile-' : ''}cat-${cat}`}
                                checked={filters.categories.includes(cat)}
                                onCheckedChange={() => toggleFilter('categories', cat)}
                                className="data-[state=checked]:bg-primary-100 data-[state=checked]:border-primary-100"
                            />
                            <Label
                                htmlFor={`${isMobile ? 'mobile-' : ''}cat-${cat}`}
                                className="cursor-pointer text-sm text-secondary-000"
                            >
                                {cat}
                            </Label>
                        </div>
                    ))}
                </div>
            </div>

            {/* Price Range Filter */}
            <div>
                <h4 className="mb-4 text-lg font-semibold text-secondary-000">
                    Price Range
                </h4>
                <div className="space-y-3">
                    {Object.entries(priceRangeMap).map(([key, { label }]) => (
                        <div key={key} className="flex items-center space-x-2">
                            <Checkbox
                                id={`${isMobile ? 'mobile-' : ''}price-${key}`}
                                checked={filters.priceRanges.includes(key)}
                                onCheckedChange={() => toggleFilter('priceRanges', key)}
                                className="data-[state=checked]:bg-primary-100 data-[state=checked]:border-primary-100"
                            />
                            <Label
                                htmlFor={`${isMobile ? 'mobile-' : ''}price-${key}`}
                                className="cursor-pointer text-sm text-secondary-000"
                            >
                                {label}
                            </Label>
                        </div>
                    ))}
                </div>
            </div>

            {/* Location Filter */}
            <div>
                <h4 className="mb-4 text-lg font-semibold text-secondary-000">
                    Location
                </h4>
                <div className="space-y-3">
                    {locations.map((loc) => (
                        <div key={loc} className="flex items-center space-x-2">
                            <Checkbox
                                id={`${isMobile ? 'mobile-' : ''}loc-${loc}`}
                                checked={filters.locations.includes(loc)}
                                onCheckedChange={() => toggleFilter('locations', loc)}
                                className="data-[state=checked]:bg-primary-100 data-[state=checked]:border-primary-100"
                            />
                            <Label
                                htmlFor={`${isMobile ? 'mobile-' : ''}loc-${loc}`}
                                className="cursor-pointer text-sm text-secondary-000"
                            >
                                {loc.split(',')[0]}
                            </Label>
                        </div>
                    ))}
                </div>
            </div>

            {/* Rating Filter */}
            <div>
                <h4 className="mb-4 text-lg font-semibold text-secondary-000">
                    Rating
                </h4>
                <div className="space-y-3">
                    {[5.0, 4.5, 4.0].map((rating) => (
                        <div key={rating} className="flex items-center space-x-2">
                            <Checkbox
                                id={`${isMobile ? 'mobile-' : ''}rating-${rating}`}
                                checked={filters.minRating === rating}
                                onCheckedChange={() => toggleFilter('minRating', rating)}
                                className="data-[state=checked]:bg-primary-100 data-[state=checked]:border-primary-100"
                            />
                            <Label
                                htmlFor={`${isMobile ? 'mobile-' : ''}rating-${rating}`}
                                className="cursor-pointer flex items-center gap-1 text-sm text-secondary-000"
                            >
                                <Star className="h-4 w-4 text-primary-100 fill-primary-100" />
                                {rating}+
                            </Label>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

