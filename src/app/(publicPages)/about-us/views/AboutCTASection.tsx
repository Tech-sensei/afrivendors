"use client";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { motion } from "motion/react";

interface AboutCTASectionProps {
  bgColor: string;
  title: string;
  description: string;
}

const AboutCTASection = ({ bgColor, title, description }: AboutCTASectionProps) => {
  return (
    <section className="py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-8 lg:px-24">
      <motion.div
        className={`max-w-[1440px] mx-auto pt-6 px-6 rounded-t-4xl flex flex-col md:flex-row items-center md:-start justify-between gap-12 w-full ${bgColor}`}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true }}
      >
        {/* left contents */}
        <div className="flex flex-col gap-4 flex-1 items-start max-w-[700px]">
          <motion.h3
            className="text-lg md:text-xl lg:text-2xl font-semibold font-unbounded text-secondary-000 leading-[125%]"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            {title}
          </motion.h3>

          <motion.p
            className="text-base font-normal leading-[150%] tracking-[-0.16px] text-accent-100"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            {description}
          </motion.p>

          <motion.div
            className="flex flex-col md:flex-row items-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <motion.button
              type="button"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="flex py-2.5 px-6 items-center justify-center gap-2.5 border border-solid border-secondary-000 rounded-full w-full md:w-fit text-accent-100 text-lg font-semibold leading-[150%] tracking-[-0.18px]"
            >
              Available on
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.6, type: "spring", stiffness: 200 }}
                viewport={{ once: true }}
              >
                <Image src="/assets/icons/appleIcon.svg" alt="App Store" width={24} height={24} />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.7, type: "spring", stiffness: 200 }}
                viewport={{ once: true }}
              >
                <Image src="/assets/icons/googleIcon.svg" alt="Play Store" width={24} height={24} />
              </motion.div>
            </motion.button>

            <motion.button
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2.5 bg-primary-100 text-secondary-800 px-6 py-2.5 rounded-full w-full md:w-fit font-bold text-lg tracking-[-0.2px] transition-colors cursor-pointer"
            >
              Download the Afrivendor App
              <ArrowRight size={18} />
            </motion.button>
          </motion.div>
        </div>

        {/* right contents */}
        <motion.div
          className="flex flex-col md:flex-row gap-4 items-start"
          initial={{ opacity: 0, x: 50, y: 20 }}
          whileInView={{ opacity: 1, x: 0, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <motion.div whileHover={{ scale: 1.02, y: -5 }} transition={{ duration: 0.3 }}>
            <Image src="/assets/images/journeyImg.png" alt="Nia Decor Studio" width={368} height={380} className="rounded-lg" />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default AboutCTASection;
