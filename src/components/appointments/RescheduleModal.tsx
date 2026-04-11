"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { format } from "date-fns";
import http from "@/lib/http";
import type { RescheduleModalProps } from "@/types/appointments";

const TIME_SLOTS = [
  "9:00 AM", "10:00 AM", "11:00 AM",
  "12:00 PM", "1:00 PM",  "2:00 PM",
  "3:00 PM",  "4:00 PM",  "5:00 PM",
];

/** Convert "2:00 PM" → "14:00" */
function to24h(slot: string): string {
  const [time, period] = slot.split(" ");
  let [hours, minutes] = time.split(":").map(Number);
  if (period === "PM" && hours !== 12) hours += 12;
  if (period === "AM" && hours === 12) hours = 0;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

export function RescheduleModal({
  appointment,
  isOpen,
  onClose,
}: RescheduleModalProps) {
  const queryClient = useQueryClient();
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [notes, setNotes] = useState("");
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setDate(undefined);
      setSelectedSlot("");
      setNotes("");
    }
  }, [isOpen]);

  const { mutate: reschedule, isPending } = useMutation({
    mutationFn: async () => {
      const payload = {
        rescheduleDate: format(date!, "yyyy-MM-dd"),
        rescheduleTime: to24h(selectedSlot),
        rescheduleNote: notes,
      };
      const { data } = await http.post(
        `/users/appointments/${appointment!.id}/reschedule`,
        payload
      );
      return data;
    },
    onSuccess: () => {
      toast.success("Appointment rescheduled successfully!");
      queryClient.invalidateQueries({ queryKey: ["user-appointments"] });
      queryClient.invalidateQueries({ queryKey: ["appointment-detail", appointment?.id] });
      onClose();
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ||
          "Failed to reschedule appointment. Please try again."
      );
    },
  });

  if (!appointment) return null;

  const canSubmit = !!date && !!selectedSlot && !isPending;

  return (
    <Sheet open={isOpen} onOpenChange={isPending ? undefined : onClose}>
      <SheetContent
        side={isMobile ? "bottom" : "right"}
        className={`w-full sm:max-w-md flex flex-col border-0 p-0 overflow-hidden ${
          isMobile ? "rounded-t-3xl max-h-[85vh]" : "rounded-l-3xl rounded-tr-none h-full"
        }`}
      >
        <SheetHeader className="px-6 py-4 border-b bg-background shrink-0">
          <SheetTitle className="text-xl font-bold font-unbounded text-secondary-000">
            Reschedule Appointment
          </SheetTitle>
          <p className="text-sm text-primary-100 font-medium">
            {appointment.services[0]?.serviceName}
          </p>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {/* Date Selection */}
          <div className="space-y-3">
            <h4 className="font-bold text-secondary-000">Select New Date</h4>
            <div className="rounded-2xl p-4 bg-white shadow-sm border border-border/40">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(newDate) => {
                  setDate(newDate);
                  setSelectedSlot("");
                }}
                disabled={(d) => d < new Date(new Date().setHours(0, 0, 0, 0))}
                initialFocus
                className="p-0 w-full"
                classNames={{
                  months: "w-full",
                  month: "w-full space-y-4",
                  caption: "flex justify-center items-center relative py-1 mb-2",
                  caption_label: "text-sm font-bold text-secondary-000 font-unbounded",
                  nav: "flex items-center gap-1",
                  nav_button:
                    "h-8 w-8 bg-transparent hover:bg-primary-300/60 rounded-full flex items-center justify-center transition-colors text-secondary-300 hover:text-secondary-000",
                  nav_button_previous: "absolute left-0",
                  nav_button_next: "absolute right-0",
                  table: "!w-full border-collapse table-fixed",
                  head_row: "w-full",
                  head_cell:
                    "text-secondary-300 font-semibold text-[0.72rem] uppercase tracking-wider w-full text-center pb-3",
                  row: "w-full",
                  cell: "w-full text-center p-0 py-1 relative focus-within:relative focus-within:z-20",
                  day: "mx-auto h-10 w-10 flex items-center justify-center rounded-full text-sm font-medium text-secondary-000 hover:bg-primary-300 hover:text-secondary-000 transition-colors cursor-pointer aria-selected:opacity-100",
                  day_selected:
                    "bg-secondary-000 !text-white hover:bg-secondary-000 hover:!text-white focus:bg-secondary-000 rounded-full font-bold shadow-md",
                  day_today:
                    "border-2 border-primary-100 text-primary-100 font-bold",
                  day_outside: "text-muted-foreground opacity-30",
                  day_disabled:
                    "text-muted-foreground opacity-25 cursor-not-allowed hover:bg-transparent",
                  day_range_middle:
                    "aria-selected:bg-accent aria-selected:text-accent-foreground",
                  day_hidden: "invisible",
                }}
              />
            </div>
          </div>

          {/* Time Selection */}
          <div className="space-y-3">
            <h4 className={`font-bold transition-colors ${!date ? "text-gray-400" : "text-secondary-000"}`}>
              Available Times
            </h4>
            <div className={`grid grid-cols-3 gap-3 transition-opacity duration-300 ${!date ? "opacity-50" : "opacity-100"}`}>
              {TIME_SLOTS.map((slot) => (
                <button
                  key={slot}
                  onClick={() => setSelectedSlot(slot)}
                  disabled={!date || isPending}
                  className={cn(
                    "py-3 px-2 rounded-xl text-sm font-semibold border transition-all duration-200",
                    !date && "cursor-not-allowed",
                    selectedSlot === slot
                      ? "bg-secondary-000 text-white border-secondary-000 shadow-md scale-[1.02]"
                      : "bg-white text-secondary-300 border-border/40 hover:border-primary-100/50 hover:bg-primary-300/30"
                  )}
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-3">
            <Label htmlFor="reschedule-notes" className="font-bold text-secondary-000">
              Reason / Note <span className="text-secondary-300 font-normal">(Optional)</span>
            </Label>
            <Textarea
              id="reschedule-notes"
              placeholder="Any special requests or reasons for rescheduling..."
              className="resize-none rounded-2xl border-border/50 bg-white min-h-[100px] text-secondary-000 placeholder:text-secondary-300/60 focus:border-primary-100 focus:ring-primary-100/20"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              disabled={isPending}
            />
          </div>
        </div>

        <SheetFooter className="p-6 border-t bg-background shrink-0 mt-auto flex-col gap-3 sm:gap-3 sm:flex-col">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isPending}
            className="w-full h-12 rounded-xl text-secondary-000 border-border/40 font-semibold text-base hover:bg-primary-300 cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            onClick={() => reschedule()}
            disabled={!canSubmit}
            className="w-full h-12 rounded-xl bg-primary-100 hover:bg-[#a65620] text-white font-semibold text-base shadow-lg shadow-primary-100/20 cursor-pointer flex items-center justify-center gap-2"
          >
            {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            {isPending ? "Rescheduling…" : "Update Appointment"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
