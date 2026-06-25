"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import svgPaths from "@/lib/svgPath4";
import { VendorTrialHighlight } from "@/components/vendor-subscription/VendorTrialHighlight";
import { VendorVisibilityComparison } from "@/components/vendor-subscription/VendorVisibilityComparison";
import { VendorBillingPlans } from "@/components/vendor-subscription/VendorBillingPlans";
import { VendorProgrammeFAQ } from "@/components/vendor-subscription/VendorProgrammeFAQ";
import { VENDOR_TRIAL_MONTHS } from "@/data/vendorSubscription";
import { getVendorAppUrl } from "@/lib/vendorAppUrl";

const PricingPage = () => {
  const goToVendorDashboard = () => {
    window.location.href = getVendorAppUrl();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="min-h-screen bg-[#FAF7F5]"
    >
      <section className="bg-white px-6 py-14 sm:px-8 lg:px-24 lg:py-20">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto flex max-w-4xl flex-col items-center text-center"
        >
          <div className="mb-8 w-full max-w-3xl">
            <div className="relative mx-auto h-auto w-full max-w-[min(100%,918px)] aspect-[918/118]">
              <svg
                className="block size-full"
                fill="none"
                preserveAspectRatio="none"
                viewBox="0 0 918 118"
                aria-hidden
              >
                <g>
                  <path d={svgPaths.peac54c0} fill="#C56C31" />
                  <path d={svgPaths.p25396800} fill="#C56C31" />
                  <path d={svgPaths.p3ba53880} fill="#C56C31" />
                  <path d={svgPaths.p31221380} fill="#C56C31" />
                  <path d={svgPaths.p39854900} fill="#C56C31" />
                  <path d={svgPaths.p140bad00} fill="#C56C31" />
                  <path
                    clipRule="evenodd"
                    d={svgPaths.p140fb780}
                    fill="#C56C31"
                    fillRule="evenodd"
                  />
                </g>
              </svg>
            </div>
          </div>
          <p className="mb-2 text-xs font-bold uppercase tracking-widest text-primary-100">
            Vendor subscription
          </p>
          <h1 className="font-unbounded text-[clamp(28px,4vw,40px)] font-semibold leading-tight text-secondary-000">
            Simple pricing after your free trial
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-accent-80">
            <span className="font-semibold text-secondary-000">
              {VENDOR_TRIAL_MONTHS} months free
            </span>{" "}
            when you register, then pick monthly, 3-month, 6-month, or yearly
            billing to stay visible to clients.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button
              type="button"
              onClick={goToVendorDashboard}
              className="h-12 rounded-full bg-primary-100 px-6 font-semibold text-white hover:bg-primary-100/90"
            >
              Start free trial
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="outline"
              className="h-12 rounded-full border-accent-30 px-6"
              asChild
            >
              <Link href="/vendor/register">Full programme overview</Link>
            </Button>
          </div>
        </motion.div>
      </section>

      <div className="space-y-16 py-12 sm:py-16">
        <VendorTrialHighlight />

        <VendorVisibilityComparison />

        <section className="px-6 sm:px-8 lg:px-24">
          <div className="mx-auto max-w-6xl">
            <VendorBillingPlans
              onSelectPlan={goToVendorDashboard}
              ctaLabel="Register free"
              showFeatures
            />
          </div>
        </section>

        <VendorProgrammeFAQ />
      </div>

      <section className="border-t border-[#EFE6E1] bg-white px-6 py-14 text-center sm:px-8 lg:px-24">
        <p className="font-unbounded text-xl font-semibold text-secondary-000">
          Questions about selling on Afrivendors?
        </p>
        <Button
          type="button"
          variant="outline"
          className="mt-6 h-11 rounded-full border-accent-30"
          onClick={() => (window.location.href = "/contact-us")}
        >
          Contact our team
        </Button>
      </section>
    </motion.div>
  );
};

export default PricingPage;
