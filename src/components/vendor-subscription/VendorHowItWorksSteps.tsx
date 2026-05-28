import { VENDOR_HOW_IT_WORKS } from "@/data/vendorSubscription";

export function VendorHowItWorksSteps() {
  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <div className="mb-12 max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-widest text-primary-100">
            Getting started
          </p>
          <h2 className="mt-2 font-unbounded text-2xl font-semibold text-secondary-000 sm:text-3xl">
            How the vendor journey works
          </h2>
          <p className="mt-3 text-accent-80">
            From sign-up to your first booking — and what happens when your free
            trial ends.
          </p>
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          {VENDOR_HOW_IT_WORKS.map((item, index) => (
            <div
              key={item.step}
              className="group relative overflow-hidden rounded-2xl border border-[#EFE6E1] bg-[#FAF7F5] p-6 transition-shadow hover:shadow-md sm:p-8"
            >
              <span className="font-unbounded text-5xl font-bold leading-none text-primary-100/20">
                {item.step}
              </span>
              <h3 className="mt-2 font-unbounded text-lg font-semibold text-secondary-000">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-accent-80">
                {item.body}
              </p>
              <span className="mt-4 inline-block rounded-full bg-primary-100/10 px-3 py-1 text-xs font-semibold text-primary-100">
                {item.highlight}
              </span>
              {index < VENDOR_HOW_IT_WORKS.length - 1 && (
                <div className="absolute -bottom-3 right-8 hidden h-6 w-px bg-accent-30 lg:block" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
