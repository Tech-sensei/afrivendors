"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, ChevronRight } from "lucide-react";
import { format, parseISO } from "date-fns";
import Image from "next/image";
import {
  type AppointmentCardProps,
  isAppointmentDisputed,
  isAppointmentFundsReleased,
} from "@/types/appointments";
import { formatVendorPrice } from "@/services/vendor";

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&auto=format&fit=crop";

export function AppointmentCard({
  appointment,
  onViewDetails,
}: AppointmentCardProps) {
  const fundsReleased = isAppointmentFundsReleased(appointment);
  const disputed = isAppointmentDisputed(appointment);

  const vendorName = `${appointment.vendor.firstName} ${appointment.vendor.lastName}`;
  const primaryService = appointment.services[0];
  const serviceImage = primaryService?.imageUrl || FALLBACK_IMAGE;

  const displayServiceName =
    appointment.services.length === 1
      ? primaryService.serviceName
      : `${primaryService.serviceName} +${appointment.services.length - 1} more`;

  const displayTime = appointment.time.slice(0, 5);
  const totalDuration = appointment.services.map((s) => s.duration).join(" + ");

  const openDetails = () => onViewDetails(appointment);

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "confirmed":
      case "accepted":
        return "text-green-700 bg-green-100";
      case "pending":
        return "text-amber-700 bg-amber-100";
      case "cancelled":
      case "canceled":
      case "rejected":
        return "text-red-700 bg-red-100";
      case "completed":
      default:
        return "text-slate-700 bg-slate-100";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "pending":
        return "Pending";
      case "confirmed":
        return "Confirmed";
      case "accepted":
        return "Accepted";
      case "completed":
        return "Completed";
      case "cancelled":
      case "canceled":
        return "Cancelled";
      case "rejected":
        return "Rejected";
      default:
        return status;
    }
  };

  return (
    <Card
      className="group flex h-full w-full cursor-pointer flex-col overflow-hidden rounded-2xl border border-[#EFE6E1] bg-white py-0 shadow-[0_4px_12px_rgba(35,19,5,0.08)] transition-all duration-300 hover:shadow-[0_8px_24px_rgba(35,19,5,0.1)]"
      onClick={openDetails}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openDetails();
        }
      }}
      role="button"
      tabIndex={0}
    >
      <div className="relative h-56 w-full shrink-0 overflow-hidden bg-primary-300">
        <Image
          src={serviceImage}
          alt={displayServiceName}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-60" />
        <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between gap-2">
          <Badge
            variant="secondary"
            className={`border-0 bg-white/90 px-3 py-1 text-xs font-semibold uppercase tracking-wider backdrop-blur-md ${getStatusStyle(appointment.status)}`}
          >
            {getStatusLabel(appointment.status)}
          </Badge>
          {disputed ? (
            <Badge className="border-0 bg-amber-600/90 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md">
              Dispute
            </Badge>
          ) : fundsReleased ? (
            <Badge className="border-0 bg-slate-700/90 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md">
              Released
            </Badge>
          ) : appointment.paymentStatus === "paid" ? (
            <Badge className="border-0 bg-green-600/90 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md">
              Paid
            </Badge>
          ) : null}
        </div>
      </div>

      <CardContent className="flex flex-1 flex-col gap-4 p-5">
        <div className="space-y-2.5">
          <div className="flex items-start justify-between gap-3">
            <h3 className="line-clamp-2 font-unbounded text-base font-semibold leading-snug text-secondary-000">
              {displayServiceName}
            </h3>
            <span className="shrink-0 text-base font-bold text-primary-100">
              {formatVendorPrice(appointment.totalAmount)}
            </span>
          </div>

          <p className="line-clamp-1 text-sm text-accent-80">{vendorName}</p>

          <div className="flex flex-col gap-1.5 text-sm text-accent-100">
            <div className="flex items-center gap-2.5">
              <Calendar className="h-4 w-4 stroke-[1.5]" />
              <span>{format(parseISO(appointment.date), "MMMM d, yyyy")}</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Clock className="h-4 w-4 stroke-[1.5]" />
              <span>
                {displayTime} • {totalDuration}
              </span>
            </div>
          </div>
        </div>

        <p className="mt-auto flex items-center justify-center gap-1 pt-1 text-sm font-semibold text-primary-100">
          View details
          <ChevronRight className="h-4 w-4" />
        </p>
      </CardContent>
    </Card>
  );
}
