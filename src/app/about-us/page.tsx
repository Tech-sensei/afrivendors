import FAQ from "@/components/views/FAQSection";
import Reviews from "@/components/views/ReviewSection";
import WhyUsSection from "./views/WhyUsSection";

const AboutUsPage = () => {
  return (
    <div>
      <WhyUsSection />
      <Reviews />
      <FAQ />
    </div>
  );
};

export default AboutUsPage;
