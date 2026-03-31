"use client";
import { motion } from "framer-motion";
import svgPaths from "@/lib/svgPath2";
import Image from "next/image";

export function AboutImgContainer() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
      viewport={{ once: true }}
      className="mx-auto w-full max-w-[1122px]"
    >
      <motion.div
        whileHover={{
          scale: 1.02,
          transition: { duration: 0.3, ease: "easeOut" },
        }}
        className="relative overflow-hidden w-full rounded-tl-[clamp(60px,15vw,183px)] rounded-br-[clamp(60px,15vw,183px)] aspect-1122/375"
      >
        <Image
          src="/assets/images/aboutHeroImg.png"
          width={500}
          height={500}
          alt="African artisan at work"
          className="w-full h-full object-cover brightness-[0.95] transition-all duration-500 ease-out hover:brightness-110 hover:scale-110"
          preload={true}
          loading="eager"
        />
      </motion.div>
    </motion.div>
  );
}

const AboutHeroSection = () => {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="relative py-12 sm:py-16 md:py-20 lg:py-24 px-6 sm:px-8 lg:px-24 bg-white"
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
                <div className="content-stretch flex flex-col gap-2 items-center relative w-full" data-name="Home-Hero-Header">
                  <p className="font-unbounded font-medium leading-[normal] w-full relative shrink-0 text-center text-[#562A03] text-[clamp(28px,6vw,76px)] tracking-[-0.06em]">
                    {`   About Afrivendor `}
                  </p>
                  <div className="relative shrink-0 w-full h-auto max-w-[720px] aspect-[720 / 106.463]">
                    <svg className="block w-full h-full" fill="none" preserveAspectRatio="xMidYMid meet" viewBox="0 0 720 107">
                      <path d={svgPaths.pe6a3100} fill="var(--fill-0, #C56C31)" id="Subtract" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Sub-heading */}
            <p className="mb-10 max-w-4xl sm:px-0 text-secondary-100 text-[clamp(16px,2vw,20px)] leading-[1.6]">
              Afrivendor is more than just a marketplace. We're building a community where local vendors thrive and customers discover
              exceptional services right in their neighborhood.
            </p>

            {/* Image Container - Beautiful curved gallery */}
            <AboutImgContainer />
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};

export default AboutHeroSection;
