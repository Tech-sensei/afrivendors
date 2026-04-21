export type SupportTicketStatus =
  | "open"
  | "pending"
  | "in-progress"
  | "resolved"
  | "closed";

export type SupportTicketPriority = "low" | "medium" | "high" | "urgent";

export type SupportMessageSender = "user" | "support";

export interface SupportMessage {
  id: string;
  sender: SupportMessageSender;
  content: string;
  timestamp: string;
  senderName: string;
}

export interface SupportTicket {
  id: string;
  subject: string;
  category: string;
  status: SupportTicketStatus;
  priority: SupportTicketPriority;
  createdAt: string;
  updatedAt: string;
  description: string;
  messages: SupportMessage[];
}

export interface NewTicketFormState {
  subject: string;
  category: string;
  priority: SupportTicketPriority;
  description: string;
}

export type HelpSupportTabId = "tickets" | "overview";

/** GET /tickets/:id/messages item */
export interface TicketMessageApiSender {
  id: number;
  firstName: string;
  lastName: string;
  accountType: string;
}

export interface TicketMessageApi {
  id: number;
  message: string;
  attachments: unknown[];
  createdAt: string;
  sender: TicketMessageApiSender;
}
