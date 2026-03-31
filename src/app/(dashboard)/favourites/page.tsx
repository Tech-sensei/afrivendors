"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import VendorCard from "@/components/views/VendorCard";
import { getFavoriteVendors } from "@/services/favorites";
import { useFavoritesAPI } from "@/services/useFavoritesAPI";
import type { FavoriteVendorCard } from "@/types/favorites";

export default function FavouritesPage() {
    const router = useRouter();
    const { removeFromFavorites, isRemovingFavorite } = useFavoritesAPI();
    const { data: favourites = [], isLoading, isError } = useQuery<FavoriteVendorCard[]>({
        queryKey: ["favorite-vendors"],
        queryFn: getFavoriteVendors,
    });

    return (
        <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h1 className="font-unbounded text-[28px] leading-8 font-semibold text-secondary-200">
                    Favourites
                </h1>
                <p className="text-sm text-secondary-100 opacity-70">
                    {favourites.length} saved vendor{favourites.length !== 1 ? 's' : ''}
                </p>
            </div>

            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {Array.from({ length: 3 }).map((_, index) => (
                        <div
                            key={index}
                            className="overflow-hidden rounded-2xl border border-[#EFE6E1] shadow-[0_4px_12px_rgba(35,19,5,0.08)]"
                        >
                            <div className="h-56 animate-pulse bg-accent-10" />
                            <div className="space-y-4 p-5">
                                <div className="h-5 w-3/4 animate-pulse rounded bg-accent-10" />
                                <div className="h-4 w-1/2 animate-pulse rounded bg-accent-10" />
                                <div className="h-4 w-2/3 animate-pulse rounded bg-accent-10" />
                                <div className="flex items-center justify-between border-t border-[#EFE6E1] pt-3">
                                    <div className="h-5 w-28 animate-pulse rounded bg-accent-10" />
                                    <div className="h-9 w-28 animate-pulse rounded-[18px] bg-accent-10" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : isError ? (
                <div className="flex flex-col items-center justify-center py-16 rounded-3xl bg-red-50">
                    <h3 className="mb-2 font-unbounded text-xl font-semibold text-secondary-000">
                        Couldn&apos;t load favourites
                    </h3>
                    <p className="text-sm text-secondary-100 opacity-70 text-center max-w-[320px]">
                        Please try again in a moment.
                    </p>
                </div>
            ) : favourites.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {favourites.map((vendor, index) => (
                        <VendorCard
                            key={vendor.id}
                            vendor={vendor}
                            index={index}
                            onClick={() => router.push(`/categories/${vendor.id}`)}
                            isFavourite
                            onFavouriteToggle={() => {
                                if (!isRemovingFavorite) {
                                    void removeFromFavorites(vendor.id, vendor.name);
                                }
                            }}
                        />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-16 rounded-3xl bg-accent-10">
                    <Heart className="h-16 w-16 mb-4 text-accent-60" />
                    <h3 className="mb-2 font-unbounded text-xl font-semibold text-secondary-000">
                        No favourites yet
                    </h3>
                    <p className="mb-6 text-sm text-secondary-100 opacity-70 text-center max-w-[320px]">
                        Start adding vendors to your favourites to see them here
                    </p>
                    <Button
                        onClick={() => router.push('/categories')}
                        className="bg-secondary-000 text-white hover:bg-secondary-000/90 rounded-[18px] h-11 px-6 text-sm font-semibold"
                    >
                        Browse Vendors
                    </Button>
                </div>
            )}
        </div>
    );
}
