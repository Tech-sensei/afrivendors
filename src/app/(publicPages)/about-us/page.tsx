import FAQ from "@/components/views/FAQSection";
import Reviews from "@/components/views/ReviewSection";
import WhyUsSection from "./views/WhyUsSection";
import AboutCTASection from "./views/AboutCTASection";
import WhatwedoSection from "./views/WhatwedoSection";
import AboutHeroSection from "./views/AboutHeroSection";

const AboutUsPage = () => {
  return (
    <div>
      <AboutHeroSection />
      <WhatwedoSection />
      <WhyUsSection />
      <AboutCTASection
        bgColor="bg-[#F4E0D3]"
        title="Join Us on This Journey"
        description="Whether you’re looking for trusted professionals or ready to grow your business, Afrivendor is your partner for progress. Together, we can build stronger communities, one service at a time."
      />
      <Reviews />
      <FAQ />
    </div>
  );
};

export default AboutUsPage;
