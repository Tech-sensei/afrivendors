"use client";

import { useRef, useEffect } from "react";
import { CheckCheck } from "lucide-react";
import { formatMessageTime } from "@/data/chatData";
import { MessageResponse } from "stream-chat";
import { RootState } from "@/store/store";
import { useSelector } from "react-redux";

export function MessageConversation({
    messages,
}: {
    messages: MessageResponse[];
}) {
    const user = useSelector((state: RootState) => state.auth.user);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    return (
        <div className="h-full flex-1 min-h-0 overflow-y-auto overscroll-contain bg-transparent [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <div className="flex flex-col gap-4">
                {messages.map((message) => {
                    const isCustomer = Number(message.user?.id) === Number(user?.id);

                    return (
                        <div
                            key={message.id}
                            className={`flex ${isCustomer ? "justify-end" : "justify-start"}`}
                        >
                            <div className="max-w-[75%]">
                                <div
                                    className={`px-4 py-3 rounded-2xl text-sm leading-relaxed wrap-break-word ${isCustomer
                                            ? "bg-primary-100 text-white"
                                            : "bg-accent-10 text-secondary-000"
                                        }`}
                                >
                                    {message.text}
                                </div>
                                <div
                                    className={`flex items-center gap-1 mt-1 ${isCustomer ? "justify-end pr-1" : "justify-start pl-1"
                                        }`}
                                >
                                    <span className="text-[11px] text-accent-80">
                                        {formatMessageTime(new Date(message.created_at ?? ""))}
                                    </span>
                                    {isCustomer && (
                                        <CheckCheck
                                            className={`h-3 w-3 ${message.latest_reactions?.length &&
                                                    message.latest_reactions?.length > 0
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
