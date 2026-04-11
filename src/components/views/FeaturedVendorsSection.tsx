"use client";
import { useQuery } from "@tanstack/react-query";
import { getMostPopularVendors } from "@/services/vendor";
import VendorCarousel from "./VendorCarousel";

const FeaturedVendorsSection = () => {
  const { data: vendors = [], isLoading } = useQuery({
    queryKey: ["vendors", "most-popular"],
    queryFn: () => getMostPopularVendors(1, 4),
    staleTime: 5 * 60 * 1000,
  });

  return (
    <VendorCarousel
      title="Featured Vendors"
      subtitle="Top-rated service providers across Africa"
      vendors={vendors}
      isLoading={isLoading}
      bg="bg-[#F7F4F2]"
    />
  );
};

export default FeaturedVendorsSection;
