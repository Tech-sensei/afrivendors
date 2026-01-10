"use client";

import { ChatConversation, formatTimeAgo } from "@/data/chatData";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface ConversationItemProps {
    conversation: ChatConversation;
    isLast: boolean;
    onClick: () => void;
}

export function ConversationItem({
    conversation,
    isLast,
    onClick,
}: ConversationItemProps) {
    const hasUnread = conversation.unreadCount > 0;

    return (
        <button
            onClick={onClick}
            className={cn(
                "w-full p-5 text-left transition-colors hover:bg-accent-10",
                !isLast && "border-b border-accent-20"
            )}
        >
            <div className="flex gap-4">
                {/* Avatar */}
                <Avatar className="h-14 w-14 shrink-0">
                    <AvatarFallback className="bg-primary-100 text-white text-xl font-semibold">
                        {conversation.vendorName.charAt(0)}
                    </AvatarFallback>
                </Avatar>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    {/* Header Row */}
                    <div className="flex justify-between items-start mb-1">
                        <h3
                            className={cn(
                                "text-base overflow-hidden text-ellipsis whitespace-nowrap mb-0",
                                hasUnread ? "font-bold text-secondary-000" : "font-semibold text-secondary-000"
                            )}
                        >
                            {conversation.vendorName}
                        </h3>
                        <span
                            className={cn(
                                "text-xs flex-shrink-0 ml-3",
                                hasUnread
                                    ? "text-primary-100 font-semibold"
                                    : "text-accent-80 font-normal"
                            )}
                        >
                            {formatTimeAgo(conversation.lastMessageTime)}
                        </span>
                    </div>

                    {/* Category */}
                    <p className="text-[13px] text-accent-70 mb-2 overflow-hidden text-ellipsis whitespace-nowrap">
                        {conversation.vendorCategory}
                    </p>

                    {/* Last Message Row */}
                    <div className="flex justify-between items-center gap-3">
                        <p
                            className={cn(
                                "text-base overflow-hidden text-ellipsis whitespace-nowrap flex-1",
                                hasUnread
                                    ? "text-secondary-000 font-medium"
                                    : "text-accent-80 font-normal"
                            )}
                        >
                            {conversation.lastMessage}
                        </p>
                        {hasUnread && (
                            <span className="bg-primary-100 text-white rounded-xl px-2 py-0.5 text-xs font-semibold ml-2 flex-shrink-0 min-w-[24px] text-center">
                                {conversation.unreadCount}
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </button>
    );
}
