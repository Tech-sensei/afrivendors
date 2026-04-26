"use client";

import { useEffect, useState } from "react";
import { MessageCircle } from "lucide-react";
import { ConversationItem } from "@/components/messages/ConversationItem";
import { SearchBar } from "@/components/messages/SearchBar";
import { ConversationSheet } from "@/components/messages/ConversationSheet";
import useStreamChat from "@/hooks/useStreamChat";
import { Channel } from "stream-chat";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useStreamChatToken } from "@/services/useStreamChat";
import streamChat from "@/lib/streamChat";

export default function MessagesPage() {
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [conversations, setConversations] = useState<Channel[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const { user } = useSelector((state: RootState) => state.auth);

  const { getAllChannels, instantiateUser } = useStreamChat();
  const { data: streamChatToken } = useStreamChatToken();
  const [streamReady, setStreamReady] = useState(false);
  const [channelsRefreshKey, setChannelsRefreshKey] = useState(0);

  useEffect(() => {
    const token = streamChatToken?.userChatToken;
    if (user?.id && token) {
      let cancelled = false;
      setStreamReady(false);

      const userName = `${user?.firstName} ${user?.lastName}`;
      const userImage = user?.profilePhoto;
      void instantiateUser(
        user?.id as number,
        userName,
        userImage ?? "",
        token,
      ).then(
        () => {
          if (!cancelled) setStreamReady(true);
        },
        () => {
          if (!cancelled) setStreamReady(false);
        },
      );

      return () => {
        cancelled = true;
      };
    }

    setStreamReady(false);
    return undefined;
  }, [
    instantiateUser,
    user?.id,
    user?.firstName,
    user?.lastName,
    user?.profilePhoto,
    streamChatToken?.userChatToken,
  ]);

  useEffect(() => {
    if (!streamReady || !user?.id) return;
    void getAllChannels(String(user.id)).then((channels) => {
      // console.log(channels);
      setConversations(channels);
    });
  }, [getAllChannels, streamReady, user?.id, channelsRefreshKey]);

  useEffect(() => {
    if (!streamReady) return;

    // Keep channel list (unreadCount / last_message) in sync without refresh.
    const handler = () => setChannelsRefreshKey((k) => k + 1);

    streamChat.on("message.new", handler);
    streamChat.on("notification.message_new", handler);
    streamChat.on("message.read", handler);
    streamChat.on("notification.mark_read", handler);
    streamChat.on("notification.mark_unread", handler);
    streamChat.on("channel.updated", handler);

    return () => {
      streamChat.off("message.new", handler);
      streamChat.off("notification.message_new", handler);
      streamChat.off("message.read", handler);
      streamChat.off("notification.mark_read", handler);
      streamChat.off("notification.mark_unread", handler);
      streamChat.off("channel.updated", handler);
    };
  }, [streamReady]);

  const handleSelectChat = (chatId: string) => {
    setSelectedChat(chatId);
    setDrawerOpen(true);
  };

  const handleCloseDrawer = (open: boolean) => {
    setDrawerOpen(open);
    if (!open) {
      setTimeout(() => setSelectedChat(null), 300);
    }
  };

  const filteredConversations = conversations.filter((conv: any) => {
    if (!searchQuery) return true;
    const name = String(conv?.data?.name ?? conv?.id ?? "").toLowerCase();
    return name.includes(searchQuery.toLowerCase());
  });

  return (
    <div className="">
      <div className="mb-6">
        <h1 className="font-unbounded text-[28px] leading-8 font-semibold text-secondary-200 mb-2">
          Messages
        </h1>
        <p className="text-sm text-accent-80 leading-relaxed">
          Chat with vendors you&apos;ve booked services with
          {/* {totalUnread > 0 && (
            <span className="ml-2 inline-flex items-center justify-center bg-primary-100 text-white rounded-xl px-2 py-0.5 text-xs font-semibold align-middle">
              {totalUnread} unread
            </span>
          )} */}
        </p>
      </div>

      <div className="mb-5">
        <SearchBar value={searchQuery} onChange={setSearchQuery} />
      </div>

      <div className="bg-white rounded-2xl border border-accent-20 overflow-hidden">
        {!streamReady ? (
          <div className="p-12 text-center">
            <MessageCircle className="h-12 w-12 text-accent-80 mx-auto mb-4" />
            <p className="text-base font-medium text-secondary-000 mb-2">
              Connecting chat…
            </p>
            <p className="text-sm text-accent-80">Please wait a moment.</p>
          </div>
        ) : filteredConversations.length === 0 ? (
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
            {filteredConversations.map((conversation: any) => (
              <ConversationItem
                key={conversation.id}
                conversation={conversation}
                onClick={() => handleSelectChat(conversation.id as string)}
              />
            ))}
          </div>
        )}
      </div>

      {streamReady && selectedChat && (
        <ConversationSheet
          open={drawerOpen}
          onOpenChange={handleCloseDrawer}
          conversationId={selectedChat}
          onConversationRead={() => {
            // Force re-fetch so ConversationItem reflects updated unread counts.
            setChannelsRefreshKey((k) => k + 1);
          }}
        />
      )}
    </div>
  );
}
