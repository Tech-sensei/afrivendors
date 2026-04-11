/** Shared Tailwind classes for custom service form fields (matches dashboard patterns). */
export const formField = {
  label: "mb-2 block text-sm font-semibold text-secondary-100",
  labelInline: "text-sm font-medium text-secondary-000 cursor-pointer",
  input:
    "h-12 rounded-xl border-accent-20 bg-white text-sm text-secondary-000 placeholder:text-accent-60 md:text-sm focus-visible:border-primary-100 focus-visible:ring-primary-100/20",
  selectTrigger:
    "h-12 rounded-xl border-accent-20 bg-white text-sm text-secondary-000 md:text-sm focus-visible:border-primary-100 focus-visible:ring-primary-100/20",
  textarea:
    "min-h-[120px] rounded-xl border-accent-20 bg-white text-sm text-secondary-000 placeholder:text-accent-60 md:text-sm focus-visible:border-primary-100 focus-visible:ring-primary-100/20",
  hint: "mt-2 text-xs leading-relaxed text-accent-80",
  sectionMuted: "text-xs uppercase tracking-wide text-accent-80",
  body: "text-sm text-secondary-000",
  bodyMuted: "text-sm text-accent-80",
} as const;
