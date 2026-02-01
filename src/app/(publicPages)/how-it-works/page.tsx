import FAQ from "@/components/views/FAQSection";
import Reviews from "@/components/views/ReviewSection";
import HowItWorkHeroSection from "./views/HowItWorkHeroSection";
import HowItWorksSection from "./views/HowItWorksSection";
import WhyUsSection from "./views/WhyUsSection";

const HowItWorksPage = () => {
  return (
    <div>
      <HowItWorkHeroSection />
      <HowItWorksSection />
      <WhyUsSection />
      <Reviews />
      <FAQ />
    </div>
  );
};

export default HowItWorksPage;
