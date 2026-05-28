import { CalendarClock, Eye, ShieldCheck } from "lucide-react";
import { VENDOR_TRIAL_MONTHS } from "@/data/vendorSubscription";

const perks = [
  {
    icon: Eye,
    title: "Visible from day one",
    body: "Appear in category browse and search as soon as your profile is complete.",
  },
  {
    icon: CalendarClock,
    title: `${VENDOR_TRIAL_MONTHS}-month trial`,
    body: "Trial starts at registration. No listing fee until the trial window ends.",
  },
  {
    icon: ShieldCheck,
    title: "Pay only to stay live",
    body: "After trial, choose monthly, quarterly, bi-annual, or yearly billing.",
  },
];

export function VendorTrialHighlight() {
  return (
    <section className="mx-auto max-w-7xl px-6 lg:px-12">
      <div className="overflow-hidden rounded-3xl border border-[#EFE6E1] bg-gradient-to-br from-primary-300/50 via-white to-[#FAF7F5] shadow-[0_12px_40px_rgba(35,19,5,0.06)]">
        <div className="grid lg:grid-cols-[1fr_1.2fr]">
          <div className="border-b border-[#EFE6E1] p-8 lg:border-b-0 lg:border-r lg:p-10">
            <p className="text-xs font-bold uppercase tracking-widest text-primary-100">
              New vendor offer
            </p>
            <h2 className="mt-3 font-unbounded text-2xl font-semibold leading-tight text-secondary-000 sm:text-3xl">
              {VENDOR_TRIAL_MONTHS} months free marketplace visibility
            </h2>
            <p className="mt-4 text-base leading-relaxed text-accent-80">
              Register once and your business stays discoverable while you build
              reviews and bookings. Subscription billing only begins after your
              complimentary period — you pick the cycle that fits.
            </p>
          </div>
          <div className="grid gap-px bg-[#EFE6E1] sm:grid-cols-3 lg:grid-cols-1">
            {perks.map(({ icon: Icon, title, body }) => (
              <div
                key={title}
                className="flex gap-4 bg-white p-6 lg:p-8"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-100/10">
                  <Icon className="h-5 w-5 text-primary-100" />
                </div>
                <div>
                  <p className="font-semibold text-secondary-000">{title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-accent-80">
                    {body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
