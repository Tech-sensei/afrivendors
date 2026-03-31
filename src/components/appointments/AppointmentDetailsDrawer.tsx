"use client";

import { useState, useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";
import { Calendar, Clock, MapPin, Star, MessageCircle, PenLine, ExternalLink, X, RotateCcw } from "lucide-react";
import { format, parseISO } from "date-fns";
import type { AppointmentDetailsDrawerProps } from "@/types/appointments";

export function AppointmentDetailsDrawer({
  appointment,
  isOpen,
  onClose,
  onReschedule,
  onMessageVendor,
}: AppointmentDetailsDrawerProps) {
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (!appointment) return null;

  const isBookAgain = appointment.status === 'past' || appointment.status === 'cancelled';

  return (

    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent 
        side={isMobile ? "bottom" : "right"}
        className={`w-full sm:max-w-md flex flex-col border-0 p-0 overflow-hidden ${
          isMobile ? 'rounded-t-3xl max-h-[85vh]' : 'rounded-l-3xl rounded-tr-none h-full'
        }`}
      >
        <SheetHeader className="px-6 py-4 border-b flex flex-row items-center justify-between bg-background shrink-0">
           <SheetTitle className="text-xl font-bold font-unbounded text-[#231305]">Appointment Details</SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          
          {/* Vendor Section */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-[#231305]">Vendor</h4>
            <div className="flex items-start gap-4">
               <div className="relative h-16 w-16 rounded-xl overflow-hidden shrink-0 border border-border/50 shadow-sm">
                  <Avatar className="h-full w-full rounded-xl">
                    <AvatarImage src={appointment.providerAvatar} className="object-cover" />
                    <AvatarFallback className="rounded-xl">VN</AvatarFallback>
                  </Avatar>
               </div>
               
               <div className="space-y-1">
                 <h3 className="font-bold text-lg font-unbounded text-[#231305]">{appointment.providerName}</h3>
                 <div className="flex items-center gap-1.5 text-[#8a5f43] text-sm">
                    <MapPin className="h-3.5 w-3.5" />
                    <span>{appointment.location}</span>
                 </div>
                 <div className="flex items-center gap-1 text-sm font-medium">
                    <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                    <span>{appointment.rating}</span>
                    <span className="text-[#8a5f43] font-normal">({appointment.reviewCount})</span>
                 </div>
               </div>
            </div>
          </div>

          <Separator />

          {/* Service Details Section */}
          <div className="space-y-4">
             <h4 className="text-sm font-semibold text-[#231305]">Service Details</h4>
             
             <div className="space-y-1">
                <p className="text-xs text-accent-100 uppercase tracking-wider font-semibold">SERVICE</p>
                <p className="font-bold text-base font-unbounded text-[#231305]">{appointment.serviceName}</p>
             </div>

             <div className="grid grid-cols-2 gap-8">
                <div className="space-y-1">
                   <p className="text-xs text-accent-100 uppercase tracking-wider font-semibold">DURATION</p>
                   <p className="font-medium">{appointment.duration}</p>
                </div>
                <div className="space-y-1">
                   <p className="text-xs text-accent-100 uppercase tracking-wider font-semibold">PRICE</p>
                   <p className="font-bold text-xl text-[#c56c31]">£{appointment.price.toLocaleString()}</p>
                </div>
             </div>
          </div>

          {/* Date & Time Section */}
          <div className="space-y-4">
             <h4 className="text-sm font-semibold text-[#231305]">Date & Time</h4>
             <div className="grid grid-cols-2 gap-8">
                <div className="space-y-1">
                   <div className="flex items-center gap-2 text-accent-100 text-xs uppercase tracking-wider font-semibold mb-1">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>DATE</span>
                   </div>
                   <p className="font-medium">{format(parseISO(appointment.date), "MMMM d, yyyy")}</p>
                </div>
                <div className="space-y-1">
                   <div className="flex items-center gap-2 text-accent-100 text-xs uppercase tracking-wider font-semibold mb-1">
                      <Clock className="h-3.5 w-3.5" />
                      <span>TIME</span>
                   </div>
                   <p className="font-medium">{appointment.time}</p>
                </div>
             </div>
          </div>

          {/* Payment Method - Placeholder per design */}
           <div className="space-y-1">
             <h4 className="text-sm font-semibold text-[#231305]">Payment Method</h4>
             <p className="text-sm text-accent-100">Visa ending in 4242</p>
           </div>
        </div>

        {/* Actions Footer */}
        <div className="p-6 border-t bg-background shrink-0 mt-auto">
           <div className="space-y-3">
              <Button 
                className="w-full gap-2 bg-[#c56c31] hover:bg-[#a65620] text-white h-11 rounded-xl shadow-md font-medium cursor-pointer"
                onClick={() => isBookAgain ? router.push('/categories') : onMessageVendor?.(appointment)}
              >
                {isBookAgain ? <RotateCcw className="h-4 w-4" /> : <MessageCircle className="h-4 w-4" />}
                {isBookAgain ? "Book Again" : "Message Vendor"}
              </Button>
              
              {!isBookAgain && (
                <Button variant="outline" className="w-full gap-2 text-accent-100" onClick={() => onReschedule(appointment)}>
                    <PenLine className="h-4 w-4" />
                    Reschedule
                </Button>
              )}

              <Button 
                variant="outline" 
                className="w-full gap-2 text-accent-100 cursor-pointer"
                onClick={() => router.push(`/categories/${appointment.providerSlug}`)}
              >
                 <ExternalLink className="h-4 w-4" />
                 View Vendor Page
              </Button>

              {!isBookAgain && appointment.status !== 'past' && (
                  <Button variant="destructive" className="w-full mt-4 bg-red-700 hover:bg-red-800">
                    Cancel Appointment
                  </Button>
               )}
           </div>
        </div>

      </SheetContent>
    </Sheet>
  );
}
