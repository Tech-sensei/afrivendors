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
      <div className="max-w-[1240px] mx-auto">
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
              className="text-[clamp(32px,3.5vw,40px)] font-semibold font-unbounded text-secondary-000 leading-[125%]"
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

        {/* Statistics Cards */}
        <motion.div
          className="mt-16 sm:mt-20 md:mt-24"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {/* Active Vendors */}
            <motion.div
              className="bg-white rounded-xl p-6 sm:p-8 shadow-sm border border-primary-100"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <div className="text-4xl sm:text-5xl font-semibold font-unbounded text-primary-100 mb-2">
                10,000+
              </div>
              <div className="text-base sm:text-lg font-normal text-secondary-000">
                Active Vendors
              </div>
            </motion.div>

            {/* Happy Customers */}
            <motion.div
              className="bg-white rounded-xl p-6 sm:p-8 shadow-sm"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="text-4xl sm:text-5xl font-semibold font-unbounded text-primary-100 mb-2">
                50,000+
              </div>
              <div className="text-base sm:text-lg font-normal text-secondary-000">
                Happy Customers
              </div>
            </motion.div>

            {/* Bookings Made */}
            <motion.div
              className="bg-white rounded-xl p-6 sm:p-8 shadow-sm"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="text-4xl sm:text-5xl font-semibold font-unbounded text-primary-100 mb-2">
                100,000+
              </div>
              <div className="text-base sm:text-lg font-normal text-secondary-000">
                Bookings Made
              </div>
            </motion.div>

            {/* Average Rating */}
            <motion.div
              className="bg-white rounded-xl p-6 sm:p-8 shadow-sm"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              viewport={{ once: true }}
            >
              <div className="text-4xl sm:text-5xl font-semibold font-unbounded text-primary-100 mb-2">
                4.8/5
              </div>
              <div className="text-base sm:text-lg font-normal text-secondary-000">
                Average Rating
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default WhyUsSection;
