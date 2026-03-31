"use client";

import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import type { FilterSectionProps } from "@/types/vendor";

export function FilterSection({
    isMobile = false,
    filters,
    categoryOptions,
    countryOptions,
    onFilterChange,
    onClearFilters,
}: FilterSectionProps) {
    return (
        <div className={`space-y-6 ${isMobile ? 'space-y-4' : ''}`}>
            <div>
                <h4 className="mb-4 text-lg font-semibold text-secondary-000">Category</h4>
                <Select
                    value={filters.categoryId || "all"}
                    onValueChange={(value) => onFilterChange("categoryId", value === "all" ? "" : value)}
                >
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="All categories" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All categories</SelectItem>
                        {categoryOptions.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                                {category.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div>
                <h4 className="mb-4 text-lg font-semibold text-secondary-000">Country</h4>
                <Select
                    value={filters.country || "all"}
                    onValueChange={(value) => onFilterChange("country", value === "all" ? "" : value)}
                >
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="All countries" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All countries</SelectItem>
                        {countryOptions.map((country) => (
                            <SelectItem key={country} value={country}>
                                {country}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div>
                <h4 className="mb-4 text-lg font-semibold text-secondary-000">Published service price</h4>
                <div className="grid grid-cols-2 gap-3">
                    <Input
                        inputMode="numeric"
                        placeholder="Min price"
                        value={filters.minServicePrice}
                        onChange={(event) => onFilterChange("minServicePrice", event.target.value)}
                    />
                    <Input
                        inputMode="numeric"
                        placeholder="Max price"
                        value={filters.maxServicePrice}
                        onChange={(event) => onFilterChange("maxServicePrice", event.target.value)}
                    />
                </div>
            </div>

            <div>
                <h4 className="mb-4 text-lg font-semibold text-secondary-000">Average rating</h4>
                <div className="grid grid-cols-2 gap-3">
                    <Input
                        inputMode="decimal"
                        placeholder="Min rating"
                        value={filters.minAverageRating}
                        onChange={(event) => onFilterChange("minAverageRating", event.target.value)}
                    />
                    <Input
                        inputMode="decimal"
                        placeholder="Max rating"
                        value={filters.maxAverageRating}
                        onChange={(event) => onFilterChange("maxAverageRating", event.target.value)}
                    />
                </div>
            </div>

            <div>
                <h4 className="mb-4 text-lg font-semibold text-secondary-000">Rating floor</h4>
                <Select
                    value={filters.ratingStar || "all"}
                    onValueChange={(value) => onFilterChange("ratingStar", value === "all" ? "" : value)}
                >
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Any rating" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Any rating</SelectItem>
                        <SelectItem value="5">5 stars</SelectItem>
                        <SelectItem value="4">4 stars+</SelectItem>
                        <SelectItem value="3">3 stars+</SelectItem>
                        <SelectItem value="2">2 stars+</SelectItem>
                        <SelectItem value="1">1 star+</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <button
                type="button"
                onClick={onClearFilters}
                className="w-full rounded-xl border border-accent-30 px-4 py-3 text-sm font-semibold text-secondary-000 transition-colors hover:bg-accent-10"
            >
                Clear filters
            </button>
        </div>
    );
}