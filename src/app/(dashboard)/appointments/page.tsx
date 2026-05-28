"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AppointmentCard } from "@/components/appointments/AppointmentCard";
import { AppointmentDetailsDrawer } from "@/components/appointments/AppointmentDetailsDrawer";
import { RescheduleModal } from "@/components/appointments/RescheduleModal";
import { MessageVendorDrawer } from "@/components/appointments/MessageVendorDrawer";
import { OpenAppointmentDisputeDialog } from "@/components/appointments/OpenAppointmentDisputeDialog";
import { DisputeResolutionDialog } from "@/components/appointments/DisputeResolutionDialog";
import { AppointmentEmptyState } from "@/components/appointments/AppointmentEmptyState";
import {
  useAppointments,
  useAppointmentTabCounts,
  fetchUserAppointmentById,
  useResolveDisputePayVendor,
  useEscalateAppointmentDispute,
} from "@/services/useAppointments";
import type { Appointment, AppointmentTabId } from "@/types/appointments";

function TabCountBadge({ count }: { count: number }) {
  if (count <= 0) return null;
  return (
    <span className="ml-1.5 rounded-full bg-primary-100 px-1.5 py-0.5 text-xs font-bold text-white">
      {count}
    </span>
  );
}

function TabPanel({
  tab,
  appointments,
  isLoading,
  onViewDetails,
  onReschedule,
  onMessageVendor,
  onOpenDispute,
  onPayVendor,
  onEscalateDispute,
}: {
  tab: AppointmentTabId;
  appointments: Appointment[];
  isLoading: boolean;
  onViewDetails: (a: Appointment) => void;
  onReschedule: (a: Appointment) => void;
  onMessageVendor: (a: Appointment) => void;
  onOpenDispute: (a: Appointment) => void;
  onPayVendor: (a: Appointment) => void;
  onEscalateDispute: (a: Appointment) => void;
}) {
  if (isLoading) {
    return (
      <div className="flex h-48 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary-100" />
      </div>
    );
  }

  if (appointments.length === 0) {
    const emptyTab =
      tab === "past" ? "completed" : tab === "upcoming" ? "upcoming" : tab;
    return (
      <AppointmentEmptyState
        tab={emptyTab as "pending" | "upcoming" | "completed" | "cancelled"}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
      {appointments.map((appointment) => (
        <AppointmentCard
          key={appointment.id}
          appointment={appointment}
          onViewDetails={onViewDetails}
          onReschedule={onReschedule}
          onMessageVendor={onMessageVendor}
          onOpenDispute={onOpenDispute}
          onPayVendor={onPayVendor}
          onEscalateDispute={onEscalateDispute}
        />
      ))}
    </div>
  );
}

export default function AppointmentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const appointmentDeepLinkHandled = useRef(false);

  const [activeTab, setActiveTab] = useState<AppointmentTabId>("pending");
  const {
    data: appointments = [],
    isLoading,
    isFetching,
  } = useAppointments(activeTab);
  const { data: tabCounts } = useAppointmentTabCounts();

  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMessageOpen, setIsMessageOpen] = useState(false);
  const [disputeAppointment, setDisputeAppointment] =
    useState<Appointment | null>(null);
  const [isDisputeOpen, setIsDisputeOpen] = useState(false);
  const [payVendorAppointment, setPayVendorAppointment] =
    useState<Appointment | null>(null);
  const [isPayVendorOpen, setIsPayVendorOpen] = useState(false);
  const [escalateAppointment, setEscalateAppointment] =
    useState<Appointment | null>(null);
  const [isEscalateOpen, setIsEscalateOpen] = useState(false);

  const { mutate: resolvePayVendor, isPending: isPayingVendor } =
    useResolveDisputePayVendor();
  const { mutate: escalateDispute, isPending: isEscalating } =
    useEscalateAppointmentDispute();

  const tabLoading = isLoading || isFetching;

  const handleViewDetails = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setIsDrawerOpen(true);
  };

  useEffect(() => {
    const param = searchParams.get("appointmentId");
    if (!param || appointmentDeepLinkHandled.current) return;

    const id = Number(param);
    if (!Number.isFinite(id)) return;

    const openFromList = (apt: Appointment) => {
      appointmentDeepLinkHandled.current = true;
      setSelectedAppointment(apt);
      setIsDrawerOpen(true);
      router.replace("/appointments");
    };

    const apt = appointments.find((a) => a.id === id);
    if (apt) {
      openFromList(apt);
      return;
    }

    if (tabLoading) return;

    appointmentDeepLinkHandled.current = true;
    fetchUserAppointmentById(id)
      .then(openFromList)
      .catch(() => {
        toast.error("Appointment not found.");
        router.replace("/appointments");
      });
  }, [appointments, tabLoading, router, searchParams]);

  const handleReschedule = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setIsDrawerOpen(false);
    setIsModalOpen(true);
  };

  const handleMessageVendor = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setIsMessageOpen(true);
  };

  const handleOpenDispute = (appointment: Appointment) => {
    setDisputeAppointment(appointment);
    setIsDisputeOpen(true);
  };

  const handlePayVendor = (appointment: Appointment) => {
    setPayVendorAppointment(appointment);
    setIsPayVendorOpen(true);
  };

  const handleEscalateDispute = (appointment: Appointment) => {
    setEscalateAppointment(appointment);
    setIsEscalateOpen(true);
  };

  const panelProps = {
    onViewDetails: handleViewDetails,
    onReschedule: handleReschedule,
    onMessageVendor: handleMessageVendor,
    onOpenDispute: handleOpenDispute,
    onPayVendor: handlePayVendor,
    onEscalateDispute: handleEscalateDispute,
  };

  return (
    <div className="container mx-auto max-w-6xl space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="font-unbounded text-[28px] font-bold tracking-tight text-secondary-200">
          Appointments
        </h1>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as AppointmentTabId)}
        className="w-full"
      >
        <div className="mb-8 flex justify-between">
          <TabsList className="grid h-auto w-full grid-cols-2 gap-2 rounded-full bg-secondary-700 p-0 sm:gap-3 md:grid-cols-4">
            <TabsTrigger
              value="pending"
              className="h-12 w-full rounded-full border border-transparent text-sm font-bold text-secondary-300 transition-all hover:text-secondary-000/80 data-[state=active]:border-border/10 data-[state=active]:bg-white data-[state=active]:text-secondary-000 data-[state=active]:shadow-md sm:text-base"
            >
              Pending
              <TabCountBadge count={tabCounts?.pending ?? 0} />
            </TabsTrigger>
            <TabsTrigger
              value="upcoming"
              className="h-12 w-full rounded-full border border-transparent text-sm font-bold text-secondary-300 transition-all hover:text-secondary-000/80 data-[state=active]:border-border/10 data-[state=active]:bg-white data-[state=active]:text-secondary-000 data-[state=active]:shadow-md sm:text-base"
            >
              Upcoming
              <TabCountBadge count={tabCounts?.upcoming ?? 0} />
            </TabsTrigger>
            <TabsTrigger
              value="past"
              className="h-12 w-full rounded-full border border-transparent text-sm font-bold text-secondary-300 transition-all hover:text-secondary-000/80 data-[state=active]:border-border/10 data-[state=active]:bg-white data-[state=active]:text-secondary-000 data-[state=active]:shadow-md sm:text-base"
            >
              Completed
              <TabCountBadge count={tabCounts?.past ?? 0} />
            </TabsTrigger>
            <TabsTrigger
              value="cancelled"
              className="h-12 w-full rounded-full border border-transparent text-sm font-bold text-secondary-300 transition-all hover:text-secondary-000/80 data-[state=active]:border-border/10 data-[state=active]:bg-white data-[state=active]:text-secondary-000 data-[state=active]:shadow-md sm:text-base"
            >
              Cancelled
              <TabCountBadge count={tabCounts?.cancelled ?? 0} />
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent
          value="pending"
          className="space-y-6 focus-visible:outline-none focus-visible:ring-0"
        >
          <TabPanel
            tab="pending"
            appointments={activeTab === "pending" ? appointments : []}
            isLoading={activeTab === "pending" && tabLoading}
            {...panelProps}
          />
        </TabsContent>

        <TabsContent
          value="upcoming"
          className="space-y-6 focus-visible:outline-none focus-visible:ring-0"
        >
          <TabPanel
            tab="upcoming"
            appointments={activeTab === "upcoming" ? appointments : []}
            isLoading={activeTab === "upcoming" && tabLoading}
            {...panelProps}
          />
        </TabsContent>

        <TabsContent
          value="past"
          className="space-y-6 focus-visible:outline-none focus-visible:ring-0"
        >
          <TabPanel
            tab="past"
            appointments={activeTab === "past" ? appointments : []}
            isLoading={activeTab === "past" && tabLoading}
            {...panelProps}
          />
        </TabsContent>

        <TabsContent
          value="cancelled"
          className="space-y-6 focus-visible:outline-none focus-visible:ring-0"
        >
          <TabPanel
            tab="cancelled"
            appointments={activeTab === "cancelled" ? appointments : []}
            isLoading={activeTab === "cancelled" && tabLoading}
            {...panelProps}
          />
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
        onOpenDispute={(appointment) => {
          setSelectedAppointment(appointment);
          handleOpenDispute(appointment);
        }}
        onPayVendor={(appointment) => {
          setSelectedAppointment(appointment);
          handlePayVendor(appointment);
        }}
        onEscalateDispute={(appointment) => {
          setSelectedAppointment(appointment);
          handleEscalateDispute(appointment);
        }}
      />

      <DisputeResolutionDialog
        open={isPayVendorOpen}
        onOpenChange={setIsPayVendorOpen}
        title="Pay vendor & close dispute"
        description="You agree the issue is resolved and payment should go to the vendor. Add a short note about what you agreed."
        confirmLabel="Pay vendor"
        isPending={isPayingVendor}
        onConfirm={(resolution) => {
          if (!payVendorAppointment) return;
          resolvePayVendor(
            { appointmentId: payVendorAppointment.id, resolution },
            {
              onSuccess: () => {
                setIsPayVendorOpen(false);
                setPayVendorAppointment(null);
              },
            }
          );
        }}
      />

      <DisputeResolutionDialog
        open={isEscalateOpen}
        onOpenChange={setIsEscalateOpen}
        title="Escalate to Afrivendors"
        description="Tell us why you could not resolve this with the vendor. Our team will review and decide."
        confirmLabel="Submit escalation"
        isPending={isEscalating}
        onConfirm={(resolution) => {
          if (!escalateAppointment) return;
          escalateDispute(
            { appointmentId: escalateAppointment.id, resolution },
            {
              onSuccess: () => {
                setIsEscalateOpen(false);
                setEscalateAppointment(null);
              },
            }
          );
        }}
      />

      <OpenAppointmentDisputeDialog
        appointment={disputeAppointment}
        open={isDisputeOpen}
        onOpenChange={setIsDisputeOpen}
        onSubmitted={() => {
          setDisputeAppointment(null);
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
