"use client";

import { cn } from "@/lib/utils";
import type { SupportMessage } from "@/types/support";
import { formatSupportMessageTime } from "@/lib/supportDates";

export function TicketMessageBubble({ message }: { message: SupportMessage }) {
  const isUser = message.sender === "user";

  return (
    <div className={cn("flex flex-col gap-1", isUser ? "items-end" : "items-start")}>
      <div
        className={cn(
          "max-w-[92%] rounded-2xl px-4 py-3 sm:max-w-[85%]",
          isUser
            ? "rounded-br-sm bg-primary-100 text-white"
            : "rounded-bl-sm border border-accent-20 bg-white text-secondary-000"
        )}
      >
        <p
          className={cn(
            "font-unageo text-xs font-semibold opacity-90",
            isUser ? "text-white/90" : "text-accent-80"
          )}
        >
          {message.senderName}
        </p>
        <p className="mt-1 font-unageo text-sm leading-relaxed">{message.content}</p>
        <p
          className={cn(
            "mt-2 font-unageo text-[11px]",
            isUser ? "text-white/70" : "text-accent-60"
          )}
        >
          {formatSupportMessageTime(message.timestamp)}
        </p>
      </div>
    </div>
  );
}
