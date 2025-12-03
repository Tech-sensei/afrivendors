import FAQ from "@/components/views/FAQSection";
import Reviews from "@/components/views/ReviewSection";
import AboutCTASection from "@/app/about-us/views/AboutCTASection";

const HowItWorksPage = () => {
  return (
    <div>
      <AboutCTASection
        bgColor="bg-[#F7F4F2]"
        title="Ready to Get Started?"
        description="Join thousands of users already connecting through Afrivendor.."
      />
      <Reviews />
      <FAQ />
    </div>
  );
};

export default HowItWorksPage;
