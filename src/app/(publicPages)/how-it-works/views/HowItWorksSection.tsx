"use client";
import React from "react";
import Image from "next/image";
import { motion, Variants } from "framer-motion";
import { 
  Smartphone, 
  CheckCircle2, 
  CreditCard, 
  Smile, 
  Download, 
  Calendar, 
  Banknote, 
  Star 
} from "lucide-react";

// Assets
import QRcode from "../../../../../public/assets/images/qr-code.svg";
import MobilePhoneWhite from "../../../../../public/assets/images/mobile-phone-white.png";
import MobilePhoneBlack from "../../../../../public/assets/images/mobile-phone-black.png";
import StepArrow from "../../../../../public/assets/icons/Arrow.svg";

// Reuse app store icon components from DownloadAppStore style
function AppleAppStoreIcon({ color = "#231305" }: { color?: string }) {
  return (
    <div className="relative shrink-0 size-[18px]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g>
          <path
            d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.22-.24 2.4-.93 3.68-.84 1.53.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"
            fill={color}
          />
        </g>
      </svg>
    </div>
  );
}

function GooglePlayIcon({ color = "#231305" }: { color?: string }) {
  return (
    <div className="relative shrink-0 size-[18px]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g>
          <path
            clipRule="evenodd"
            d="M3.852 3.148a.5.5 0 0 0-.852.353v17a.5.5 0 0 0 .852.353l8.626-8.626-8.626-8.626zm9.541 9.187L5.432 21.394 18.603 12 13.393 12.335zm0-1.67L5.432 2.606 18.603 12 13.393 11.665z"
            fill={color}
            fillRule="evenodd"
          />
        </g>
      </svg>
    </div>
  );
}

const itemVariants: Variants = {
  hidden: { opacity: 0, x: -20 },
  show: { opacity: 1, x: 0, transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] } }
};

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const StepItem = ({ 
  icon: Icon, 
  title, 
  description, 
  isDark = false,
  showArrow = false
}: { 
  icon: any, 
  title: string, 
  description: string, 
  isDark?: boolean,
  showArrow?: boolean
}) => (
  <motion.div variants={itemVariants} className="flex gap-1.5 md:gap-4 items-start relative pb-8">
    {showArrow && (
      <div className="absolute left-[14px] md:left-[16px] -translate-x-1/2 top-[36px] bottom-1 select-none pointer-events-none">
        <Image src={StepArrow} alt="" className={`h-full w-auto object-contain ${isDark ? 'brightness-0 invert' : ''}`} />
      </div>
    )}
    <div className={
        `z-10 bg-[#231305] size-7 md:size-8 rounded-full flex items-center justify-center shrink-0 ${isDark ? 'bg-secondary-800' : 'bg-secondary-000'}`
      }>
      <Icon className={`size-4 md:size-5 ${isDark ? 'text-secondary-000' : 'text-secondary-800'}`} />
    </div>
    <div className="flex flex-col gap-1">
      <h4 className={`text-base md:text-lg font-bold font-unageo leading-tight ${isDark ? 'text-secondary-800' : 'text-secondary-000'}`}>
        {title}
      </h4>
      <p className={`text-sm md:text-base font-normal font-unageo leading-relaxed max-w-md ${isDark ? 'text-secondary-800/80' : 'text-secondary-000/70'}`}>
        {description}
      </p>
    </div>
  </motion.div>
);

const HowItWorksSection = () => {
  return (
    <section className="bg-white py-12 md:py-24 px-4 md:px-24">
      <div className="max-w-[1440px] mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: true }}
          className="text-center mb-16 flex flex-col max-w-7xl mx-auto"
        >
          <h2 className="font-unbounded text-2xl md:text-4xl font-semibold text-secondary-000 leading-tight">
            Connecting Customers and Vendors Across Africa
          </h2>
          <p className="font-unageo text-sm md:text-base lg:text-lg text-secondary-000/70 leading-relaxed">
            Afrivendor bridges skilled professionals and customers who need trusted services through a seamless flow from request to delivery.
          </p>
        </motion.div>

        {/* Content Grid */}
        <div className="flex flex-col md:flex-row gap-10 md:gap-14 lg:gap-20">
          {/* For Customers */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true }}
            className="flex-1 bg-secondary-800 rounded-tl-[32px] rounded-bl-[32px] md:rounded-tl-[56px] md:rounded-bl-[56px] p-6 md:p-12 pb-0 md:pb-0 overflow-hidden"
          >
            <h3 className="font-unbounded text-xl md:text-2xl font-semibold text-secondary-000 mb-8 border-b border-black/5 pb-4">
              For Customers
            </h3>
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="space-y-1"
            >
              <StepItem 
                icon={Smartphone} 
                title="Request a Service" 
                description="Tell us what you need from haircuts to home repairs. Choose your category, add service details, location, and preferred date."
                showArrow
              />
              <StepItem 
                icon={CheckCircle2} 
                title="Get Matched & Book" 
                description="Afrivendor connects you instantly with verified vendors nearby. Compare profiles, prices, and reviews, then book your choice in seconds."
                showArrow
              />
              <StepItem 
                icon={CreditCard} 
                title="Secure Payment" 
                description="Pay safely through Afrivendor's escrow system - funds are held until your service is delivered. No hidden fees. Transparent pricing."
                showArrow
              />
              <StepItem 
                icon={Smile} 
                title="Service Delivery & Review" 
                description="Your vendor arrives, completes the task, and ensures satisfaction. Rate and review to help others choose better next time."
              />
            </motion.div>
            
            {/* Mobile Image & Badge Container */}
            <div className="flex items-end justify-between mt-8 relative">
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Image src={MobilePhoneWhite} alt="Customer Mobile App" className="w-[180px] md:w-[250px] transition-transform hover:scale-[1.02] duration-500" />
                </motion.div>
                <div className="flex flex-col items-center gap-3 pb-8 md:pb-12 mr-2 md:mr-8">
                    <div className="flex items-center gap-1.5 md:gap-2">
                        <span className="text-[10px] md:text-xs font-semibold text-secondary-000">Available soon on</span>
                        <AppleAppStoreIcon />
                        <GooglePlayIcon />
                    </div>
                    <div className="bg-white p-2 rounded-xl md:rounded-2xl border border-black/5 shadow-sm">
                        <Image src={QRcode} alt="QR Code" width={100} height={100} className="rounded-lg w-16 md:w-[100px]" />
                    </div>
                </div>
            </div>
          </motion.div>

          {/* For Vendors */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true }}
            className="flex-1 bg-secondary-000 rounded-tr-[32px] rounded-br-[32px] md:rounded-tr-[56px] md:rounded-br-[56px] p-6 md:p-12 pb-0 md:pb-0 overflow-hidden"
          >
            <h3 className="font-unbounded text-xl md:text-2xl font-semibold text-secondary-800 mb-8 border-b border-white/5 pb-4">
              For Vendors
            </h3>
            <motion.div 
               variants={containerVariants}
               initial="hidden"
               whileInView="show"
               viewport={{ once: true }}
               className="space-y-1"
            >
              <StepItem 
                icon={Download} 
                title="Receive Requests" 
                description="Once customers post a request, vendors in matching categories get notified. You can view details, customer location, and project budget."
                isDark
                showArrow
              />
              <StepItem 
                icon={Calendar} 
                title="Accept & Schedule" 
                description="Accept the booking or send a custom offer. Afrivendor syncs your calendar so you never miss a client."
                isDark
                showArrow
              />
              <StepItem 
                icon={Banknote} 
                title="Deliver & Earn" 
                description="Show up, do great work, and impress your clients. Payment is automatically released once the service is confirmed complete."
                isDark
                showArrow
              />
              <StepItem 
                icon={Star} 
                title="Build Reputation" 
                description="Satisfied clients leave reviews and ratings boosting your profile visibility. The more quality work you deliver, the more you grow."
                isDark
              />
            </motion.div>

             {/* Mobile Image & Badge Container */}
             <div className="flex items-end justify-between mt-8 relative">
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4, delay: 0.5, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Image src={MobilePhoneBlack} alt="Vendor Mobile App" className="w-[180px] md:w-[250px] transition-transform hover:scale-[1.02] duration-500" />
                </motion.div>
                <div className="flex flex-col items-center gap-3 pb-8 md:pb-12 mr-2 md:mr-8">
                    <div className="flex items-center gap-1.5 md:gap-2">
                        <span className="text-[10px] md:text-xs font-semibold text-secondary-800">Available soon on</span>
                        <AppleAppStoreIcon color="#f4f3f2" />
                        <GooglePlayIcon color="#f4f3f2" />
                    </div>
                    <div className="bg-white p-2 rounded-xl md:rounded-2xl border border-black/5 shadow-sm">
                        <Image src={QRcode} alt="QR Code" width={100} height={100} className="rounded-lg w-16 md:w-[100px]" />
                    </div>
                </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
