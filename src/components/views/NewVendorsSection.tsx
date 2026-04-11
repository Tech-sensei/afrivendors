"use client";
import { useQuery } from "@tanstack/react-query";
import { getNewestVendors } from "@/services/vendor";
import VendorCarousel from "./VendorCarousel";

const NewVendorsSection = () => {
  const { data: vendors = [], isLoading } = useQuery({
    queryKey: ["vendors", "newest"],
    queryFn: () => getNewestVendors(1, 4),
    staleTime: 5 * 60 * 1000,
  });

  return (
    <VendorCarousel
      title="New to Afrivendors"
      subtitle="Discover fresh talent and newly joined vendors"
      vendors={vendors}
      isLoading={isLoading}
      bg="bg-[#F7F4F2]"
    />
  );
};

export default NewVendorsSection;
