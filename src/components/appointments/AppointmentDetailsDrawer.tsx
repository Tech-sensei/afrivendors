"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";
import {
  Calendar, Clock, MapPin, MessageCircle, PenLine,
  ExternalLink, RotateCcw, CreditCard, Loader2,
} from "lucide-react";
import { format, parseISO } from "date-fns";
import http from "@/lib/http";
import { useCancelAppointment } from "@/services/useAppointments";
import {
  type Appointment,
  type AppointmentDetailsDrawerProps,
  isActiveBookingStatus,
  isBookAgainStatus,
  normalizeAppointmentStatus,
} from "@/types/appointments";
import { formatVendorPrice } from "@/services/vendor";

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function SkeletonLine({ w = "w-full", h = "h-4" }: { w?: string; h?: string }) {
  return <div className={`${w} ${h} rounded-lg bg-secondary-700 animate-pulse`} />;
}

function DetailsSkeleton() {
  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6">
      {/* Vendor */}
      <div className="flex items-start gap-4">
        <div className="h-16 w-16 rounded-xl bg-secondary-700 animate-pulse shrink-0" />
        <div className="flex-1 space-y-2 pt-1">
          <SkeletonLine w="w-3/4" h="h-5" />
          <SkeletonLine w="w-1/2" />
        </div>
      </div>
      <Separator />
      {/* Services */}
      <div className="space-y-3">
        <SkeletonLine w="w-1/4" />
        <SkeletonLine />
        <SkeletonLine />
        <SkeletonLine w="w-2/3" />
      </div>
      <Separator />
      {/* Date & Time */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2"><SkeletonLine w="w-1/2" /><SkeletonLine w="w-3/4" /></div>
        <div className="space-y-2"><SkeletonLine w="w-1/2" /><SkeletonLine w="w-1/2" /></div>
      </div>
      {/* Payment */}
      <div className="space-y-2">
        <SkeletonLine w="w-1/4" />
        <SkeletonLine w="w-1/2" />
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function AppointmentDetailsDrawer({
  appointment,
  isOpen,
  onClose,
  onReschedule,
  onMessageVendor,
}: AppointmentDetailsDrawerProps) {
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const { mutate: cancelAppointment, isPending: isCancelling } = useCancelAppointment();

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    if (!isOpen) setShowCancelConfirm(false);
  }, [isOpen]);

  // Fetch full detail when drawer is open
  const { data: detail, isLoading } = useQuery<Appointment>({
    queryKey: ["appointment-detail", appointment?.id],
    queryFn: async () => {
      const { data } = await http.get(`/users/appointments/${appointment!.id}`);
      const row = (data?.data ?? data) as Appointment;
      return {
        ...row,
        status: normalizeAppointmentStatus(String(row.status)),
      };
    },
    enabled: isOpen && !!appointment?.id,
    staleTime: 30_000,
  });

  // Use fetched detail if ready, else fall back to the list-level prop
  const appt = detail ?? appointment;

  if (!isOpen && !appt) return null;

  const isActive =
    appt?.status !== undefined && isActiveBookingStatus(appt.status);
  const isBookAgain =
    appt?.status !== undefined && isBookAgainStatus(appt.status);

  const vendorName  = appt ? `${appt.vendor.firstName} ${appt.vendor.lastName}` : "";
  const displayTime = appt?.time?.slice(0, 5) ?? "";

  const paymentMethodLabel =
    appt?.paymentMethod === "online" ? "Paid Online" : "Wallet";

  const paymentStatusStyle =
    appt?.paymentStatus === "paid"   ? "bg-green-100 text-green-700" :
    appt?.paymentStatus === "failed" ? "bg-red-100 text-red-700"     :
                                       "bg-amber-100 text-amber-700";

  return (
    <>
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent
        side={isMobile ? "bottom" : "right"}
        className={`w-full sm:max-w-md flex flex-col border-0 p-0 overflow-hidden ${
          isMobile ? "rounded-t-3xl max-h-[85vh]" : "rounded-l-3xl rounded-tr-none h-full"
        }`}
      >
        {/* Header */}
        <SheetHeader className="px-6 py-4 border-b flex flex-row items-center justify-between bg-background shrink-0">
          <SheetTitle className="text-xl font-bold font-unbounded text-secondary-000">
            Appointment Details
          </SheetTitle>
          {isLoading && <Loader2 className="h-4 w-4 animate-spin text-primary-100" />}
        </SheetHeader>

        {/* Body */}
        {isLoading ? (
          <DetailsSkeleton />
        ) : appt ? (
          <div className="flex-1 overflow-y-auto p-6 space-y-6">

            {/* Vendor */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-secondary-000">Vendor</h4>
              <div className="flex items-start gap-4">
                <div className="relative h-16 w-16 rounded-xl overflow-hidden shrink-0 border border-border/50 shadow-sm">
                  <Avatar className="h-full w-full rounded-xl">
                    <AvatarImage src={appt.vendor.profilePhoto ?? ""} className="object-cover" />
                    <AvatarFallback className="rounded-xl text-sm font-bold">
                      {appt.vendor.firstName[0]}{appt.vendor.lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div className="space-y-1">
                  <h3 className="font-bold text-lg font-unbounded text-secondary-000">{vendorName}</h3>
                  <div className="flex items-center gap-1.5 text-secondary-300 text-sm">
                    <MapPin className="h-3.5 w-3.5" />
                    <span>{appt.vendor.country}</span>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Services */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-secondary-000">
                {appt.services.length > 1 ? "Services" : "Service"}
              </h4>
              {appt.services.map((service) => (
                <div
                  key={service.id}
                  className="flex items-start justify-between gap-4 py-2 border-b border-accent-20 last:border-0"
                >
                  <div className="space-y-0.5">
                    <p className="font-bold text-sm font-unbounded text-secondary-000">
                      {service.serviceName}
                    </p>
                    <p className="text-xs text-accent-100">
                      {service.category.name} • {service.duration}
                    </p>
                  </div>
                  <span className="font-bold text-base text-primary-100 shrink-0">
                    {formatVendorPrice(Number(service.price))}
                  </span>
                </div>
              ))}
              <div className="flex items-center justify-between pt-1">
                <span className="text-sm font-semibold text-secondary-000">Total</span>
                <span className="font-bold text-xl text-primary-100">
                  {formatVendorPrice(appt.totalAmount)}
                </span>
              </div>
            </div>

            <Separator />

            {/* Date & Time */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-secondary-000">Date & Time</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-accent-100 text-xs uppercase tracking-wider font-semibold">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>Date</span>
                  </div>
                  <p className="font-medium text-sm">
                    {format(parseISO(appt.date), "MMMM d, yyyy")}
                  </p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-accent-100 text-xs uppercase tracking-wider font-semibold">
                    <Clock className="h-3.5 w-3.5" />
                    <span>Time</span>
                  </div>
                  <p className="font-medium text-sm">{displayTime}</p>
                </div>
              </div>
            </div>

            {/* Payment */}
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-secondary-000">Payment</h4>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-accent-100">
                  <CreditCard className="h-4 w-4" />
                  <span>{paymentMethodLabel}</span>
                </div>
                <Badge className={`text-xs font-semibold capitalize border-0 ${paymentStatusStyle}`}>
                  {appt.paymentStatus}
                </Badge>
              </div>
            </div>

            {/* Special Request */}
            {appt.specificRequest && (
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-secondary-000">Special Request</h4>
                <p className="text-sm text-accent-100 leading-relaxed">{appt.specificRequest}</p>
              </div>
            )}
          </div>
        ) : null}

        {/* Footer — always shown so drawer doesn't look broken during load */}
        <div className="p-6 border-t bg-background shrink-0 mt-auto space-y-3">
          <Button
            className="w-full gap-2 bg-primary-100 hover:bg-[#a65620] text-white h-11 rounded-xl shadow-md font-medium cursor-pointer"
            disabled={!appt || isLoading}
            onClick={() =>
              isBookAgain
                ? router.push(`/categories/${appt!.vendor.id}`)
                : onMessageVendor?.(appt!)
            }
          >
            {isBookAgain ? <RotateCcw className="h-4 w-4" /> : <MessageCircle className="h-4 w-4" />}
            {isBookAgain ? "Book Again" : "Message Vendor"}
          </Button>

          {isActive && (
            <Button
              variant="outline"
              className="w-full gap-2 text-accent-100 cursor-pointer"
              disabled={isLoading}
              onClick={() => onReschedule(appt!)}
            >
              <PenLine className="h-4 w-4" />
              Reschedule
            </Button>
          )}

          <Button
            variant="outline"
            className="w-full gap-2 text-accent-100 cursor-pointer"
            disabled={!appt || isLoading}
            onClick={() => router.push(`/categories/${appt!.vendor.id}`)}
          >
            <ExternalLink className="h-4 w-4" />
            View Vendor Page
          </Button>

          {isActive && (
            <Button
              variant="destructive"
              className="w-full bg-red-700 hover:bg-red-800 cursor-pointer"
              disabled={isLoading || isCancelling}
              onClick={() => setShowCancelConfirm(true)}
            >
              Cancel Appointment
            </Button>
          )}
        </div>
      </SheetContent>
    </Sheet>

    <AlertDialog open={showCancelConfirm} onOpenChange={setShowCancelConfirm}>
      <AlertDialogContent className="rounded-2xl border-accent-20">
        <AlertDialogHeader>
          <AlertDialogTitle className="font-unbounded text-xl font-semibold text-secondary-000">
            Cancel this appointment?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-sm text-accent-80">
            The vendor will be notified. If you paid in advance, refund rules from
            your booking terms apply.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel asChild>
            <Button
              type="button"
              variant="outline"
              className="rounded-xl border-accent-20"
              disabled={isCancelling}
            >
              Keep appointment
            </Button>
          </AlertDialogCancel>
          <Button
            type="button"
            variant="destructive"
            className="rounded-xl bg-red-700 hover:bg-red-800 inline-flex items-center gap-2"
            disabled={isCancelling || !appt}
            onClick={() => {
              if (!appt) return;
              cancelAppointment(appt.id, {
                onSuccess: () => {
                  setShowCancelConfirm(false);
                  onClose();
                },
              });
            }}
          >
            {isCancelling ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Cancelling…
              </>
            ) : (
              "Yes, cancel"
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
    </>
  );
}
