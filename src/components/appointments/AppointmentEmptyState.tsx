"use client";

import type { LucideIcon } from "lucide-react";
import {
  Calendar,
  CalendarCheck,
  CalendarX,
  Clock,
} from "lucide-react";

export type AppointmentEmptyTabId =
  | "pending"
  | "upcoming"
  | "completed"
  | "cancelled";

const TAB_CONFIG: Record<
  AppointmentEmptyTabId,
  { icon: LucideIcon; title: string; body: string }
> = {
  pending: {
    icon: Clock,
    title: "No pending appointments",
    body: "When you book a service, requests awaiting vendor approval will show here.",
  },
  upcoming: {
    icon: Calendar,
    title: "No upcoming appointments",
    body: "Accepted bookings with a scheduled date and time appear in this tab.",
  },
  completed: {
    icon: CalendarCheck,
    title: "No completed appointments",
    body: "After your service is done, you can release funds or open a dispute from here.",
  },
  cancelled: {
    icon: CalendarX,
    title: "No cancelled appointments",
    body: "Appointments you or the vendor cancelled are listed here.",
  },
};

type Props = {
  tab: AppointmentEmptyTabId;
};

export function AppointmentEmptyState({ tab }: Props) {
  const { icon: Icon, title, body } = TAB_CONFIG[tab];

  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-primary-300/25 bg-primary-300/30 px-6 py-16 text-center">
      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-primary-100/10 ring-1 ring-primary-100/15">
        <Icon className="h-8 w-8 text-primary-100" strokeWidth={1.75} />
      </div>
      <h3 className="font-unbounded text-lg font-semibold text-secondary-000">
        {title}
      </h3>
      <p className="mt-2 max-w-sm text-sm leading-relaxed text-accent-80">
        {body}
      </p>
    </div>
  );
}
