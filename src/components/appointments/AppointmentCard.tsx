"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MessageCircle, Eye, PenLine, RotateCcw } from "lucide-react";
import { format, parseISO } from "date-fns";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  type AppointmentCardProps,
  isActiveBookingStatus,
  isBookAgainStatus,
} from "@/types/appointments";
import { formatVendorPrice } from "@/services/vendor";

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&auto=format&fit=crop";

export function AppointmentCard({
  appointment,
  onViewDetails,
  onReschedule,
  onMessageVendor,
}: AppointmentCardProps) {
  const router = useRouter();

  const isActive = isActiveBookingStatus(appointment.status);
  const isBookAgain = isBookAgainStatus(appointment.status);

  const vendorName = `${appointment.vendor.firstName} ${appointment.vendor.lastName}`;
  const primaryService = appointment.services[0];
  const serviceImage = primaryService?.imageUrl || FALLBACK_IMAGE;

  const displayServiceName =
    appointment.services.length === 1
      ? primaryService.serviceName
      : `${primaryService.serviceName} +${appointment.services.length - 1} more`;

  // "15:00:00" → "15:00"
  const displayTime = appointment.time.slice(0, 5);

  const totalDuration = appointment.services.map((s) => s.duration).join(" + ");

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
    <Card className="w-full overflow-hidden border-0 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_-2px_rgba(0,0,0,0.1)] transition-all duration-300 group rounded-[2rem] bg-white py-0">
      {/* Image */}
      <div className="relative h-64 w-full bg-primary-300 rounded-t-[2rem] overflow-hidden">
        <Image
          src={serviceImage}
          alt={displayServiceName}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-60" />
        <div className="absolute bottom-4 left-5 right-5 flex justify-between items-end">
          <Badge
            variant="secondary"
            className={`backdrop-blur-md bg-white/90 border-0 px-3 py-1 text-xs font-semibold uppercase tracking-wider ${getStatusStyle(appointment.status)}`}
          >
            {getStatusLabel(appointment.status)}
          </Badge>
          {appointment.paymentStatus === "paid" && (
            <Badge className="bg-green-600/90 text-white border-0 px-3 py-1 text-xs font-semibold backdrop-blur-md">
              Paid
            </Badge>
          )}
        </div>
      </div>

      <CardContent className="px-4 py-2 space-y-6">
        {/* Header */}
        <div className="space-y-3">
          <div className="flex justify-between items-start gap-4">
            <h3 className="font-bold text-xl leading-tight text-secondary-000 line-clamp-2 font-unbounded">
              {displayServiceName}
            </h3>
            <span className="text-xl font-bold text-primary-100 shrink-0">
              {formatVendorPrice(appointment.totalAmount)}
            </span>
          </div>

          <div className="text-sm text-secondary-000/80">{vendorName}</div>

          <div className="flex flex-col gap-2 text-sm text-accent-100 pt-1">
            <div className="flex items-center gap-2.5">
              <Calendar className="h-4 w-4 stroke-[1.5]" />
              <span>{format(parseISO(appointment.date), "MMMM d, yyyy")}</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Clock className="h-4 w-4 stroke-[1.5]" />
              <span>{displayTime} • {totalDuration}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3 pt-2">
          <Button
            className="w-full gap-2 bg-primary-100 hover:bg-[#a65620] text-white font-semibold h-11 rounded-xl shadow-lg shadow-primary-100/20 tracking-wide transition-all active:scale-[0.98] cursor-pointer"
            onClick={() =>
              isBookAgain
                ? router.push(`/categories/${appointment.vendor.id}`)
                : onMessageVendor?.(appointment)
            }
          >
            {isBookAgain ? <RotateCcw className="h-4 w-4" /> : <MessageCircle className="h-4 w-4" />}
            {isBookAgain ? "Book Again" : "Message Vendor"}
          </Button>

          {isActive && (
            <Button
              variant="outline"
              className="w-full gap-2 h-11 rounded-xl border-border/60 hover:bg-primary-300/50 hover:text-secondary-000 hover:border-border font-medium text-accent-100 font-semibold transition-all active:scale-[0.98] cursor-pointer"
              onClick={() => onReschedule(appointment)}
            >
              <PenLine className="h-4 w-4" />
              Reschedule
            </Button>
          )}

          <Button
            variant="ghost"
            className="w-full gap-2 h-11 rounded-xl hover:bg-primary-300/50 text-accent-100 font-semibold transition-all cursor-pointer"
            onClick={() => onViewDetails(appointment)}
          >
            <Eye className="h-4 w-4" />
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
