"use client";

import { formatTimeAgo } from "@/data/chatData";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { Channel } from "stream-chat";

type ChatListItem = {
    vendorName: string;
    vendorAvatar: string | null;
    unreadCount: number;
    lastMessage: string;
    lastMessageTime: Date | null;
};

function mapChannelToChatItem(channel: Channel): ChatListItem {
    const members = Object.values(channel.state.members || {});

    // find vendor
    const vendorMember: any = members.find(
        (m: any) => m.user?.accountType === "vendor",
    );

    const vendor = vendorMember?.user;

    // last message
    const messages = channel.state.messages || [];
    const lastMsg = messages[messages.length - 1];

    return {
        vendorName: vendor?.vendorBusinessName || "Unknown Vendor",
        vendorAvatar: vendor?.image || null,

        unreadCount: channel.state.unreadCount || 0,

        lastMessage: lastMsg?.text || "",
        lastMessageTime: lastMsg?.created_at ? new Date(lastMsg.created_at) : null,
    };
}

export function ConversationItem({
    conversation,
    onClick,
}: {
    conversation: any;
    onClick: () => void;
}) {
    const {
        vendorAvatar,
        vendorName,
        unreadCount,
        lastMessage,
        lastMessageTime,
    } = mapChannelToChatItem(conversation);

    return (
        <button
            onClick={onClick}
            className={cn(
                "w-full p-5 text-left transition-colors hover:bg-accent-10 border-b border-accent-20",
            )}
        >
            <div className="flex gap-4">
                {/* Avatar */}
                <Avatar className="h-14 w-14 shrink-0">
                    {vendorAvatar && <AvatarImage src={vendorAvatar} alt={vendorName} />}
                    <AvatarFallback className="bg-primary-100 text-white text-xl font-semibold">
                        {vendorName ? vendorName.charAt(0) : "?"}
                    </AvatarFallback>
                </Avatar>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    {/* Header Row */}
                    <div className="flex justify-between items-start mb-1">
                        <h3
                            className={cn(
                                "text-base overflow-hidden text-ellipsis whitespace-nowrap mb-0",
                                unreadCount > 0
                                    ? "font-bold text-secondary-000"
                                    : "font-semibold text-secondary-000",
                            )}
                        >
                            {vendorName}
                        </h3>
                        <span
                            className={cn(
                                "text-xs shrink-0 ml-3",
                                unreadCount > 0
                                    ? "text-primary-100 font-semibold"
                                    : "text-accent-80 font-normal",
                            )}
                        >
                            {formatTimeAgo(lastMessageTime as Date)}
                        </span>
                    </div>

                    {/* Category */}
                    {/* <p className="text-[13px] text-accent-70 mb-2 overflow-hidden text-ellipsis whitespace-nowrap">
            {vendorCategory}
          </p> */}

                    {/* Last Message Row */}
                    <div className="flex justify-between items-center gap-3">
                        <p
                            className={cn(
                                "text-base overflow-hidden text-ellipsis whitespace-nowrap flex-1",
                                unreadCount > 0
                                    ? "text-secondary-000 font-medium"
                                    : "text-accent-80 font-normal",
                            )}
                        >
                            {lastMessage}
                        </p>
                        {unreadCount > 0 && (
                            <span className="bg-primary-100 text-white rounded-xl px-2 py-0.5 text-xs font-semibold ml-2 shrink-0 min-w-[24px] text-center">
                                {unreadCount}
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </button>
    );
}
