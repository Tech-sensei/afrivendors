import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { VENDOR_VISIBILITY_COMPARISON } from "@/data/vendorSubscription";

export function VendorVisibilityComparison() {
  return (
    <section className="mx-auto max-w-7xl px-6 lg:px-12">
      <div className="mb-10 text-center">
        <p className="text-xs font-bold uppercase tracking-widest text-primary-100">
          Visibility rules
        </p>
        <h2 className="mt-2 font-unbounded text-2xl font-semibold text-secondary-000 sm:text-3xl">
          When clients can find you
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-accent-80">
          Your subscription controls whether you appear in Afrivendors search —
          not whether you can fulfil orders you have already accepted.
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {VENDOR_VISIBILITY_COMPARISON.map((col) => (
          <div
            key={col.label}
            className={cn(
              "flex flex-col rounded-2xl border p-6",
              col.visible
                ? "border-emerald-200/80 bg-emerald-50/40"
                : "border-red-200/60 bg-red-50/30"
            )}
          >
            <div className="mb-4 flex items-center justify-between gap-2">
              <p className="font-unbounded text-sm font-semibold text-secondary-000">
                {col.label}
              </p>
              <span
                className={cn(
                  "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold",
                  col.visible
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-red-100 text-red-800"
                )}
              >
                {col.visible ? (
                  <>
                    <Check className="h-3 w-3" /> Visible
                  </>
                ) : (
                  <>
                    <X className="h-3 w-3" /> Hidden
                  </>
                )}
              </span>
            </div>
            <ul className="space-y-2.5">
              {col.items.map((item) => (
                <li
                  key={item}
                  className="flex gap-2 text-sm leading-relaxed text-secondary-000/90"
                >
                  <Check
                    className={cn(
                      "mt-0.5 h-4 w-4 shrink-0",
                      col.visible ? "text-emerald-600" : "text-accent-60"
                    )}
                  />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
