import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";
import type { RescheduleModalProps } from "@/types/appointments";

const timeSlots = [
  '9:00 AM', '10:00 AM', '11:00 AM',
  '12:00 PM', '1:00 PM', '2:00 PM',
  '3:00 PM', '4:00 PM', '5:00 PM',
];

export function RescheduleModal({
  appointment,
  isOpen,
  onClose,
}: RescheduleModalProps) {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [time, setTime] = useState("");
  const [notes, setNotes] = useState("");
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleReschedule = () => {
    // In a real app, this would call an API
    console.log("Rescheduling appointment", appointment?.id, "to", date, time, "notes:", notes);
    toast.success("Appointment rescheduled successfully!");
    onClose();
  };

  if (!appointment) return null;

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent 
        side={isMobile ? "bottom" : "right"}
        className={`w-full sm:max-w-md flex flex-col border-0 p-0 overflow-hidden ${
          isMobile ? 'rounded-t-3xl max-h-[85vh]' : 'rounded-l-3xl rounded-tr-none h-full'
        }`}
      >
        <SheetHeader className="px-6 py-4 border-b flex flex-row items-center justify-between bg-background shrink-0">
          <div className="space-y-0.5 text-left">
            <SheetTitle className="text-xl font-bold font-unbounded text-secondary-000">Reschedule Appointment</SheetTitle>
            <p className="text-sm text-secondary-300 font-medium">Reschedule {appointment.serviceName}</p>
          </div>
          <SheetClose className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary -mt-6">
             <X className="h-4 w-4" />
             <span className="sr-only">Close</span>
           </SheetClose>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {/* Date Selection */}
          <div className="space-y-3">
             <h4 className="font-bold text-secondary-000">Select New Date</h4>
             <div className="border border-border/50 rounded-2xl p-2 bg-white shadow-sm">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(newDate) => {
                    setDate(newDate);
                    setTime(""); // Reset time when date changes
                  }}
                  disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                  initialFocus
                  className="p-0 w-full"
                  classNames={{
                    head_cell: "text-secondary-300 font-medium text-[0.8rem]",
                    cell: "h-9 w-9 text-center text-sm p-0 sm:h-10 sm:w-10 relative [&:has([aria-selected])]:bg-primary-300/50 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                    day: "h-9 w-9 p-0 sm:h-10 sm:w-10 font-normal aria-selected:opacity-100 rounded-full hover:bg-primary-300 hover:text-secondary-000 focus:bg-primary-300",
                    day_selected: "bg-secondary-000 text-white hover:bg-secondary-000 hover:text-white focus:bg-secondary-000 focus:text-white rounded-full",
                    day_today: "bg-primary-300 text-secondary-000",
                    day_outside: "text-muted-foreground opacity-50",
                    day_disabled: "text-muted-foreground opacity-50",
                    day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
                    day_hidden: "invisible",
                  }}
                />
             </div>
          </div>

          {/* Time Selection */}
          <div className="space-y-3">
            <h4 className={`font-bold transition-colors ${!date ? 'text-gray-400' : 'text-secondary-000'}`}>Available Times</h4>
            <div className={`grid grid-cols-3 gap-3 transition-opacity duration-300 ${!date ? 'opacity-50' : 'opacity-100'}`}>
               {timeSlots.map((slot) => (
                  <button
                    key={slot}
                    onClick={() => setTime(slot)}
                    disabled={!date}
                    className={cn(
                      "py-3 px-2 rounded-xl text-sm font-semibold border transition-all duration-200",
                      !date && "cursor-not-allowed",
                      time === slot 
                        ? "bg-secondary-000 text-white border-secondary-000 shadow-md transform scale-[1.02]" 
                        : "bg-white text-secondary-300 border-border/40 hover:border-primary-100/50 hover:bg-primary-300/30"
                    )}
                  >
                    {slot}
                  </button>
               ))}
            </div>
          </div>

          {/* Add Notes */}
          <div className="space-y-3">
            <Label htmlFor="notes" className="font-bold text-secondary-000">Add Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Any special requests or reasons for rescheduling..."
              className="resize-none rounded-2xl border-border/50 bg-white min-h-[100px] text-secondary-000 placeholder:text-secondary-300/60 focus:border-primary-100 focus:ring-primary-100/20"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
        </div>

        <SheetFooter className="p-6 border-t bg-background shrink-0 mt-auto flex-col gap-3 sm:gap-3 sm:flex-col">
          <Button 
            variant="outline" 
            onClick={onClose}
            className="w-full h-12 rounded-xl text-secondary-000 border-border/40 font-semibold text-base hover:bg-primary-300 cursor-pointer"
          >
             Cancel
          </Button>
          <Button 
            onClick={handleReschedule} 
            disabled={!date || !time}
            className="w-full h-12 rounded-xl bg-primary-100 hover:bg-[#a65620] text-white font-semibold text-base shadow-lg shadow-primary-100/20 cursor-pointer"
          >
            Update Appointment
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
