"use client";

import { useState } from "react";
import { MessageCircle } from "lucide-react";
import { ConversationItem } from "@/components/messages/ConversationItem";
import { SearchBar } from "@/components/messages/SearchBar";
import type { ChatConversation, ChatMessage } from "@/types/messages";
import { chatConversations } from "@/data/chatData";
import { ConversationSheet } from "@/components/messages/ConversationSheet";

export default function MessagesPage() {
  const [selectedChat, setSelectedChat] = useState<ChatConversation | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [conversations, setConversations] = useState<ChatConversation[]>(() =>
    chatConversations.map((c) => ({
      ...c,
      messages: c.messages.map((m) => ({ ...m, timestamp: new Date(m.timestamp) })),
    }))
  );
  const [searchQuery, setSearchQuery] = useState("");

  const handleSelectChat = (chat: ChatConversation) => {
    const cleared: ChatConversation = {
      ...chat,
      unreadCount: 0,
      messages: chat.messages.map((m) => ({ ...m, read: true })),
    };
    setSelectedChat(cleared);
    setDrawerOpen(true);
    setConversations((prev) => prev.map((c) => (c.id === chat.id ? cleared : c)));
  };

  const handleCloseDrawer = (open: boolean) => {
    setDrawerOpen(open);
    if (!open) {
      setTimeout(() => setSelectedChat(null), 300);
    }
  };

  const filteredConversations = conversations.filter(
    (conv) =>
      conv.vendorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.vendorCategory.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalUnread = conversations.reduce((sum, conv) => sum + conv.unreadCount, 0);

  const handleSendMessage = (text: string) => {
    if (!selectedChat) return;
    const newMsg: ChatMessage = {
      id: `local-${Date.now()}`,
      senderId: "customer",
      senderType: "customer",
      message: text,
      timestamp: new Date(),
      read: true,
    };
    const updated: ChatConversation = {
      ...selectedChat,
      messages: [...selectedChat.messages, newMsg],
      lastMessage: text,
      lastMessageTime: newMsg.timestamp,
    };
    setSelectedChat(updated);
    setConversations((prev) => prev.map((c) => (c.id === selectedChat.id ? updated : c)));
  };

  return (
    <div className="">
      <div className="mb-6">
        <h1 className="font-unbounded text-[28px] leading-8 font-semibold text-secondary-200 mb-2">
          Messages
        </h1>
        <p className="text-sm text-accent-80 leading-relaxed">
          Chat with vendors you&apos;ve booked services with
          {totalUnread > 0 && (
            <span className="ml-2 inline-flex items-center justify-center bg-primary-100 text-white rounded-xl px-2 py-0.5 text-xs font-semibold align-middle">
              {totalUnread} unread
            </span>
          )}
        </p>
      </div>

      <div className="mb-5">
        <SearchBar value={searchQuery} onChange={setSearchQuery} />
      </div>

      <div className="bg-white rounded-2xl border border-accent-20 overflow-hidden">
        {filteredConversations.length === 0 ? (
          <div className="p-12 text-center">
            <MessageCircle className="h-12 w-12 text-accent-80 mx-auto mb-4" />
            <p className="text-base font-medium text-secondary-000 mb-2">
              {searchQuery ? "No conversations found" : "No messages yet"}
            </p>
            <p className="text-sm text-accent-80">
              {!searchQuery && "Book a service to start chatting with vendors"}
            </p>
          </div>
        ) : (
          <div>
            {filteredConversations.map((conversation, index) => (
              <ConversationItem
                key={conversation.id}
                conversation={conversation}
                isLast={index === filteredConversations.length - 1}
                onClick={() => handleSelectChat(conversation)}
              />
            ))}
          </div>
        )}
      </div>

      {selectedChat && (
        <ConversationSheet
          open={drawerOpen}
          onOpenChange={handleCloseDrawer}
          conversation={selectedChat}
          onSendMessage={handleSendMessage}
        />
      )}
    </div>
  );
}
