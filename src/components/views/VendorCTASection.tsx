"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";

const VendorCTASection = () => {
  return (
    <section className="py-12 sm:py-16 md:py-20 lg:py-24 px-6 sm:px-8 lg:px-24 bg-secondary-000">
      <div className="max-w-[1440px] mx-auto">
        <div className="flex flex-col lg:flex-row gap-20 justify-between items-start w-full">
          {/* left contents */}
          <motion.div
            className="flex flex-col gap-2 flex-1 items-start"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <motion.h3
              className="text-lg md:text-xl lg:text-2xl font-semibold font-unbounded text-secondary-800 leading-[125%]"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              Meet Nia – The Story Behind Nia Decor Studio
            </motion.h3>

            <motion.p
              className="text-base font-normal leading-[150%] tracking-[-0.16px] text-secondary-600"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              Nia Uwase, founder of Nia Decor Studio in Kigali, transforms spaces with locally crafted art and eco-friendly materials. Her
              designs blend modern minimalism with authentic African creativity, turning homes into living stories of culture and
              sustainability.
              <br />
              <br />
              Through Afrivendor, Nia connects with clients who value originality and craftsmanship expanding her reach and growing her
              brand beyond borders.
            </motion.p>

            <motion.p
              className="text-base font-normal italic leading-[150%] tracking-[-0.16px] text-secondary-400"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              Share your craft. Grow your business. Become a vendor on Afrivendor today.
            </motion.p>

            <motion.button
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2.5 bg-primary-100 text-secondary-800 px-6 py-2.5 rounded-full font-bold text-lg tracking-[-0.2px] transition-colors cursor-pointer"
            >
              Become a Vendor
              <ArrowRight size={18} />
            </motion.button>
          </motion.div>

          {/* right contents */}
          <motion.div
            className="flex flex-col gap-2 items-start"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.3 }}>
              <Image src="/assets/images/vendorImg.png" alt="Nia Decor Studio" width={385} height={268} className="rounded-lg" />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default VendorCTASection;
