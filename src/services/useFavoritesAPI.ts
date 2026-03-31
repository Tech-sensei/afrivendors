import { useEffect, useMemo, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  addFavoriteVendor,
  addFavoriteVendorToStorage,
  getFavoriteStorageEventName,
  isVendorFavorited,
  mapVendorDetailToFavorite,
  mapVendorListItemToFavorite,
  readFavoriteVendors,
  removeFavoriteVendor,
  removeFavoriteVendorFromStorage,
} from "@/services/favorites";
import { useAppSelector } from "@/store/hooks";
import type { FavoriteCandidate } from "@/types/favorites";
import type { VendorDetail } from "@/types/vendor";

function isVendorDetail(vendor: FavoriteCandidate): vendor is VendorDetail {
  return "bannerImage" in vendor;
}

export function useFavoritesAPI() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);

  useEffect(() => {
    const syncFavorites = () => {
      setFavoriteIds(readFavoriteVendors().map((vendor) => vendor.id));
    };

    syncFavorites();

    window.addEventListener(getFavoriteStorageEventName(), syncFavorites);
    return () => {
      window.removeEventListener(getFavoriteStorageEventName(), syncFavorites);
    };
  }, []);

  const addFavoriteMutation = useMutation({
    mutationFn: addFavoriteVendor,
  });

  const removeFavoriteMutation = useMutation({
    mutationFn: removeFavoriteVendor,
  });

  const favoriteSet = useMemo(() => new Set(favoriteIds), [favoriteIds]);

  const addToFavorites = async (vendor: FavoriteCandidate) => {
    if (!isAuthenticated) {
      toast.info("Please sign in to save vendors to favourites.");
      const redirectPath =
        typeof window !== "undefined"
          ? `${window.location.pathname}${window.location.search}`
          : "/";
      router.push(`/sign-in?redirect=${encodeURIComponent(redirectPath)}`);
      return false;
    }

    if (favoriteSet.has(vendor.id) || isVendorFavorited(vendor.id)) {
      toast.info("This vendor is already in your favourites.");
      return true;
    }

    await addFavoriteMutation.mutateAsync(vendor.id);

    const favoriteVendor = isVendorDetail(vendor)
      ? mapVendorDetailToFavorite(vendor)
      : mapVendorListItemToFavorite(vendor);

    const nextFavorites = addFavoriteVendorToStorage(favoriteVendor);
    setFavoriteIds(nextFavorites.map((item) => item.id));
    queryClient.invalidateQueries({ queryKey: ["favorite-vendors"] });
    toast.success(`${vendor.name} added to favourites.`);
    return true;
  };

  const removeFromFavorites = async (vendorId: string, vendorName?: string) => {
    await removeFavoriteMutation.mutateAsync(vendorId);
    const nextFavorites = removeFavoriteVendorFromStorage(vendorId);
    setFavoriteIds(nextFavorites.map((item) => item.id));
    queryClient.invalidateQueries({ queryKey: ["favorite-vendors"] });
    toast.success(`${vendorName || "Vendor"} removed from favourites.`);
    return true;
  };

  const removeFromFavoritesLocally = (vendorId: string, vendorName?: string) => {
    const nextFavorites = removeFavoriteVendorFromStorage(vendorId);
    setFavoriteIds(nextFavorites.map((item) => item.id));
    toast.success(`${vendorName || "Vendor"} removed from favourites.`);
  };

  return {
    favoriteIds,
    isFavorite: (vendorId: string) => favoriteSet.has(vendorId),
    addToFavorites,
    removeFromFavorites,
    removeFromFavoritesLocally,
    isAddingFavorite: addFavoriteMutation.isPending,
    isRemovingFavorite: removeFavoriteMutation.isPending,
  };
}
