"use client";

import { Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { SupportMessage, SupportTicketStatus } from "@/types/support";
import { TicketMessageBubble } from "./TicketMessageBubble";

export function TicketMessagesThread({
  messages,
  status,
  newMessage,
  onNewMessageChange,
  onSend,
  isLoading,
  loadError,
}: {
  messages: SupportMessage[];
  status: SupportTicketStatus;
  newMessage: string;
  onNewMessageChange: (value: string) => void;
  onSend: () => void;
  isLoading?: boolean;
  loadError?: boolean;
}) {
  const canReply = status !== "closed";
  const countLabel = isLoading ? "…" : String(messages.length);

  return (
    <div className="space-y-3">
      <h4 className="font-unageo text-xs font-bold uppercase tracking-widest text-accent-60">
        Conversation ({countLabel})
      </h4>
      <div className="relative flex max-h-[min(360px,45vh)] flex-col gap-3 overflow-y-auto rounded-2xl border border-accent-20 bg-secondary-800/50 p-4">
        {loadError && (
          <p className="font-unageo text-center text-sm text-red-600">
            Could not load messages. Pull to refresh or try again later.
          </p>
        )}
        {isLoading && !loadError && (
          <div
            className="absolute inset-0 z-10 flex items-center justify-center rounded-2xl bg-white/70 backdrop-blur-[1px]"
            role="status"
            aria-live="polite"
            aria-busy="true"
          >
            <Loader2 className="h-8 w-8 animate-spin text-primary-100" />
          </div>
        )}
        {!loadError &&
          messages.map((m) => <TicketMessageBubble key={m.id} message={m} />)}
        {!loadError && !isLoading && messages.length === 0 && (
          <p className="py-6 text-center font-unageo text-sm text-accent-60">
            No messages yet.
          </p>
        )}
      </div>
      {canReply && (
        <div className="flex gap-2 pt-1">
          <Input
            value={newMessage}
            onChange={(e) => onNewMessageChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                onSend();
              }
            }}
            placeholder="Type a message…"
            className="h-11 flex-1 rounded-full border-accent-20 font-unageo text-sm focus-visible:border-primary-100"
          />
          <Button
            type="button"
            size="icon"
            disabled={!newMessage.trim()}
            className="h-11 w-11 shrink-0 rounded-full bg-primary-100 hover:bg-primary-100/90 disabled:opacity-40"
            onClick={onSend}
            aria-label="Send message"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
