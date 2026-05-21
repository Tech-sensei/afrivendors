"use client";

import type { CustomOrderTimelineEvent } from "@/types/customOrders";

export function CustomOrderTimeline({
  events,
}: {
  events: CustomOrderTimelineEvent[];
}) {
  if (events.length === 0) return null;

  return (
    <ol className="relative space-y-4 border-l border-accent-20 pl-4">
      {events.map((event, i) => (
        <li key={`${event.at}-${i}`} className="relative">
          <span className="absolute -left-[21px] top-1.5 h-2.5 w-2.5 rounded-full bg-primary-100 ring-4 ring-white" />
          <p className="text-xs text-accent-80">{event.at}</p>
          <p className="text-sm font-medium text-secondary-000">{event.label}</p>
        </li>
      ))}
    </ol>
  );
}
