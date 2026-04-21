"use client";

import { HelpSupportHeader } from "./HelpSupportHeader";
import { HelpSupportTabs } from "./HelpSupportTabs";
import { TicketsListSection } from "./TicketsListSection";
import { ContactInfoPanel } from "./ContactInfoPanel";
import { CreateTicketSheet } from "./CreateTicketSheet";
import { TicketDetailSheet } from "./TicketDetailSheet";
import { useSupportTickets } from "@/hooks/useSupportTickets";

export function HelpSupportDashboard() {
  const {
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
    isCreatingTicket,
    ticketsLoading,
    ticketsError,
    ticketsErrorMessage,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useSupportTickets();

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-secondary-800/30">
      <HelpSupportHeader onNewTicket={() => setShowCreateTicket(true)} />
      <HelpSupportTabs activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="flex-1 overflow-y-auto px-5 py-8 sm:px-8">
        {activeTab === "tickets" ? (
          <TicketsListSection
            tickets={tickets}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            filterStatus={filterStatus}
            onFilterStatusChange={setFilterStatus}
            onSelectTicket={openTicket}
            isLoading={ticketsLoading}
            isError={ticketsError}
            errorMessage={ticketsErrorMessage}
            hasNextPage={hasNextPage}
            isFetchingNextPage={isFetchingNextPage}
            onLoadMore={() => fetchNextPage()}
          />
        ) : (
          <ContactInfoPanel />
        )}
      </div>

      <CreateTicketSheet
        isOpen={showCreateTicket}
        onOpenChange={setShowCreateTicket}
        onSubmit={handleCreateTicket}
        isSubmitting={isCreatingTicket}
      />

      <TicketDetailSheet
        ticket={selectedTicket}
        isOpen={detailOpen}
        onOpenChange={closeDetail}
        isEditMode={isEditMode}
        editValues={editValues}
        onEditChange={patchEdit}
        newMessage={newMessage}
        onNewMessageChange={setNewMessage}
        onSendMessage={handleSendMessage}
        onStartEdit={handleStartEdit}
        onCancelEdit={handleCancelEdit}
        onSaveEdit={handleSaveEdit}
        onUpdateStatus={handleUpdateTicketStatus}
      />
    </div>
  );
}
