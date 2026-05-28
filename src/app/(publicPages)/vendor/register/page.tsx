"use client";

import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { VendorProgrammeHero } from "@/components/vendor-subscription/VendorProgrammeHero";
import { VendorTrialHighlight } from "@/components/vendor-subscription/VendorTrialHighlight";
import { VendorVisibilityComparison } from "@/components/vendor-subscription/VendorVisibilityComparison";
import { VendorHowItWorksSteps } from "@/components/vendor-subscription/VendorHowItWorksSteps";
import { VendorBillingPlans } from "@/components/vendor-subscription/VendorBillingPlans";
import { VendorProgrammeFAQ } from "@/components/vendor-subscription/VendorProgrammeFAQ";
import { VENDOR_TRIAL_MONTHS, type VendorBillingIntervalId } from "@/data/vendorSubscription";
import { getVendorAppUrl } from "@/lib/vendorAppUrl";

export default function VendorRegisterPage() {
  const goToVendorSignUp = (intervalId?: VendorBillingIntervalId) => {
    const path = intervalId ? `/sign-up?plan=${intervalId}` : "/sign-up";
    window.location.href = getVendorAppUrl(path);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-[#FAF7F5]"
    >
      <VendorProgrammeHero onPrimaryCta={() => goToVendorSignUp()} />

      <div className="space-y-20 py-16 sm:py-20">
        <VendorTrialHighlight />

        <VendorVisibilityComparison />

        <section className="mx-auto max-w-7xl px-6 lg:px-12">
          <VendorBillingPlans
            onSelectPlan={goToVendorSignUp}
            ctaLabel="Register free"
            title="Plans after your free trial"
            subtitle={`You won't pay anything for ${VENDOR_TRIAL_MONTHS} months. These are the cycles you can choose when your trial ends.`}
          />
        </section>

        <VendorHowItWorksSteps />

        <VendorProgrammeFAQ />
      </div>

      <section className="relative overflow-hidden bg-primary-100 px-6 py-16 text-center sm:px-8">
        <div
          className="pointer-events-none absolute inset-0 opacity-30"
          style={{
            background:
              "radial-gradient(circle at 30% 50%, rgba(255,255,255,0.25) 0%, transparent 50%)",
          }}
        />
        <div className="relative mx-auto max-w-2xl">
          <h2 className="font-unbounded text-2xl font-semibold text-white sm:text-3xl">
            Ready to grow with Afrivendors?
          </h2>
          <p className="mt-4 text-white/85">
            Create your vendor account in minutes. {VENDOR_TRIAL_MONTHS} months of
            visibility on us.
          </p>
          <Button
            type="button"
            onClick={() => goToVendorSignUp()}
            className="mt-8 h-12 rounded-full bg-white px-8 font-semibold text-primary-100 hover:bg-white/95"
          >
            Get started free
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </section>
    </motion.div>
  );
}
