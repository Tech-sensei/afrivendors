"use client";
import { useQuery } from "@tanstack/react-query";
import { getMostTrendingVendors } from "@/services/vendor";
import VendorCarousel from "./VendorCarousel";

const TrendingVendorsSection = () => {
  const { data: vendors = [], isLoading } = useQuery({
    queryKey: ["vendors", "most-trending"],
    queryFn: () => getMostTrendingVendors(1, 4),
    staleTime: 5 * 60 * 1000,
  });

  return (
    <VendorCarousel
      title="What's Trending"
      subtitle="Most Popular Vendors this month"
      vendors={vendors}
      isLoading={isLoading}
      bg="bg-white"
    />
  );
};

export default TrendingVendorsSection;
