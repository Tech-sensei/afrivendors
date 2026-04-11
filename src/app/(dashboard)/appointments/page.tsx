"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AppointmentCard } from "@/components/appointments/AppointmentCard";
import { AppointmentDetailsDrawer } from "@/components/appointments/AppointmentDetailsDrawer";
import { RescheduleModal } from "@/components/appointments/RescheduleModal";
import { MessageVendorDrawer } from "@/components/appointments/MessageVendorDrawer";
import { useAppointments } from "@/services/useAppointments";
import type { Appointment } from "@/types/appointments";

const EmptyTab = ({ message }: { message: string }) => (
  <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 bg-[#f4ebe5]/30 rounded-2xl border border-dashed border-[#8a5f43]/20">
    <p className="text-[#8a5f43]">{message}</p>
  </div>
);

export default function AppointmentPage() {
  const { data: appointments = [], isLoading } = useAppointments();

  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMessageOpen, setIsMessageOpen] = useState(false);

  const upcomingAppointments = appointments.filter(
    (a) => a.status === "pending" || a.status === "confirmed"
  );
  const pastAppointments = appointments.filter((a) => a.status === "completed");
  const cancelledAppointments = appointments.filter((a) => a.status === "cancelled");

  const handleViewDetails = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setIsDrawerOpen(true);
  };

  const handleReschedule = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setIsDrawerOpen(false);
    setIsModalOpen(true);
  };

  const handleMessageVendor = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setIsMessageOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-primary-100 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto space-y-8 max-w-6xl">
      <div className="flex flex-col gap-2">
        <h1 className="text-[28px] font-bold font-unbounded text-secondary-200 tracking-tight">
          Appointments
        </h1>
      </div>

      <Tabs defaultValue="upcoming" className="w-full">
        <div className="flex justify-between mb-8">
          <TabsList className="bg-transparent h-auto p-0 gap-4 w-full grid grid-cols-3 bg-secondary-700 rounded-full">
            <TabsTrigger
              value="upcoming"
              className="rounded-full h-12 w-full data-[state=active]:shadow-md data-[state=active]:bg-white data-[state=active]:text-[#231305] text-[#8a5f43] font-bold transition-all hover:text-[#231305]/80 text-base border border-transparent data-[state=active]:border-border/10"
            >
              Upcoming
              {upcomingAppointments.length > 0 && (
                <span className="ml-1.5 text-xs font-bold bg-primary-100 text-white rounded-full px-1.5 py-0.5">
                  {upcomingAppointments.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger
              value="past"
              className="rounded-full h-12 w-full data-[state=active]:shadow-md data-[state=active]:bg-white data-[state=active]:text-[#231305] text-[#8a5f43] font-bold transition-all hover:text-[#231305]/80 text-base border border-transparent data-[state=active]:border-border/10"
            >
              Past
            </TabsTrigger>
            <TabsTrigger
              value="cancelled"
              className="rounded-full h-12 w-full data-[state=active]:shadow-md data-[state=active]:bg-white data-[state=active]:text-[#231305] text-[#8a5f43] font-bold transition-all hover:text-[#231305]/80 text-base border border-transparent data-[state=active]:border-border/10"
            >
              Cancelled
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="upcoming" className="space-y-6 focus-visible:outline-none focus-visible:ring-0">
          {upcomingAppointments.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {upcomingAppointments.map((appointment) => (
                <AppointmentCard
                  key={appointment.id}
                  appointment={appointment}
                  onViewDetails={handleViewDetails}
                  onReschedule={handleReschedule}
                  onMessageVendor={handleMessageVendor}
                />
              ))}
            </div>
          ) : (
            <EmptyTab message="No upcoming appointments found." />
          )}
        </TabsContent>

        <TabsContent value="past" className="space-y-6 focus-visible:outline-none focus-visible:ring-0">
          {pastAppointments.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {pastAppointments.map((appointment) => (
                <AppointmentCard
                  key={appointment.id}
                  appointment={appointment}
                  onViewDetails={handleViewDetails}
                  onReschedule={handleReschedule}
                  onMessageVendor={handleMessageVendor}
                />
              ))}
            </div>
          ) : (
            <EmptyTab message="No past appointments found." />
          )}
        </TabsContent>

        <TabsContent value="cancelled" className="space-y-6 focus-visible:outline-none focus-visible:ring-0">
          {cancelledAppointments.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {cancelledAppointments.map((appointment) => (
                <AppointmentCard
                  key={appointment.id}
                  appointment={appointment}
                  onViewDetails={handleViewDetails}
                  onReschedule={handleReschedule}
                  onMessageVendor={handleMessageVendor}
                />
              ))}
            </div>
          ) : (
            <EmptyTab message="No cancelled appointments found." />
          )}
        </TabsContent>
      </Tabs>

      <AppointmentDetailsDrawer
        appointment={selectedAppointment}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onReschedule={handleReschedule}
        onMessageVendor={(appointment) => {
          setSelectedAppointment(appointment);
          setIsDrawerOpen(false);
          setIsMessageOpen(true);
        }}
      />

      <RescheduleModal
        appointment={selectedAppointment}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      <MessageVendorDrawer
        appointment={selectedAppointment}
        isOpen={isMessageOpen}
        onClose={() => setIsMessageOpen(false)}
      />
    </div>
  );
}
