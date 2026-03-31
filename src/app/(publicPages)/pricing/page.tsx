"use client";

import { useRouter } from "next/navigation";
import { Check, ArrowRight, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "motion/react";
import svgPaths from "@/lib/svgPath4";
import type { PricingCardProps } from "@/types/misc";

function PricingCard({ title, price, period, description, features, isPopular, buttonText, onButtonClick }: PricingCardProps) {
  return (
    <div
      className={`p-8 bg-white border rounded-2xl relative transition-all duration-200 ease-out hover:-translate-y-1 ${
        isPopular
          ? "border-primary-100 border-2 shadow-[0_4px_12px_rgba(35,19,5,0.08)] hover:shadow-[0_8px_24px_rgba(35,19,5,0.12)]"
          : "border-accent-30 shadow-[0_2px_8px_rgba(35,19,5,0.06)] hover:shadow-[0_4px_12px_rgba(35,19,5,0.08)]"
      }`}
    >
      {/* Popular Badge */}
      {isPopular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-primary-100 rounded-lg">
          <span className=" text-sm leading-5 font-semibold text-white">Most Popular</span>
        </div>
      )}

      {/* Title */}
      <h3 className={`font-unbounded text-[28px] leading-8 font-semibold text-secondary-000 mb-2 ${isPopular ? "mt-3" : ""}`}>{title}</h3>

      {/* Description */}
      <p className=" text-base leading-6 text-accent-80 mb-6">{description}</p>

      {/* Price */}
      <div className="mb-8">
        <div className="flex items-baseline gap-2">
          <span className="font-unbounded text-5xl leading-14 font-semibold text-secondary-000">{price}</span>
          <span className=" text-lg leading-6 text-accent-80">{period}</span>
        </div>
      </div>

      {/* Features */}
      <ul className="mb-8 flex flex-col gap-4">
        {features.map((feature, index) => (
          <li key={index} className="flex gap-3 items-start">
            <Check className="w-5 h-5 text-primary-100 shrink-0 mt-0.5" />
            <span className=" text-base leading-6 text-secondary-000">{feature}</span>
          </li>
        ))}
      </ul>

      {/* Button */}
      <Button
        onClick={onButtonClick}
        className={`w-full h-14 flex items-center justify-center gap-2 rounded-xl transition-all duration-200 ease-out hover:opacity-90 active:scale-[0.98] ${
          isPopular
            ? "bg-primary-100 text-white hover:bg-primary-100/90"
            : "bg-transparent border border-accent-30 text-secondary-000 hover:bg-accent-10"
        }`}
      >
        <span className=" text-base leading-5 font-semibold">{buttonText}</span>
        <ArrowRight className="w-[18px] h-[18px]" />
      </Button>
    </div>
  );
}

const PricingPage = () => {
  const router = useRouter();

  const handleGetStarted = (plan: string) => {
    router.push("/sign-up?type=vendor");
  };

  const pricingPlans = [
    {
      title: "Free",
      price: "$0",
      period: "/month",
      description: "Perfect for trying out our platform",
      features: [
        "Basic vendor profile",
        "Up to 5 service listings",
        "Accept bookings",
        "Basic calendar management",
        "20% platform commission",
        "Email support",
      ],
      buttonText: "Get Started Free",
    },
    {
      title: "Professional",
      price: "$29",
      period: "/month",
      description: "For established vendors looking to grow",
      features: [
        "Enhanced vendor profile",
        "Unlimited service listings",
        "Advanced calendar & scheduling",
        "15% platform commission",
        "Priority customer support",
        "Analytics & insights",
        "Custom booking page",
        "Marketing tools",
      ],
      isPopular: true,
      buttonText: "Start Free Trial",
    },
    {
      title: "Enterprise",
      price: "$99",
      period: "/month",
      description: "For large businesses with multiple locations",
      features: [
        "Everything in Professional",
        "Multi-location management",
        "10% platform commission",
        "Dedicated account manager",
        "API access",
        "Advanced analytics",
        "Custom integrations",
        "White-label options",
        "Priority listing placement",
      ],
      buttonText: "Contact Sales",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="flex flex-col min-h-screen bg-accent-10"
    >
      {/* Hero Section */}
      <div className="flex flex-col items-center text-center py-16 md:py-20 px-6 sm:px-8 lg:px-24 bg-white">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1, ease: "easeOut" }}
          className="flex flex-col items-center w-full"
        >
          {/* Hero Header Image */}
          <div className="mb-8 w-full max-w-4xl px-4 sm:px-6 md:px-8 lg:px-0">
            <div className="w-full max-w-full overflow-hidden">
              <div className="content-stretch flex flex-col gap-2 items-center relative w-full" data-name="Home-Hero-Header">
                <p className="font-unbounded font-medium leading-[normal] w-full relative shrink-0 text-center text-[#562A03] text-[clamp(28px,8vw,80px)] tracking-[-0.06em]">
                  {` Simple `}
                </p>
                <div className="relative shrink-0 w-full h-auto max-w-[clamp(320px, 90vw, 918px)] aspect-[918 / 117.999]">
                  <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 918 118">
                    <g id="pricing">
                      <g id="pricing_2">
                        <path d={svgPaths.peac54c0} fill="var(--fill-0, #C56C31)" />
                        <path d={svgPaths.p25396800} fill="var(--fill-0, #C56C31)" />
                        <path d={svgPaths.p3ba53880} fill="var(--fill-0, #C56C31)" />
                        <path d={svgPaths.p31221380} fill="var(--fill-0, #C56C31)" />
                        <path d={svgPaths.p39854900} fill="var(--fill-0, #C56C31)" />
                        <path d={svgPaths.p140bad00} fill="var(--fill-0, #C56C31)" />
                        <path clipRule="evenodd" d={svgPaths.p140fb780} fill="var(--fill-0, #C56C31)" fillRule="evenodd" />
                      </g>
                    </g>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Sub-heading */}
          <p className="max-w-4xl sm:px-0 text-secondary-100 text-[clamp(16px,2vw,20px)] leading-[1.6]">
            Choose the plan that's right for your business. All plans include a 14-day free trial.
          </p>
        </motion.div>
      </div>

      {/* Pricing Cards */}
      <div className="py-16 md:py-20 px-6 sm:px-8 lg:px-24 bg-[#f9f5f2]">
        <div className="max-w-[1140px] mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {pricingPlans.map((plan, index) => (
              <PricingCard key={index} {...plan} onButtonClick={() => handleGetStarted(plan.title)} />
            ))}
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="py-16 px-6 sm:px-8 lg:px-24 bg-white border-t border-accent-30">
        <div className="max-w-[800px] mx-auto">
          <h2 className="font-unbounded text-[clamp(32px,3.5vw,40px)] leading-[110%] font-semibold text-secondary-000 mb-12 text-center">
            Frequently Asked Questions
          </h2>

          <div className="flex flex-col gap-6">
            {[
              {
                question: "Is there a free trial?",
                answer: "Yes! All paid plans come with a 14-day free trial. No credit card required to start.",
              },
              {
                question: "What is the platform commission?",
                answer:
                  "Platform commission varies by plan: 20% for Free, 15% for Professional, and 10% for Enterprise. This covers payment processing, platform maintenance, and customer support.",
              },
              {
                question: "Can I change plans later?",
                answer:
                  "Absolutely! You can upgrade or downgrade your plan at any time. Changes take effect immediately, and we'll prorate any differences.",
              },
              {
                question: "What payment methods do you accept?",
                answer:
                  "We accept all major credit cards (Visa, Mastercard, American Express), debit cards, and bank transfers for Enterprise plans.",
              },
              {
                question: "Is there a setup fee?",
                answer:
                  "No setup fees! You only pay the monthly subscription fee for your chosen plan. The Free plan is completely free to use forever.",
              },
              {
                question: "Can I cancel anytime?",
                answer:
                  "Yes, you can cancel your subscription at any time. Your service will continue until the end of your current billing period.",
              },
            ].map((faq, index) => (
              <div key={index} className="p-6 bg-[#f9f5f2] rounded-xl border border-accent-30">
                <div className="flex gap-4">
                  <HelpCircle className="w-6 h-6 text-primary-100 shrink-0 mt-0.5" />
                  <div>
                    <h4 className=" text-lg leading-6 font-bold text-secondary-000 mb-2">{faq.question}</h4>
                    <p className=" text-base leading-6 text-accent-80">{faq.answer}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 px-6 sm:px-8 lg:px-24 text-center bg-[#f9f5f2]">
        <div className="max-w-[700px] mx-auto">
          <h2 className="font-unbounded text-[clamp(28px,3vw,36px)] leading-[110%] font-semibold text-secondary-000 mb-4">
            Still have questions?
          </h2>
          <p className=" text-lg leading-7 text-accent-80 mb-8">Our team is here to help you choose the right plan for your business.</p>
          <Button
            onClick={() => router.push("/contact-us")}
            className="h-14 px-8 inline-flex items-center gap-2 bg-primary-100 text-white hover:bg-primary-100/90 rounded-xl transition-all duration-200 ease-out hover:opacity-90 active:scale-[0.98]"
          >
            <span className=" text-base leading-5 font-semibold">Contact Sales</span>
            <ArrowRight className="w-[18px] h-[18px]" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default PricingPage;
