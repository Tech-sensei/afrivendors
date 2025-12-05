import FAQ from "@/components/views/FAQSection";
import Reviews from "@/components/views/ReviewSection";
import VendorCTASection from "@/components/views/VendorCTASection";
import BrowseCategoriesSection from "@/components/views/BrowseCategoriesSection";
import CTASection from "@/components/views/CTASection";
import FeaturedVendorsSection from "@/components/views/FeaturedVendorsSection";
import TrendingVendorsSection from "@/components/views/TrendingVendorsSection";
import NewVendorsSection from "@/components/views/NewVendorsSection";
import HomeHeroSection from "@/components/views/HomeHeroSection";

export default function Home() {
    return (
        <>
            <HomeHeroSection />
            <BrowseCategoriesSection />
            <FeaturedVendorsSection />
            <TrendingVendorsSection />
            <NewVendorsSection />
            <VendorCTASection />
            <Reviews />
            <CTASection />
            <FAQ />
        </>
    );
}

