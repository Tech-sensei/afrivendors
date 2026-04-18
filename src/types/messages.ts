export interface ChatMessage {
  id: string;
  senderId: string;
  senderType: "customer" | "vendor";
  message: string;
  timestamp: Date;
  read: boolean;
}

export interface ChatConversation {
  id: string;
  vendorName: string;
  vendorCategory: string;
  vendorAvatar?: string;
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
  messages: ChatMessage[];
}

export interface MessageConversationProps {
  messages: ChatMessage[];
}

export interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export interface ConversationItemProps {
  conversation: ChatConversation;
  isLast: boolean;
  onClick: () => void;
}
