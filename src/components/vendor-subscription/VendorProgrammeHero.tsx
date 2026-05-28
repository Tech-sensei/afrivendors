"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { VENDOR_PROGRAMME_STATS, VENDOR_TRIAL_MONTHS } from "@/data/vendorSubscription";
import signUpChoiceImg from "../../../public/assets/images/signUpChoiceImg.png";

type Props = {
  onPrimaryCta: () => void;
  secondaryHref?: string;
  secondaryLabel?: string;
};

export function VendorProgrammeHero({
  onPrimaryCta,
  secondaryHref = "/pricing",
  secondaryLabel = "View billing options",
}: Props) {
  return (
    <section className="relative overflow-hidden bg-secondary-000 text-white">
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 70% 20%, rgba(197, 108, 49, 0.45) 0%, transparent 55%), radial-gradient(ellipse 50% 40% at 10% 90%, rgba(197, 108, 49, 0.2) 0%, transparent 50%)",
        }}
      />
      <div className="relative mx-auto grid max-w-7xl gap-10 px-6 py-14 sm:py-16 lg:grid-cols-2 lg:items-center lg:gap-12 lg:px-12 lg:py-24">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="order-2 lg:order-1"
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm font-medium backdrop-blur-sm">
            <Sparkles className="h-4 w-4 text-primary-300" />
            Vendor programme · UK marketplace
          </div>
          <h1 className="font-unbounded text-[clamp(32px,5vw,52px)] font-semibold leading-[1.08] tracking-tight">
            List your business.
            <span className="mt-2 block text-primary-300">
              {VENDOR_TRIAL_MONTHS} months free.
            </span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/80">
            Join Afrivendors to take bookings, respond to custom requests, and get
            paid through wallet & escrow — with full marketplace visibility from day
            one, no subscription fee for your first six months.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button
              type="button"
              onClick={onPrimaryCta}
              className="h-12 rounded-full bg-primary-100 px-7 text-base font-semibold text-white hover:bg-primary-100/90"
            >
              Create vendor account
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="outline"
              className="h-12 rounded-full border-white/30 bg-transparent px-7 text-base font-semibold text-white hover:bg-white/10"
              asChild
            >
              <Link href={secondaryHref}>{secondaryLabel}</Link>
            </Button>
          </div>
          <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
            {VENDOR_PROGRAMME_STATS.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-white/15 bg-white/5 px-4 py-3 backdrop-blur-sm"
              >
                <p className="font-unbounded text-xl font-semibold text-primary-300 sm:text-2xl">
                  {stat.value}
                </p>
                <p className="mt-0.5 text-[11px] font-medium leading-snug text-white/70 sm:text-xs">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.08 }}
          className="order-1 lg:order-2"
        >
          <div className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-[28px] border border-white/15 shadow-2xl sm:max-w-lg lg:mx-0 lg:max-h-[520px] lg:max-w-none">
            <Image
              src={signUpChoiceImg}
              alt="Vendor growing their business on Afrivendors"
              fill
              className="object-cover object-top"
              sizes="(max-width: 1024px) 90vw, 480px"
              priority
              placeholder="blur"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-secondary-000/85 via-secondary-000/10 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
              <p className="font-unbounded text-base font-semibold sm:text-lg">
                Built for African service professionals
              </p>
              <p className="mt-2 text-sm leading-relaxed text-white/80">
                Hair, beauty, catering, cleaning & more — reach clients who are
                already searching in your area.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
