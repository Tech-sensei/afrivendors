"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { CheckCircle2 } from "lucide-react";

const WhyUsSection = () => {
  return (
    <section className="py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-8 lg:px-24 bg-[#F7F4F2]">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-20 justify-between items-center w-full">
          {/* left contents */}
          <div className="flex flex-col gap-4 flex-1 items-start">
            <h3 className="text-lg md:text-xl lg:text-2xl font-semibold font-unbounded text-secondary-000 leading-[125%]">
              Why Afrivendor?
            </h3>

            <ul className="flex flex-col gap-4">
              <li className="flex items-center gap-2">
                <CheckCircle2 size={20} className="text-accent-100" />
                <p className="text-base md:text-lg font-normal leading-[150%] tracking-[-0.18px] text-accent-100">
                  Business visibility and profile customization
                </p>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 size={20} className="text-accent-100" />
                <p className="text-base md:text-lg font-normal leading-[150%] tracking-[-0.18px] text-accent-100">
                  Book services seamlessly and securely
                </p>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 size={20} className="text-accent-100" />
                <p className="text-base md:text-lg font-normal leading-[150%] tracking-[-0.18px] text-accent-100">
                  Manage projects, payments, and communication in one place
                </p>
              </li>
            </ul>
          </div>

          {/* right contents */}
          <div className="flex flex-col gap-2 items-start justify-items-end">
            <Image src="/assets/images/vendorImg.png" alt="Nia Decor Studio" width={500} height={500} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyUsSection;
