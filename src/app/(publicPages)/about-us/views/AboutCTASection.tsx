"use client";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";


const AboutCTASection = () => {
  const router = useRouter();
  return (
    <section className="py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-8 lg:px-24 bg-secondary-600">
      <motion.div className="max-w-[1440px] mx-auto">
        <div className="max-w-[700px] mx-auto text-center">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold font-unbounded text-secondary-000 leading-[125%] mb-2">
            Ready to join our community?
          </h2>
          <p className="font-unageo text-lg leading-7 text-accent-80 mb-8">
            Whether you're a vendor looking to grow your business or a customer seeking trusted services,
            we're here for you.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <button
              onClick={() => router.push('/auth/vendor')}
              className="h-14 px-8 bg-primary-100 border-none rounded-xl cursor-pointer transition-all duration-200 ease-out hover:opacity-90 font-unageo text-base leading-5 font-semibold text-white"
            >
              Become a Vendor
            </button>
            <button
              onClick={() => router.push('/categories')}
              className="h-14 px-8 bg-transparent border border-accent-20 rounded-xl cursor-pointer transition-all duration-200 ease-out hover:bg-accent-10 font-unageo text-base leading-5 font-semibold text-secondary-000"
            >
              Browse Services
            </button>
          </div>
        </div>

      </motion.div>
    </section>
  );
};

export default AboutCTASection;
