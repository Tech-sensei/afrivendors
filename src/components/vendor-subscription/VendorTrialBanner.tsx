import { Gift } from "lucide-react";
import { VENDOR_TRIAL_MONTHS } from "@/data/vendorSubscription";

export function VendorTrialBanner() {
  return (
    <div className="rounded-2xl border border-primary-100/30 bg-primary-300/40 px-5 py-4 sm:flex sm:items-center sm:gap-4">
      <div className="mb-3 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-100 sm:mb-0">
        <Gift className="h-5 w-5 text-white" />
      </div>
      <div>
        <p className="font-unbounded text-base font-semibold text-secondary-000">
          {VENDOR_TRIAL_MONTHS} months free for new vendors
        </p>
        <p className="mt-1 text-sm text-accent-80">
          Register today and your business stays visible in search for six months
          at no cost. After that, pick a billing cycle that suits you.
        </p>
      </div>
    </div>
  );
}
