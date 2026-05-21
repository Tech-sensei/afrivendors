import type { MessageVendorDrawerProps } from "@/types/appointments";
import { MessagingPlaceholderSheet } from "@/components/messages/MessagingPlaceholderSheet";
import { ConversationSheet } from "@/components/messages/ConversationSheet";
import {
  useCreateStreamChatChannel,
  useStreamChatToken,
} from "@/services/useStreamChat";
import useStreamChat from "@/hooks/useStreamChat";
import { useEffect, useState } from "react";
import { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import { Loader2 } from "lucide-react";

export function MessageVendorDrawer({
  appointment,
  isOpen,
  onClose,
}: MessageVendorDrawerProps) {
  const { user } = useSelector((state: RootState) => state.auth);

  const { data: streamChatToken } = useStreamChatToken();
  const { mutate: createStreamChatChannel } = useCreateStreamChatChannel();

  const { instantiateUser, checkIfChannelExists } = useStreamChat();

  const [streamClientReady, setStreamClientReady] = useState(false);
  const [channelRecheckKey, setChannelRecheckKey] = useState(0);
  const [channelExists, setChannelExists] = useState<boolean | null>(null);

  useEffect(() => {
    if (!appointment || !isOpen) {
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
    appointment,
    isOpen,
    streamChatToken?.userChatToken,
    user?.firstName,
    user?.lastName,
    user?.profilePhoto,
    user?.id,
    instantiateUser,
  ]);

  useEffect(() => {
    if (!isOpen || !appointment || !streamClientReady) {
      setChannelExists(null);
      return;
    }

    let cancelled = false;
    setChannelExists(null);

    const channelId = `appointment-${appointment.id}`;
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
    appointment,
    streamClientReady,
    checkIfChannelExists,
    channelRecheckKey,
  ]);

  // IMPORTANT: don't disconnect Stream on unmount here.
  // `streamChat` is a singleton client; disconnecting in this drawer will break other pages
  // (e.g. navigating to `/messages` right after leaving appointments).

  if (!appointment || !isOpen) return null;

  const handleCreateStreamChatChannel = () => {
    createStreamChatChannel(
      {
        otherUserId: appointment.vendor.id,
        appointmentId: appointment.id,
      },
      {
        onSuccess: () => {
          setChannelRecheckKey((k) => k + 1);
        },
      },
    );
  };

  const v = appointment.vendor;
  const fallback = `${v.firstName[0] ?? ""}${v.lastName[0] ?? ""}`;

  const handleCloseDrawer = (open: boolean) => {
    if (!open) onClose();
  };

  return (
    <>
      {channelExists === null ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-primary-100" />
        </div>
      ) : channelExists ? (
        <ConversationSheet
          open={isOpen}
          onOpenChange={handleCloseDrawer}
          conversationId={`appointment-${appointment.id}`}
        />
      ) : (
        <MessagingPlaceholderSheet
          open={isOpen}
          onOpenChange={(open) => {
            if (!open) onClose();
          }}
          title={`${v.firstName} ${v.lastName}`}
          subtitle={appointment.services[0]?.serviceName ?? ""}
          avatarUrl={v.profilePhoto ?? undefined}
          avatarFallback={fallback}
          contactName={v.firstName}
          streamChatToken={streamChatToken?.userChatToken}
          createStreamChatChannel={handleCreateStreamChatChannel}
          channelExists={channelExists}
          streamClientReady={streamClientReady}
        />
      )}
    </>
  );
}
