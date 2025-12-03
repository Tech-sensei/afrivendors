"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { CheckCircle2 } from "lucide-react";

const features = [
  {
    id: 1,
    text: "Business visibility and profile customization",
  },
  {
    id: 2,
    text: "Book services seamlessly and securely",
  },
  {
    id: 3,
    text: "Manage projects, payments, and communication in one place",
  },
];

const WhyUsSection = () => {
  return (
    <section className="py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-8 lg:px-24 bg-[#F7F4F2]">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-20 justify-between items-center w-full">
          {/* left contents */}
          <motion.div
            className="flex flex-col gap-4 flex-1 items-start"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          >
            <motion.h3
              className="text-lg md:text-xl lg:text-2xl font-semibold font-unbounded text-secondary-000 leading-[125%]"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              Why Afrivendor?
            </motion.h3>

            <div className="flex flex-col gap-4">
              {features.map((feature, index) => (
                <motion.li
                  key={feature.id}
                  className="flex items-center gap-2"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    transition={{
                      duration: 0.4,
                      delay: 0.3 + index * 0.1,
                      type: "spring",
                      stiffness: 200,
                    }}
                    viewport={{ once: true }}
                  >
                    <CheckCircle2 size={20} className="text-accent-100" />
                  </motion.div>
                  <p className="text-base md:text-lg font-normal leading-[150%] tracking-[-0.18px] text-accent-100">{feature.text}</p>
                </motion.li>
              ))}
            </div>
          </motion.div>

          {/* right contents */}
          <motion.div
            className="flex flex-col gap-2 items-start justify-items-end"
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

export default WhyUsSection;
