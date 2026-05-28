"use client";

import { Clock } from "lucide-react";
import type { VendorOpeningHoursDay } from "@/types/vendor";

const WEEKDAY_KEYS = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
] as const;

function getTodayDayKey(): string {
  return WEEKDAY_KEYS[new Date().getDay()];
}

interface VendorOpeningHoursProps {
  schedule: VendorOpeningHoursDay[];
  /** Shown when the schedule is empty (e.g. API returned no rows). */
  fallbackText?: string;
  /** `embedded` drops the outer card chrome when nested in another panel. */
  variant?: "card" | "embedded";
}

export function VendorOpeningHours({
  schedule,
  fallbackText,
  variant = "card",
}: VendorOpeningHoursProps) {
  const todayKey = getTodayDayKey();

  const shellClass =
    variant === "embedded"
      ? "overflow-hidden rounded-xl border border-accent-20 bg-white"
      : "overflow-hidden rounded-xl border border-accent-20 bg-primary-300/5";

  if (!schedule.length) {
    return (
      <div
        className={
          variant === "embedded"
            ? "rounded-xl border border-accent-20 bg-[#FAF7F5] px-4 py-3"
            : "rounded-xl border border-accent-20 bg-primary-300/10 px-4 py-3"
        }
      >
        <p className="text-sm text-secondary-000">
          {fallbackText?.trim() || "Hours unavailable"}
        </p>
      </div>
    );
  }

  return (
    <div className={shellClass}>
      <div className="border-b border-accent-20 bg-primary-300/10 px-4 py-3">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-primary-100" />
          <span className="text-sm font-semibold text-secondary-000">Weekly schedule</span>
        </div>
      </div>
      <ul className="divide-y divide-accent-20">
        {schedule.map((row) => {
          const isToday = row.dayKey === todayKey;
          return (
            <li
              key={row.dayKey}
              className={`flex items-center justify-between gap-4 px-4 py-2.5 text-sm ${
                isToday ? "bg-primary-100/10" : ""
              }`}
            >
              <span
                className={`flex flex-wrap items-center gap-x-2 gap-y-1 font-medium ${
                  isToday ? "text-primary-100" : "text-secondary-000"
                }`}
              >
                {row.dayLabel}
                {isToday && (
                  <span className="rounded-full bg-primary-100/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary-100">
                    Today
                  </span>
                )}
              </span>
              <span
                className={`shrink-0 text-right tabular-nums ${
                  row.isOpen ? "text-secondary-000" : "text-accent-80"
                }`}
              >
                {row.hoursLine}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
