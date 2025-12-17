import FAQ from "@/components/views/FAQSection";
import WhyUsSection from "./views/WhyUsSection";
import AboutCTASection from "./views/AboutCTASection";
import WhatwedoSection from "./views/WhatwedoSection";
import AboutHeroSection from "./views/AboutHeroSection";
import AboutMission from "./views/AboutMission";
import AboutValuesSection from "./views/AboutValuesSection";

const AboutUsPage = () => {
  return (
    <div>
      <AboutHeroSection />
      <AboutMission />
      <AboutValuesSection />
      <WhatwedoSection />
      <WhyUsSection />
      <AboutCTASection />

    </div>
  );
};

export default AboutUsPage;
