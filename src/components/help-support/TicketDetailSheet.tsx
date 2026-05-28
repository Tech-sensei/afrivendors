"use client";

import { useEffect, useMemo, useState } from "react";
import { useTicketMessages } from "@/services/useTickets";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import type { SupportTicket, SupportTicketStatus } from "@/types/support";
import { TicketOverviewCard } from "./TicketOverviewCard";
import { TicketActionsPanel } from "./TicketActionsPanel";
import { TicketMessagesThread } from "./TicketMessagesThread";
import { TicketEditForm, type TicketEditFields } from "./TicketEditForm";

export function TicketDetailSheet({
  ticket,
  isOpen,
  onOpenChange,
  isEditMode,
  editValues,
  onEditChange,
  newMessage,
  onNewMessageChange,
  onSendMessage,
  onStartEdit,
  onCancelEdit,
  onSaveEdit,
  onUpdateStatus,
}: {
  ticket: SupportTicket | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  isEditMode: boolean;
  editValues: TicketEditFields;
  onEditChange: (patch: Partial<TicketEditFields>) => void;
  newMessage: string;
  onNewMessageChange: (value: string) => void;
  onSendMessage: () => void;
  onStartEdit: () => void;
  onCancelEdit: () => void;
  onSaveEdit: () => void;
  onUpdateStatus: (status: SupportTicketStatus) => void;
}) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const messagesQueryEnabled = isOpen && !!ticket && !isEditMode;
  const {
    data: apiMessages,
    isLoading: messagesLoading,
    isError: messagesError,
  } = useTicketMessages(ticket?.id ?? null, messagesQueryEnabled);

  const displayMessages = useMemo(() => {
    if (!ticket) return [];
    return apiMessages !== undefined ? apiMessages : ticket.messages;
  }, [apiMessages, ticket]);

  const messagesInitialLoading =
    Boolean(ticket) && messagesLoading && apiMessages === undefined;

  if (!ticket) return null;

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent
        side={isMobile ? "bottom" : "right"}
        className={`flex w-full flex-col border-0 p-0 sm:max-w-lg ${
          isMobile ? "max-h-[92vh] rounded-t-3xl" : "h-full rounded-l-3xl rounded-tr-none"
        }`}
      >
        <div className="flex-1 overflow-y-auto p-6">
          <SheetHeader className="p-0 mb-6 text-left">
            <SheetTitle className="font-unbounded text-xl font-semibold text-secondary-000">
              {isEditMode ? "Edit ticket" : "Ticket details"}
            </SheetTitle>
            <SheetDescription className="font-unageo text-sm text-accent-80">
              Ticket #{ticket.id}
            </SheetDescription>
          </SheetHeader>

          {isEditMode ? (
            <TicketEditForm
              values={editValues}
              onChange={onEditChange}
              onSave={onSaveEdit}
              onCancel={onCancelEdit}
            />
          ) : (
            <div className="space-y-8">
              <div>
                <h4 className="mb-3 font-unageo text-xs font-bold uppercase tracking-widest text-accent-60">
                  Overview
                </h4>
                <TicketOverviewCard ticket={ticket} />
              </div>
              <TicketActionsPanel
                status={ticket.status}
                onEdit={onStartEdit}
                onReopen={() => onUpdateStatus("open")}
                onCloseTicket={() => onUpdateStatus("closed")}
              />
              <TicketMessagesThread
                messages={displayMessages}
                status={ticket.status}
                newMessage={newMessage}
                onNewMessageChange={onNewMessageChange}
                onSend={onSendMessage}
                isLoading={messagesInitialLoading}
                loadError={messagesError}
              />
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
