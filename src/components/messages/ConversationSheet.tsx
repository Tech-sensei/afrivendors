"use client";

import { useState, useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
  SheetFooter,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { X, Send, Paperclip } from "lucide-react";
import { cn } from "@/lib/utils";
import { MessageConversation } from "@/components/messages/MessageConversation";
import useStreamChat from "@/hooks/useStreamChat";
import { QueryChannelAPIResponse } from "stream-chat";
import { toast } from "sonner";

interface VendorInfo {
  name: string;
  avatar: string;
  initials: string;
  status: "online" | "offline";
}

function mapChannelToVendorInfo(
  channel: QueryChannelAPIResponse | null | undefined,
): VendorInfo {
  const members = Object.values(channel?.members || {});

  // find user
  const userMember: any = members.find(
    (m: any) => m.user?.accountType === "vendor",
  );

  const user = userMember?.user;

  return {
    name: user?.name || "Unknown Vendor",
    avatar: user?.image || "",
    status: user?.online ? "online" : "offline",
    initials:
      user?.name
        ?.split(" ")
        .map((n: any) => n[0])
        .join("")
        .substring(0, 2)
        .toUpperCase() ?? "",
  };
}

type ConversationSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  conversationId: string;
  /** Called after we load/mark-read to refresh the channel list. */
  onConversationRead?: (conversationId: string) => void;
};

export function ConversationSheet({
  open,
  onOpenChange,
  conversationId,
  onConversationRead,
}: ConversationSheetProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [draft, setDraft] = useState("");

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (!open) setDraft("");
  }, [open, conversationId]);

  //get conversation from stream chat
  const { getChannelMessages, sendMessage } = useStreamChat();
  const [conversation, setConversation] =
    useState<QueryChannelAPIResponse | null>(null);

  useEffect(() => {
    if (!open || !conversationId) return;
    void getChannelMessages(conversationId).then((response) => {
      setConversation(response);
      // If Stream updated unread counts (mark read), ask parent to refresh its list.
      onConversationRead?.(conversationId);
    });
  }, [open, conversationId, getChannelMessages, onConversationRead]);

  const handleSend = () => {
    const t = draft.trim();
    if (t) {
      void sendMessage(conversationId, t)
        .then(() => {
          //update conversation
          void getChannelMessages(conversationId).then((response) => {
            setConversation(response);
          });
          setDraft("");
        })
        .catch((error) => {
          console.error(error);
          toast.error("Failed to send message");
        });
    } else {
      toast.error("Please enter a message");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!conversation) return null;

  const vendorInfo = mapChannelToVendorInfo(conversation);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side={isMobile ? "bottom" : "right"}
        className={cn(
          "w-full sm:max-w-md flex flex-col border-0 p-0 overflow-hidden bg-[#F8F5F2]",
          isMobile
            ? "rounded-t-3xl max-h-[85vh]"
            : "rounded-l-3xl rounded-tr-none h-full",
        )}
      >
        <SheetHeader className="px-6 py-4 border-b flex flex-row items-center gap-3 bg-white shrink-0 shadow-sm relative z-10">
          <Avatar className="h-10 w-10 border border-border/50">
            {vendorInfo.avatar ? (
              <AvatarImage
                src={vendorInfo.avatar}
                alt=""
                className="object-cover"
              />
            ) : null}
            <AvatarFallback>{vendorInfo.initials}</AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-0.5 text-left overflow-hidden">
            <SheetTitle className="text-base font-bold font-unbounded text-secondary-000 truncate">
              {vendorInfo.name}
            </SheetTitle>
            <p className="text-xs text-secondary-300 font-medium truncate">
              {vendorInfo.status}
            </p>
          </div>
          <SheetClose className="rounded-full bg-secondary-300/10 p-2 hover:bg-secondary-300/20 transition-colors -mr-2">
            <X className="h-4 w-4 text-secondary-000" />
            <span className="sr-only">Close</span>
          </SheetClose>
        </SheetHeader>

        <div className="flex flex-1 flex-col min-h-0 overflow-hidden">
          <div className="flex-1 min-h-0 overflow-hidden px-4 pt-4 pb-2">
            <MessageConversation messages={conversation?.messages ?? []} />
          </div>

          <SheetFooter className="p-4 bg-white border-t border-accent-20 shrink-0 sm:flex-col gap-0">
            <div className="flex w-full items-end gap-2 bg-[#F8F5F2] p-2 rounded-3xl border border-accent-20/40 focus-within:border-primary-100/30 focus-within:shadow-sm transition-all">
              <Button
                variant="ghost"
                size="icon"
                type="button"
                className="h-8 w-8 rounded-full text-secondary-300 hover:text-secondary-000 hover:bg-white/50 mb-0.5 shrink-0"
                disabled
                aria-hidden
              >
                <Paperclip className="h-4 w-4" />
              </Button>

              <Textarea
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="Type a message..."
                rows={1}
                className="flex-1 min-h-[40px] max-h-[120px] bg-transparent border-0 focus-visible:ring-0 px-2 py-2.5 text-sm resize-none placeholder:text-secondary-300/60"
                onKeyDown={handleKeyPress}
              />

              <Button
                type="button"
                size="icon"
                onClick={handleSend}
                disabled={!draft.trim()}
                className={cn(
                  "h-8 w-8 rounded-full mb-0.5 shrink-0 transition-all",
                  draft.trim()
                    ? "bg-primary-100 hover:bg-primary-100/90 text-white shadow-md"
                    : "bg-secondary-300/20 text-secondary-300 cursor-not-allowed",
                )}
                aria-label="Send message"
              >
                <Send className="h-3.5 w-3.5 ml-0.5" />
              </Button>
            </div>
          </SheetFooter>
        </div>
      </SheetContent>
    </Sheet>
  );
}
