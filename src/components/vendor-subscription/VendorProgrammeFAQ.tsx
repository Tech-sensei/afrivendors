"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { VENDOR_SUBSCRIPTION_FAQ } from "@/data/vendorSubscription";

export function VendorProgrammeFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="mx-auto max-w-3xl px-6 lg:px-12">
      <div className="mb-10 text-center">
        <p className="text-xs font-bold uppercase tracking-widest text-primary-100">
          FAQ
        </p>
        <h2 className="mt-2 font-unbounded text-2xl font-semibold text-secondary-000">
          Vendor subscription questions
        </h2>
      </div>
      <div className="space-y-3">
        {VENDOR_SUBSCRIPTION_FAQ.map((faq, index) => {
          const open = openIndex === index;
          return (
            <div
              key={faq.question}
              className="overflow-hidden rounded-2xl border border-[#EFE6E1] bg-white shadow-sm"
            >
              <button
                type="button"
                onClick={() => setOpenIndex(open ? null : index)}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left sm:px-6"
                aria-expanded={open}
              >
                <span className="font-semibold text-secondary-000">
                  {faq.question}
                </span>
                <ChevronDown
                  className={cn(
                    "h-5 w-5 shrink-0 text-primary-100 transition-transform",
                    open && "rotate-180"
                  )}
                />
              </button>
              <div
                className={cn(
                  "grid transition-[grid-template-rows] duration-200 ease-out",
                  open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                )}
              >
                <div className="overflow-hidden">
                  <p className="border-t border-[#EFE6E1] px-5 pb-5 pt-3 text-sm leading-relaxed text-accent-80 sm:px-6">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
