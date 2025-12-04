"use client";
import { motion } from "motion/react";
import { Button } from "../ui/button";

const CTASection = () => {
  return (
    <section className="py-12 sm:py-16 md:py-20 lg:py-24 px-6 sm:px-8 lg:px-24 bg-[#562A03]">
      <div className="max-w-[1440px] mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto"
        >
          <h2 className="mb-6 text-2xl md:text-3xl lg:text-[32px] font-semibold font-unbounded text-secondary-800 leading-[125%]">
            Ready to Grow Your Business?
          </h2>
          <p className="mb-8 text-base md:text-lg lg:text-[18px] font-normal text-secondary-600 leading-[125%]">
            Join thousands of vendors already connecting with customers on Afrivendor. List your services and start growing today.
          </p>
          <Button
            size="lg"
            className="transition-all duration-300"
            onClick={() => {}}
            style={{
              backgroundColor: "#FFFFFF",
              color: "#231305",
              borderRadius: "18px",
              height: "56px",
              paddingLeft: "32px",
              paddingRight: "32px",
              fontFamily: "var(--font-family-secondary)",
              fontSize: "16px",
              fontWeight: "var(--font-weight-semibold)",
            }}
          >
            Get Started for Free
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
