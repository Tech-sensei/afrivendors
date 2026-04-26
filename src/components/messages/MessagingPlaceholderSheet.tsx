"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { X, Send, Paperclip } from "lucide-react";

export type MessagingPlaceholderSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Main line in the header (e.g. vendor business name or person name). */
  title: string;
  /** Second line under the title (e.g. service name or category). */
  subtitle: string;
  avatarUrl?: string;
  /** One or two letters for the avatar fallback. */
  avatarFallback: string;
  /** Used in the body copy: "You can still reach {contactName} …". */
  contactName: string;
  streamChatToken?: string;
  createStreamChatChannel: () => void;
  /** Parent-resolved existence (null = checking/loading). */
  channelExists: boolean | null;
  /** When false, UI should behave as not-ready (e.g. Stream client not connected yet). */
  streamClientReady?: boolean;
};

export function MessagingPlaceholderSheet({
  open,
  onOpenChange,
  title,
  subtitle,
  avatarUrl,
  avatarFallback,
  contactName,
  streamChatToken,
  createStreamChatChannel,
  channelExists,
  streamClientReady = true,
}: MessagingPlaceholderSheetProps) {
  const [message, setMessage] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (!open) setMessage("");
  }, [open, title]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side={isMobile ? "bottom" : "right"}
        className={`w-full sm:max-w-md flex flex-col border-0 p-0 overflow-hidden bg-[#F8F5F2] ${isMobile
            ? "rounded-t-3xl max-h-[85vh]"
            : "rounded-l-3xl rounded-tr-none h-full"
          }`}
      >
        <SheetHeader className="px-6 py-4 border-b flex flex-row items-center gap-3 bg-white shrink-0 shadow-sm relative z-10">
          <Avatar className="h-10 w-10 border border-border/50">
            {avatarUrl ? (
              <AvatarImage src={avatarUrl} alt="" className="object-cover" />
            ) : null}
            <AvatarFallback>{avatarFallback}</AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-0.5 text-left overflow-hidden">
            <SheetTitle className="text-base font-bold font-unbounded text-secondary-000 truncate">
              {title}
            </SheetTitle>
            <p className="text-xs text-secondary-300 font-medium truncate">
              {subtitle}
            </p>
          </div>
          <SheetClose className="rounded-full bg-secondary-300/10 p-2 hover:bg-secondary-300/20 transition-colors -mr-2">
            <X className="h-4 w-4 text-secondary-000" />
            <span className="sr-only">Close</span>
          </SheetClose>
        </SheetHeader>

        {channelExists === null ? (
          <div className="flex flex-1 items-center justify-center bg-[#F8F5F2] py-16">
            <Loader2 className="h-8 w-8 animate-spin text-primary-100" />
          </div>
        ) : channelExists ? (
          <div className="flex-1 overflow-y-auto p-4 bg-[#F8F5F2]">
            <p className="text-sm text-secondary-300">Channel exists</p>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#F8F5F2]">
            <div className="flex justify-center my-4">
              <span className="text-xs text-secondary-300/60 bg-white/50 px-3 py-1 rounded-full">
                Today
              </span>
            </div>

            <div className="mx-auto mt-8 max-w-xs rounded-2xl bg-white p-4 text-center shadow-sm border border-border/60">
              <p className="text-xs text-secondary-300 leading-relaxed">
                click the button below to chat with this vendor
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-4"
                onClick={createStreamChatChannel}
                disabled={!streamChatToken || !streamClientReady}
              >
                Chat with {contactName}
              </Button>
            </div>
            <div ref={messagesEndRef} />
          </div>
        )}



        <SheetFooter className="p-4 bg-white border-t shrink-0 sm:flex-col">
          <div className="flex w-full items-end gap-2 bg-[#F8F5F2] p-2 rounded-3xl border border-transparent opacity-60">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full text-secondary-300 mb-0.5 shrink-0"
              disabled={!streamClientReady}
              type="button"
            >
              <Paperclip className="h-4 w-4" />
            </Button>

            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={"Messaging unavailable"}
              className="flex-1 min-h-[40px] max-h-[120px] bg-transparent border-0 focus-visible:ring-0 px-2 py-2.5 text-sm resize-none placeholder:text-secondary-300/60"
              rows={1}
              disabled
            />

            <Button
              type="button"
              disabled
              size="icon"
              className="h-8 w-8 rounded-full mb-0.5 shrink-0 bg-secondary-300/20 text-secondary-300 cursor-not-allowed"
            >
              <Send className="h-3.5 w-3.5 ml-0.5" />
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
