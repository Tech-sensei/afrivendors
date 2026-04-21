import type { SupportTicket } from "@/types/support";

export const SUPPORT_TICKET_CATEGORIES = [
  "Payment Issues",
  "Booking Issues",
  "Vendor Questions",
  "Account Issues",
  "Technical Issues",
  "General Inquiry",
] as const;

export type SupportTicketCategory = (typeof SUPPORT_TICKET_CATEGORIES)[number];

export const mockSupportTickets: SupportTicket[] = [
  {
    id: "1",
    subject: "Unable to complete booking payment",
    category: "Payment Issues",
    status: "in-progress",
    priority: "high",
    createdAt: "2025-11-08T10:30:00Z",
    updatedAt: "2025-11-10T14:22:00Z",
    description:
      "I tried to make a payment for my booking but the transaction keeps failing. I have tried multiple cards.",
    messages: [
      {
        id: "1",
        sender: "user",
        content:
          "I tried to make a payment for my booking but the transaction keeps failing. I have tried multiple cards.",
        timestamp: "2025-11-08T10:30:00Z",
        senderName: "You",
      },
      {
        id: "2",
        sender: "support",
        content:
          "Hi! We apologize for the inconvenience. Our payment team is investigating this issue. Could you please provide the last 4 digits of the card you were using?",
        timestamp: "2025-11-09T09:15:00Z",
        senderName: "Support Team",
      },
      {
        id: "3",
        sender: "user",
        content: "The last 4 digits are 4532. Thank you for looking into this.",
        timestamp: "2025-11-09T10:00:00Z",
        senderName: "You",
      },
    ],
  },
  {
    id: "2",
    subject: "Question about vendor verification",
    category: "Vendor Questions",
    status: "resolved",
    priority: "low",
    createdAt: "2025-11-05T09:15:00Z",
    updatedAt: "2025-11-06T11:45:00Z",
    description: "How long does the vendor verification process take?",
    messages: [
      {
        id: "1",
        sender: "user",
        content:
          "How long does the vendor verification process take? I submitted my documents yesterday.",
        timestamp: "2025-11-05T09:15:00Z",
        senderName: "You",
      },
      {
        id: "2",
        sender: "support",
        content:
          "Verification typically takes 2-3 business days. We will notify you via email once your account is verified.",
        timestamp: "2025-11-06T11:45:00Z",
        senderName: "Support Team",
      },
    ],
  },
  {
    id: "3",
    subject: "Booking confirmation not received",
    category: "Booking Issues",
    status: "open",
    priority: "medium",
    createdAt: "2025-11-09T16:20:00Z",
    updatedAt: "2025-11-09T16:20:00Z",
    description:
      "I completed a booking but have not received any confirmation email.",
    messages: [
      {
        id: "1",
        sender: "user",
        content:
          "I completed a booking but have not received any confirmation email. Could you please check?",
        timestamp: "2025-11-09T16:20:00Z",
        senderName: "You",
      },
    ],
  },
];
