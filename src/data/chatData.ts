import type { ChatConversation } from "@/types/messages";

export const chatConversations: ChatConversation[] = [
  {
    id: "conv-1",
    vendorName: "Zuriglow Beauty Hub",
    vendorCategory: "Beauty & Spa",
    lastMessage: "Thank you for booking with us!",
    lastMessageTime: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    unreadCount: 2,
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
  {
    id: "conv-2",
    vendorName: "Elite Catering Services",
    vendorCategory: "Catering",
    lastMessage: "We can accommodate your dietary requirements.",
    lastMessageTime: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    unreadCount: 0,
    messages: [
      {
        id: "msg-5",
        senderId: "customer-1",
        senderType: "customer",
        message: "Do you offer vegetarian options?",
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        read: true,
      },
      {
        id: "msg-6",
        senderId: "vendor-2",
        senderType: "vendor",
        message: "Yes, we have a wide variety of vegetarian options.",
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        read: true,
      },
      {
        id: "msg-7",
        senderId: "vendor-2",
        senderType: "vendor",
        message: "We can accommodate your dietary requirements.",
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        read: true,
      },
    ],
  },
  {
    id: "conv-3",
    vendorName: "TastyRoots Catering",
    vendorCategory: "Catering",
    lastMessage: "We can accommodate your dietary requirements.",
    lastMessageTime: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    unreadCount: 1,
    messages: [
      {
        id: "msg-5",
        senderId: "customer-1",
        senderType: "customer",
        message: "Do you offer vegetarian options?",
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        read: false,
      },
      {
        id: "msg-6",
        senderId: "vendor-2",
        senderType: "vendor",
        message: "Yes, we have a wide variety of vegetarian options.",
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        read: true,
      },
      {
        id: "msg-7",
        senderId: "vendor-2",
        senderType: "vendor",
        message: "We can accommodate your dietary requirements.",
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
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
