import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { X, Send, Loader2, Paperclip } from "lucide-react";
import { cn } from "@/lib/utils";
import type { MessageVendorDrawerProps } from "@/types/appointments";
import { useAppSelector } from "@/store/hooks";
import { useCreateAppointmentChannel, useGenerateChatToken } from "@/services/useChat";
import { StreamChat, type Channel as StreamChatChannel } from "stream-chat";

type ChatItem = {
  id: string;
  sender: "user" | "vendor";
  text: string;
  time: string;
};

type StreamLikeMessage = {
  id?: string;
  text?: string;
  created_at?: string | Date | null;
  user?: {
    id?: string;
  };
};

export function MessageVendorDrawer({
  appointment,
  isOpen,
  onClose,
}: MessageVendorDrawerProps) {
  const user = useAppSelector((state) => state.auth.user);
  const [message, setMessage] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const [isBootstrapping, setIsBootstrapping] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [channel, setChannel] = useState<StreamChatChannel | null>(null);
  const [chatHistory, setChatHistory] = useState<ChatItem[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY;
  const { mutateAsync: generateToken } = useGenerateChatToken();
  const { mutateAsync: createChannel } = useCreateAppointmentChannel();

  const initialServiceName = appointment?.services[0]?.serviceName ?? "your service";

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      setMessage("");
      setChannel(null);
      setChatHistory([]);
      setIsLoadingHistory(false);
      return;
    }

    setMessage("");
    setChannel(null);
    setChatHistory([]);
    setIsLoadingHistory(false);
  }, [appointment?.id, isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  const formatTime = (dateInput: string | Date | null | undefined) => {
    if (!dateInput) return "Just now";
    const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
    if (Number.isNaN(date.getTime())) return "Just now";
    return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  };

  const upsertMessage = (incoming: StreamLikeMessage) => {
    if (!incoming?.id || !incoming?.text || !user?.id) return;

    const nextItem: ChatItem = {
      id: incoming.id,
      sender: incoming.user?.id === String(user.id) ? "user" : "vendor",
      text: incoming.text,
      time: formatTime(incoming.created_at),
    };

    setChatHistory((prev) => {
      const existingIndex = prev.findIndex((item) => item.id === nextItem.id);
      if (existingIndex === -1) return [...prev, nextItem];
      const copy = [...prev];
      copy[existingIndex] = nextItem;
      return copy;
    });
  };

  const seedMessagesFromChannel = (activeChannel: StreamChatChannel) => {
    const seededMessages = activeChannel.state.messages
      .filter((item) => item.id && item.text)
      .map((item) => ({
        id: item.id as string,
        sender: (item.user?.id === String(user?.id) ? "user" : "vendor") as ChatItem["sender"],
        text: item.text as string,
        time: formatTime(item.created_at),
      }));

    setChatHistory(seededMessages);
  };

  const ensureConnectedClient = async () => {
    if (!apiKey) {
      throw new Error("Stream API key is missing.");
    }

    if (!user?.id) {
      throw new Error("Please sign in again to start chat.");
    }

    const client = StreamChat.getInstance(apiKey);
    const targetUserId = String(user.id);

    if (client.userID && client.userID !== targetUserId) {
      await client.disconnectUser();
    }

    if (client.userID !== targetUserId) {
      const { userChatToken } = await generateToken();
      await client.connectUser(
        {
          id: targetUserId,
          name: `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() || targetUserId,
          image: user.profilePhoto ?? undefined,
        },
        userChatToken
      );
    }

    return client;
  };

  const ensureChannel = async () => {
    if (!appointment) {
      throw new Error("Appointment is not available.");
    }

    const client = await ensureConnectedClient();
    const { channel: channelId } = await createChannel({
      otherUserId: appointment.vendor.id,
      appointmentId: appointment.id,
    });

    const nextChannel = client.channel("messaging", channelId);
    await nextChannel.watch();
    await nextChannel.markRead();
    seedMessagesFromChannel(nextChannel);
    setChannel(nextChannel);
    return nextChannel;
  };

  useEffect(() => {
    if (!isOpen || !appointment?.id) return;

    let cancelled = false;

    (async () => {
      setIsLoadingHistory(true);
      try {
        const ch = await ensureChannel();
        if (!cancelled) setChannel(ch);
      } catch {
        // channel doesn't exist yet — user will create it on first send
      } finally {
        if (!cancelled) {
          setIsLoadingHistory(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [isOpen, appointment?.id]);

  useEffect(() => {
    if (!channel) return;

    const onNewMessage = channel.on("message.new", (event) => {
      if (event.message) upsertMessage(event.message as StreamLikeMessage);
    });
    const onMessageUpdated = channel.on("message.updated", (event) => {
      if (event.message) upsertMessage(event.message as StreamLikeMessage);
    });

    return () => {
      onNewMessage.unsubscribe();
      onMessageUpdated.unsubscribe();
    };
  }, [channel, user?.id]);

  const handleSendMessage = async () => {
    const text = message.trim();
    if (!text) return;

    try {
      setIsBootstrapping(true);
      const activeChannel = channel ?? (await ensureChannel());
      const response = await activeChannel.sendMessage({ text });
      setMessage("");

      if (response.message) {
        upsertMessage(response.message as StreamLikeMessage);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unable to send message.";
      toast.error(errorMessage);
    } finally {
      setIsBootstrapping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!appointment) return null;

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent 
        side={isMobile ? "bottom" : "right"}
        className={`w-full sm:max-w-md flex flex-col border-0 p-0 overflow-hidden bg-[#F8F5F2] ${
          isMobile ? 'rounded-t-3xl max-h-[85vh]' : 'rounded-l-3xl rounded-tr-none h-full'
        }`}
      >
        {/* Header */}
        <SheetHeader className="px-6 py-4 border-b flex flex-row items-center gap-3 bg-white shrink-0 shadow-sm relative z-10">
          <Avatar className="h-10 w-10 border border-border/50">
            <AvatarImage src={appointment.vendor.profilePhoto ?? ''} className="object-cover" />
            <AvatarFallback>{appointment.vendor.firstName[0]}{appointment.vendor.lastName[0]}</AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-0.5 text-left overflow-hidden">
            <SheetTitle className="text-base font-bold font-unbounded text-secondary-000 truncate">{appointment.vendor.firstName} {appointment.vendor.lastName}</SheetTitle>
            <p className="text-xs text-secondary-300 font-medium truncate">{appointment.services[0]?.serviceName}</p>
          </div>
          <SheetClose className="rounded-full bg-secondary-300/10 p-2 hover:bg-secondary-300/20 transition-colors -mr-2">
             <X className="h-4 w-4 text-secondary-000" />
             <span className="sr-only">Close</span>
           </SheetClose>
        </SheetHeader>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#F8F5F2]">
          <div className="flex justify-center my-4">
            <span className="text-xs text-secondary-300/60 bg-white/50 px-3 py-1 rounded-full">
              Today
            </span>
          </div>

          {isLoadingHistory ? (
            <div className="mx-auto mt-8 max-w-xs rounded-2xl bg-white p-4 text-center shadow-sm border border-border/60">
              <div className="flex items-center justify-center gap-2 text-secondary-300">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm">Loading chat history...</span>
              </div>
            </div>
          ) : chatHistory.length === 0 ? (
            <div className="mx-auto mt-8 max-w-xs rounded-2xl bg-white p-4 text-center shadow-sm border border-border/60">
              <p className="text-sm font-medium text-secondary-000">
                Start chatting with {appointment.vendor.firstName} about {initialServiceName}.
              </p>
              </div>
            ) : (
              chatHistory.map((msg) => (
                <div
                  key={msg.id}
                  className={cn(
                    "flex w-full",
                  msg.sender === "user" ? "justify-end" : "justify-start"
                )}
              >
                <div
                  className={cn(
                    "max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed",
                    msg.sender === "user"
                      ? "bg-secondary-000 text-white rounded-br-none"
                      : "bg-white text-secondary-000 border border-border/50 rounded-bl-none shadow-sm"
                  )}
                >
                  <p>{msg.text}</p>
                  <span
                    className={cn(
                      "text-[10px] mt-1 block opacity-70",
                      msg.sender === "user"
                        ? "text-white/70 text-right"
                        : "text-secondary-300 text-left"
                    )}
                  >
                    {msg.time}
                  </span>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <SheetFooter className="p-4 bg-white border-t shrink-0 sm:flex-col">
          <div className="flex w-full items-end gap-2 bg-[#F8F5F2] p-2 rounded-3xl border border-transparent focus-within:border-primary-100/30 focus-within:bg-white focus-within:shadow-md transition-all duration-200">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full text-secondary-300 hover:text-secondary-000 hover:bg-white/50 mb-0.5 shrink-0"
              disabled
            >
              <Paperclip className="h-4 w-4" />
            </Button>

            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={channel ? "Type your message..." : "Type your first message..."}
              className="flex-1 min-h-[40px] max-h-[120px] bg-transparent border-0 focus-visible:ring-0 px-2 py-2.5 text-sm resize-none placeholder:text-secondary-300/60"
              rows={1}
              disabled={isBootstrapping || isLoadingHistory}
            />

            <Button
              onClick={handleSendMessage}
              disabled={!message.trim() || isBootstrapping || isLoadingHistory}
              size="icon"
              className={cn(
                "h-8 w-8 rounded-full mb-0.5 shrink-0 transition-all duration-200",
                message.trim() && !isBootstrapping
                  ? "bg-primary-100 hover:bg-[#a65620] text-white shadow-md"
                  : "bg-secondary-300/20 text-secondary-300 cursor-not-allowed"
              )}
            >
              {isBootstrapping ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Send className="h-3.5 w-3.5 ml-0.5" />
              )}
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
