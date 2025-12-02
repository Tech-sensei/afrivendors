"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";

const VendorCTASection = () => {
  return (
    <section className="py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-8 lg:px-24 bg-secondary-000">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-20 justify-between items-start w-full">
          {/* left contents */}
          <div className="flex flex-col gap-2 flex-1 items-start">
            <h3 className="text-lg md:text-xl lg:text-2xl font-semibold font-unbounded text-secondary-800 leading-[125%]">
              Meet Nia – The Story Behind Nia Decor Studio
            </h3>
            <p className="text-base font-normal leading-[150%] tracking-[-0.16px] text-secondary-600">
              Nia Uwase, founder of Nia Decor Studio in Kigali, transforms spaces with locally crafted art and eco-friendly materials. Her
              designs blend modern minimalism with authentic African creativity, turning homes into living stories of culture and
              sustainability.
              <br />
              <br />
              Through Afrivendor, Nia connects with clients who value originality and craftsmanship expanding her reach and growing her
              brand beyond borders.
            </p>
            <p className="text-base font-normal italic leading-[150%] tracking-[-0.16px] text-secondary-400">
              Share your craft. Grow your business. Become a vendor on Afrivendor today.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2.5 bg-primary-100 text-secondary-800 px-6 py-2.5 rounded-full font-bold text-lg tracking-[-0.2px] transition-colors cursor-pointer"
            >
              Become a Vendor
              <ArrowRight size={18} />
            </motion.button>
          </div>

          {/* right contents */}
          <div className="flex flex-col gap-2 items-start">
            <Image src="/assets/images/vendorImg.png" alt="Nia Decor Studio" width={500} height={500} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default VendorCTASection;
