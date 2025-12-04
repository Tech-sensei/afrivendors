"use client";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import ImgContainerResponsive from "../ImgContainerResponsive";
import svgPaths from "../../lib/svgPath1";

const HomeHeroSection = () => {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="relative py-12 sm:py-16 md:py-20 lg:py-24 px-6 sm:px-8 lg:px-24 bg-[#F8F5F2]"
    >
      <div className="max-w-[1440px] mx-auto">
        {/* Centered Hero Content */}
        <div className="flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1, ease: "easeOut" }}
            className="flex flex-col items-center w-full"
          >
            {/* Hero Header Image */}
            <div className="mb-8 w-full max-w-4xl px-4 sm:px-6 md:px-8 lg:px-0">
              <div className="w-full max-w-full overflow-hidden">
                <div className="content-stretch flex flex-col gap-[8px] items-center relative w-full" data-name="Home-Hero-Header">
                  <p className="font-unbounded font-medium leading-[normal] w-full relative shrink-0 text-center text-[#562A03] text-[clamp(28px,6vw,76px)] tracking-[-0.06em]">
                    {`Connecting You To `}
                  </p>
                  <div className="relative shrink-0 w-full h-auto max-w-[1068.5px] aspect-[1068.5 / 112]">
                    <svg className="block w-full h-full" fill="none" preserveAspectRatio="xMidYMid meet" viewBox="0 0 1069 112">
                      <path d={svgPaths.p35fa3f00} fill="var(--fill-0, #C56C31)" id="Subtract" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Sub-heading */}
            <p className="mb-10 max-w-2xl px-4 sm:px-0 text-secondary-100 text-[clamp(16px,2vw,20px)] leading-[1.6]">
              Connect with skilled professionals and authentic service providers across Africa. From beauty salons to catering, find the
              perfect vendor for your needs.
            </p>

            {/* Buttons side by side */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 w-full">
              <Button
                size="lg"
                className="transition-all duration-300 bg-primary-100 text-white rounded-full px-8 h-14 text-base font-semibold hover:bg-primary-600 hover:scale-105 cursor-pointer w-full md:w-fit"
                onClick={() => { }}
              >
                Browse All Vendors
                <ArrowRight style={{ width: "20px", height: "20px", marginLeft: "8px" }} />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="transition-all duration-300 rounded-full px-8 h-14 text-base font-semibold bg-transparent border-2 border-secondary-000 text-secondary-000 hover:bg-secondary-000 hover:text-white hover:border-secondary-000 cursor-pointer w-full md:w-fit"
                onClick={() => { }}
              >
                List Your Business
              </Button>
            </div>

            {/* Image Container - Beautiful curved gallery */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
              className="w-full"
            >
              <ImgContainerResponsive />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};

export default HomeHeroSection;
