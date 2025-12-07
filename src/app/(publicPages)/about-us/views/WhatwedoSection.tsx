"use client";
import Image from "next/image";
import { motion } from "motion/react";
import { CheckCircle2 } from "lucide-react";

const userFeatures = [
  "Find verified vendors and read customer reviews",
  "Book services seamlessly and securely",
  "Manage projects, payments, and communication in one place",
];

const vendorFeatures = [
  "Business visibility and profile customization",
  "Book services seamlessly and securely",
  "Manage projects, payments, and communication in one place",
];

const FeatureList = ({ features, delay = 0 }: { features: string[]; delay?: number }) => (
  <div className="flex flex-col gap-4 ml-1">
    {features.map((feature, index) => (
      <motion.li
        key={index}
        className="flex items-center gap-2"
        initial={{ opacity: 0, x: -10 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, delay: delay + index * 0.1 }}
        viewport={{ once: true }}
      >
        <CheckCircle2 size={20} className="text-accent-100" />
        <p className="text-base md:text-lg font-normal leading-[150%] tracking-[-0.18px] text-accent-100">{feature}</p>
      </motion.li>
    ))}
  </div>
);

const WhatwedoSection = () => {
  return (
    <section className="py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-8 lg:px-24">
      <div className="max-w-[1440px] mx-auto">
        <div className="flex items-start justify-between gap-20 w-full">
          {/* Left contents */}
          <motion.div
            className="flex flex-col gap-8 items-start flex-1"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            {/* Title */}
            <div className="flex flex-col items-start gap-2">
              <motion.h3
                className="text-lg md:text-xl lg:text-2xl font-semibold font-unbounded text-secondary-000 leading-[125%]"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                viewport={{ once: true }}
              >
                What We Do
              </motion.h3>
              <motion.p
                className="text-base font-normal leading-[150%] tracking-[-0.16px] text-accent-100"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                Afrivendor simplifies how people discover, book, and collaborate with professionals across multiple service categories from
                home improvement and events to beauty, design, and more.
              </motion.p>
            </div>

            {/* User features */}
            <motion.div
              className="flex flex-col items-start gap-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-2">
                <span className="flex flex-col items-center justify-center w-8 h-8 p-2 gap-2 aspect-square rounded-full bg-secondary-000 text-secondary-800 text-base font-bold leading-[150%] tracking-[-0.16px]">
                  1
                </span>
                <h3 className="text-xl text-accent-100 font-bold leading-[160%] tracking-[-0.2px]">
                  Through our mobile app and vendor dashboard, users can:
                </h3>
              </div>
              <FeatureList features={userFeatures} delay={0.4} />
            </motion.div>

            {/* Vendor features */}
            <motion.div
              className="flex flex-col items-start gap-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-2">
                <span className="flex flex-col items-center justify-center w-8 h-8 p-2 gap-2 aspect-square rounded-full bg-secondary-000 text-secondary-800 text-base font-bold leading-[150%] tracking-[-0.16px]">
                  2
                </span>
                <h3 className="text-xl text-accent-100 font-bold leading-[160%] tracking-[-0.2px]">For vendors, Afrivendor provides:</h3>
              </div>
              <FeatureList features={vendorFeatures} delay={0.6} />
            </motion.div>
          </motion.div>

          {/* Right contents */}
          <motion.div
            className="flex flex-col gap-8 self-center "
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.3 }}>
              <Image src="/assets/images/Frame.png" alt="What We Do" width={368} height={380} className="rounded-lg" />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default WhatwedoSection;
