"use client";

import { useRef, useEffect } from "react";
import { CheckCheck } from "lucide-react";
import { formatMessageTime } from "@/data/chatData";
import type { MessageConversationProps } from "@/types/messages";

export function MessageConversation({ messages }: MessageConversationProps) {
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    return (
        <div className="bg-accent-10 rounded-xl p-4 min-h-[400px] max-h-[500px] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <div className="flex flex-col gap-4">
                {messages.map((message, index) => {
                    const isCustomer = message.senderType === "customer";
                    const showTime =
                        index === 0 ||
                        messages[index - 1].timestamp.getTime() - message.timestamp.getTime() >
                        5 * 60 * 1000;

                    return (
                        <div
                            key={message.id}
                            className={`flex ${isCustomer ? "justify-end" : "justify-start"}`}
                        >
                            <div className="max-w-[75%]">
                                <div
                                    className={`px-4 py-3 rounded-2xl text-sm leading-relaxed break-words ${isCustomer
                                        ? "bg-primary-100 text-white"
                                        : "bg-white text-secondary-000 shadow-sm"
                                        }`}
                                >
                                    {message.message}
                                </div>
                                <div
                                    className={`flex items-center gap-1 mt-1 ${isCustomer ? "justify-end pr-1" : "justify-start pl-1"
                                        }`}
                                >
                                    <span className="text-[11px] text-accent-80">
                                        {formatMessageTime(message.timestamp)}
                                    </span>
                                    {isCustomer && (
                                        <CheckCheck
                                            className={`h-3 w-3 ${message.read
                                                ? "text-primary-100"
                                                : "text-accent-80"
                                                }`}
                                        />
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>
        </div>
    );
}
