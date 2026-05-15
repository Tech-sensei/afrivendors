export type ClientPaymentStatus = "pending" | "completed" | "failed";

export interface ClientPaymentRow {
  id: string;
  description: string;
  reference: string;
  detailLine: string;
  amount: number;
  method: string;
  date: string;
  time: string;
  status: ClientPaymentStatus;
}

export interface ClientPaymentsSummary {
  pendingAmount: number;
  pendingCount: number;
  spentThisMonthAmount: number;
  spentThisMonthCount: number;
  topUpsCount: number;
  refundsAmount: number;
}

export const MOCK_CLIENT_PAYMENTS_SUMMARY: ClientPaymentsSummary = {
  pendingAmount: 120.5,
  pendingCount: 2,
  spentThisMonthAmount: 890.25,
  spentThisMonthCount: 6,
  topUpsCount: 4,
  refundsAmount: 45.0,
};

export const MOCK_CLIENT_PAYMENT_ROWS: ClientPaymentRow[] = [
  {
    id: "1",
    description: "Appointment payment",
    reference: "TX-10421",
    detailLine: "Massage · Lisa Rice",
    amount: 85.0,
    method: "Wallet",
    date: "2026-05-10",
    time: "2:15 PM",
    status: "completed",
  },
  {
    id: "2",
    description: "Wallet top-up",
    reference: "TX-10408",
    detailLine: "Stripe Checkout",
    amount: 200.0,
    method: "Card",
    date: "2026-05-08",
    time: "11:02 AM",
    status: "completed",
  },
  {
    id: "3",
    description: "Appointment payment",
    reference: "TX-10390",
    detailLine: "Hair styling · Northern Studio",
    amount: 120.0,
    method: "Online",
    date: "2026-05-01",
    time: "9:40 AM",
    status: "pending",
  },
  {
    id: "4",
    description: "Refund",
    reference: "TX-10355",
    detailLine: "Cancelled appointment",
    amount: 45.0,
    method: "Wallet credit",
    date: "2026-04-22",
    time: "4:00 PM",
    status: "completed",
  },
  {
    id: "5",
    description: "Appointment payment",
    reference: "TX-10312",
    detailLine: "Spa package",
    amount: 210.0,
    method: "Wallet",
    date: "2026-04-18",
    time: "6:30 PM",
    status: "failed",
  },
];
