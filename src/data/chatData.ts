import type { ChatConversation } from "@/types/messages";

/** Single demo conversation for the Messages inbox. */
export const chatConversations: ChatConversation[] = [
  {
    id: "conv-1",
    vendorName: "Zuriglow Beauty Hub",
    vendorCategory: "Beauty & Spa",
    lastMessage: "Thank you for booking with us!",
    lastMessageTime: new Date(Date.now() - 2 * 60 * 60 * 1000),
    unreadCount: 1,
    messages: [
      {
        id: "msg-1",
        senderId: "vendor-1",
        senderType: "vendor",
        message: "Hello! Thank you for booking with us. We're excited to serve you.",
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
        read: true,
      },
      {
        id: "msg-2",
        senderId: "customer-1",
        senderType: "customer",
        message: "Hi! I'm looking forward to my appointment.",
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
        read: true,
      },
      {
        id: "msg-3",
        senderId: "vendor-1",
        senderType: "vendor",
        message: "Great! We'll see you then. Please arrive 10 minutes early.",
        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
        read: true,
      },
      {
        id: "msg-4",
        senderId: "vendor-1",
        senderType: "vendor",
        message: "Thank you for booking with us!",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        read: false,
      },
    ],
  },
];

export function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "Just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  return date.toLocaleDateString();
}

export function formatMessageTime(date: Date): string {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const messageDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

  if (messageDate.getTime() === today.getTime()) {
    return date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
  }

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (messageDate.getTime() === yesterday.getTime()) {
    return "Yesterday";
  }

  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}
