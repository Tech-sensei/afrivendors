"use client";
import { Button } from "../ui/button";
import { ArrowRight } from "lucide-react";
import VendorCard from "./VendorCard";
import { vendors } from "../../data/vendorsData";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";

const featuredVendors = [
  vendors.find((v) => v.id === "zuriglow-beauty-hub"),
  vendors.find((v) => v.id === "fade-district"),
  vendors.find((v) => v.id === "zuri-events"),
  vendors.find((v) => v.id === "tastyroots-catering"),
].filter(Boolean);

const FeaturedVendorsSection = () => {
  const router = useRouter();
  return (
    <section className="py-12 sm:py-16 md:py-20 lg:py-24 px-6 sm:px-8 lg:px-24 bg-[#F7F4F2]">
      <div className="max-w-[1440px] mx-auto">
        <div className="mb-10 flex items-end justify-between">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className=""
          >
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold font-unbounded text-secondary-000 leading-[125%] mb-2">
              Featured Vendors
            </h2>
            <p className="text-accent-80 text-base tracking-[-0.16px]">Top-rated service providers across Africa</p>
          </motion.div>

          <Button
            variant="ghost"
            className="hidden md:flex transition-all duration-300 text-sm font-semibold text-primary-100"
            onClick={() => router.push("/categories")}
          >
            View All
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredVendors.map((vendor, index) => (
            <VendorCard key={vendor?.id} vendor={vendor} index={index} onClick={() => router.push(`/categories/${vendor?.id}`)} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedVendorsSection;
