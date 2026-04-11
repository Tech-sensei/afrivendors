import dynamic from "next/dynamic";
import HomeHeroSection from "@/components/views/HomeHeroSection";
import BrowseCategoriesSection from "@/components/views/BrowseCategoriesSection";

// Lazy-load everything below the fold — only Hero + Categories are critical for LCP
const FeaturedVendorsSection = dynamic(() => import("@/components/views/FeaturedVendorsSection"));
const TrendingVendorsSection  = dynamic(() => import("@/components/views/TrendingVendorsSection"));
const NewVendorsSection        = dynamic(() => import("@/components/views/NewVendorsSection"));
const DownloadAppSection       = dynamic(() => import("@/components/views/DownloadAppSection"));
const Reviews                  = dynamic(() => import("@/components/views/ReviewSection"));
const CTASection               = dynamic(() => import("@/components/views/CTASection"));
const FAQ                      = dynamic(() => import("@/components/views/FAQSection"));

export default function Home() {
    return (
        <>
            <HomeHeroSection />
            <BrowseCategoriesSection />
            <FeaturedVendorsSection />
            <TrendingVendorsSection />
            <NewVendorsSection />
            <DownloadAppSection />
            <Reviews />
            <CTASection />
            <FAQ />
        </>
    );
}
