"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { useSelector } from "react-redux";
import { MessagingPlaceholderSheet } from "@/components/messages/MessagingPlaceholderSheet";
import { ConversationSheet } from "@/components/messages/ConversationSheet";
import {
  useCreateStreamChatChannel,
  useStreamChatToken,
} from "@/services/useStreamChat";
import useStreamChat from "@/hooks/useStreamChat";
import { getCustomRequestChannelId } from "@/lib/customRequestChannel";
import type { CustomOrderMessageContext } from "@/types/customOrders";
import { RootState } from "@/store/store";

type Props = {
  context: CustomOrderMessageContext | null;
  isOpen: boolean;
  onClose: () => void;
};

export function MessageCustomOrderDrawer({ context, isOpen, onClose }: Props) {
  const { user } = useSelector((state: RootState) => state.auth);
  const { data: streamChatToken } = useStreamChatToken();
  const { mutate: createStreamChatChannel } = useCreateStreamChatChannel();
  const { instantiateUser, checkIfChannelExists } = useStreamChat();

  const [streamClientReady, setStreamClientReady] = useState(false);
  const [channelRecheckKey, setChannelRecheckKey] = useState(0);
  const [channelExists, setChannelExists] = useState<boolean | null>(null);

  useEffect(() => {
    if (!context || !isOpen) {
      setStreamClientReady(false);
      setChannelExists(null);
      return undefined;
    }

    const token = streamChatToken?.userChatToken;
    if (!token) {
      setStreamClientReady(false);
      setChannelExists(null);
      return undefined;
    }

    let cancelled = false;
    setStreamClientReady(false);

    const userName = `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim();
    void instantiateUser(
      user?.id ?? 0,
      userName,
      user?.profilePhoto ?? "",
      token,
    ).then(
      () => {
        if (!cancelled) setStreamClientReady(true);
      },
      () => {
        if (!cancelled) setStreamClientReady(false);
      },
    );

    return () => {
      cancelled = true;
      setStreamClientReady(false);
      setChannelExists(null);
    };
  }, [
    context,
    isOpen,
    streamChatToken?.userChatToken,
    user?.firstName,
    user?.lastName,
    user?.profilePhoto,
    user?.id,
    instantiateUser,
  ]);

  useEffect(() => {
    if (!isOpen || !context || !streamClientReady) {
      setChannelExists(null);
      return;
    }

    let cancelled = false;
    setChannelExists(null);

    const channelId = getCustomRequestChannelId(context.orderId);
    void (async () => {
      try {
        const exists = await checkIfChannelExists(channelId);
        if (!cancelled) setChannelExists(exists);
      } catch {
        if (!cancelled) setChannelExists(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [
    isOpen,
    context,
    streamClientReady,
    checkIfChannelExists,
    channelRecheckKey,
  ]);

  if (!context || !isOpen) return null;

  const handleCreateStreamChatChannel = () => {
    createStreamChatChannel(
      {
        otherUserId: context.otherUserId,
        customRequestId: Number(context.orderId),
      },
      {
        onSuccess: () => {
          setChannelRecheckKey((k) => k + 1);
        },
      },
    );
  };

  const nameParts = context.contactName.trim().split(/\s+/).filter(Boolean);
  const fallback =
    nameParts.length >= 2
      ? `${nameParts[0]?.[0] ?? ""}${nameParts[1]?.[0] ?? ""}`
      : (nameParts[0]?.slice(0, 2) ?? "VN").toUpperCase();

  const handleCloseDrawer = (open: boolean) => {
    if (!open) onClose();
  };

  const channelId = getCustomRequestChannelId(context.orderId);

  if (channelExists === null) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-primary-100" />
      </div>
    );
  }

  if (channelExists) {
    return (
      <ConversationSheet
        open={isOpen}
        onOpenChange={handleCloseDrawer}
        conversationId={channelId}
      />
    );
  }

  return (
    <MessagingPlaceholderSheet
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
      title={context.contactName}
      subtitle={context.contactSubtitle ?? context.orderTitle}
      avatarUrl={context.contactAvatar}
      avatarFallback={fallback}
      contactName={nameParts[0] ?? context.contactName}
      streamChatToken={streamChatToken?.userChatToken}
      createStreamChatChannel={handleCreateStreamChatChannel}
      channelExists={channelExists}
      streamClientReady={streamClientReady}
    />
  );
}
