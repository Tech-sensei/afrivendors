"use client";

import type { VendorDetail } from "@/types/vendor";
import { VendorOpeningHours } from "@/components/views/VendorOpeningHours";

type Props = {
  vendor: VendorDetail;
};

export function VendorAboutTab({ vendor }: Props) {
  return (
    <div className="overflow-hidden rounded-2xl border border-accent-20 bg-white shadow-sm">
      <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[minmax(0,38%)_minmax(0,1fr)] lg:gap-10">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-primary-100">
            About us
          </p>
          <p className="mt-3 max-w-md text-base leading-[1.75] text-secondary-000 sm:text-[17px]">
            {vendor.about}
          </p>
        </div>

        <div className="lg:border-l lg:border-accent-20 lg:pl-10">
          <p className="mb-4 text-xs font-bold uppercase tracking-widest text-primary-100">
            Opening hours
          </p>
          <VendorOpeningHours
            schedule={vendor.openingHoursSchedule}
            fallbackText={vendor.openingHours}
            variant="embedded"
          />
        </div>
      </div>
    </div>
  );
}
