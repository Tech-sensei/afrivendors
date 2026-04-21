"use client";

import { useMemo, useState, useCallback, useDeferredValue } from "react";
import axios from "axios";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  useCreateTicket,
  useTicketsInfinite,
  patchTicketInListInfiniteCache,
} from "@/services/useTickets";
import type {
  SupportTicket,
  SupportTicketStatus,
  SupportMessage,
  NewTicketFormState,
} from "@/types/support";
import type { HelpSupportTabId } from "@/types/support";
import {
  ticketToEditFields,
  type TicketEditFields,
} from "@/components/help-support/TicketEditForm";

export function useSupportTickets() {
  const queryClient = useQueryClient();
  const createTicket = useCreateTicket();

  const [activeTab, setActiveTab] = useState<HelpSupportTabId>("tickets");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<SupportTicketStatus | "all">(
    "all"
  );
  const deferredSubject = useDeferredValue(searchQuery);

  const listQuery = useTicketsInfinite({
    subject: deferredSubject,
    filterStatus,
  });

  const tickets = useMemo(
    () => listQuery.data?.pages.flatMap((p) => p.items) ?? [],
    [listQuery.data]
  );

  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(
    null
  );
  const [detailOpen, setDetailOpen] = useState(false);
  const [showCreateTicket, setShowCreateTicket] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);
  const [editValues, setEditValues] = useState<TicketEditFields>({
    subject: "",
    category: "",
    priority: "medium",
    description: "",
  });

  const openTicket = useCallback((ticket: SupportTicket) => {
    setSelectedTicket(ticket);
    setDetailOpen(true);
    setIsEditMode(false);
    setNewMessage("");
  }, []);

  const closeDetail = useCallback((open: boolean) => {
    if (!open) {
      setDetailOpen(false);
      setSelectedTicket(null);
      setIsEditMode(false);
      setEditValues({
        subject: "",
        category: "",
        priority: "medium",
        description: "",
      });
      setNewMessage("");
    }
  }, []);

  const handleCreateTicket = useCallback(
    (form: NewTicketFormState) => {
      createTicket.mutate(form, {
        onSuccess: () => {
          setShowCreateTicket(false);
          toast.success("Ticket created successfully");
        },
        onError: (err: unknown) => {
          let msg = "Could not create ticket. Please try again.";
          if (axios.isAxiosError(err)) {
            const data = err.response?.data as
              | { message?: string | string[] }
              | undefined;
            if (data?.message != null) {
              msg = Array.isArray(data.message)
                ? data.message.join(", ")
                : String(data.message);
            } else if (err.message) {
              msg = err.message;
            }
          }
          toast.error(msg);
        },
      });
    },
    [createTicket]
  );

  const handleSendMessage = useCallback(() => {
    const trimmed = newMessage.trim();
    if (!trimmed || !selectedTicket) return;

    const message: SupportMessage = {
      id: String(selectedTicket.messages.length + 1),
      sender: "user",
      content: trimmed,
      timestamp: new Date().toISOString(),
      senderName: "You",
    };

    const updated: SupportTicket = {
      ...selectedTicket,
      messages: [...selectedTicket.messages, message],
      updatedAt: new Date().toISOString(),
    };

    patchTicketInListInfiniteCache(queryClient, selectedTicket.id, () => updated);
    setSelectedTicket(updated);
    setNewMessage("");
    toast.success("Message sent");
  }, [newMessage, selectedTicket, queryClient]);

  const handleUpdateTicketStatus = useCallback(
    (status: SupportTicketStatus) => {
      if (!selectedTicket) return;

      const updated: SupportTicket = {
        ...selectedTicket,
        status,
        updatedAt: new Date().toISOString(),
      };

      patchTicketInListInfiniteCache(queryClient, selectedTicket.id, () => updated);
      setSelectedTicket(updated);

      const messages: Record<SupportTicketStatus, string> = {
        open: "Ticket reopened",
        pending: "Ticket updated",
        "in-progress": "Ticket marked as in progress",
        resolved: "Ticket marked as resolved",
        closed: "Ticket closed",
      };
      toast.success(messages[status]);
    },
    [selectedTicket, queryClient]
  );

  const handleStartEdit = useCallback(() => {
    if (!selectedTicket) return;
    setEditValues(ticketToEditFields(selectedTicket));
    setIsEditMode(true);
  }, [selectedTicket]);

  const handleCancelEdit = useCallback(() => {
    setIsEditMode(false);
    setEditValues({
      subject: "",
      category: "",
      priority: "medium",
      description: "",
    });
  }, []);

  const handleSaveEdit = useCallback(() => {
    if (!selectedTicket) return;
    const { subject, category, description, priority } = editValues;
    if (!subject.trim() || !category || !description.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    const updated: SupportTicket = {
      ...selectedTicket,
      subject: subject.trim(),
      category,
      priority,
      description: description.trim(),
      updatedAt: new Date().toISOString(),
    };

    patchTicketInListInfiniteCache(queryClient, selectedTicket.id, () => updated);
    setSelectedTicket(updated);
    setIsEditMode(false);
    toast.success("Ticket updated successfully");
  }, [selectedTicket, editValues, queryClient]);

  const patchEdit = useCallback((patch: Partial<TicketEditFields>) => {
    setEditValues((v) => ({ ...v, ...patch }));
  }, []);

  return {
    activeTab,
    setActiveTab,
    tickets,
    searchQuery,
    setSearchQuery,
    filterStatus,
    setFilterStatus,
    selectedTicket,
    detailOpen,
    showCreateTicket,
    setShowCreateTicket,
    newMessage,
    setNewMessage,
    isEditMode,
    editValues,
    openTicket,
    closeDetail,
    handleCreateTicket,
    handleSendMessage,
    handleUpdateTicketStatus,
    handleStartEdit,
    handleCancelEdit,
    handleSaveEdit,
    patchEdit,
    isCreatingTicket: createTicket.isPending,
    ticketsLoading: listQuery.isLoading,
    ticketsError: listQuery.isError,
    ticketsErrorMessage:
      listQuery.error instanceof Error
        ? listQuery.error.message
        : listQuery.isError
          ? "Could not load tickets."
          : null,
    hasNextPage: listQuery.hasNextPage ?? false,
    isFetchingNextPage: listQuery.isFetchingNextPage,
    fetchNextPage: listQuery.fetchNextPage,
  };
}
