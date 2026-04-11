export type ServiceFormStatus =
  | "open"
  | "quoted"
  | "accepted"
  | "scheduled"
  | "completed"
  | "closed";

export interface ServiceForm {
  id: string;
  title: string;
  vendorId: string;
  vendorName: string;
  category: string;
  service: string;
  description: string;
  attachments: string[];
  preferredDate: string;
  flexibleDates?: { start: string; end: string };
  preferredTime: string;
  budget: number;
  location: string;
  isRemote: boolean;
  customerName: string;
  urgency: "normal" | "priority";
  allowMultipleQuotes: boolean;
  status: ServiceFormStatus;
  referenceId: string;
  createdDate: string;
  isOpenToAllVendors?: boolean;
  quote?: {
    amount: number;
    items: { description: string; price: number }[];
    validUntil: string;
  };
  notes?: string;
}

export interface ServiceFormDraft {
  title: string;
  category: string;
  service: string;
  vendorId: string;
  vendorSelectionType: "specific" | "all";
  description: string;
  attachments: string[];
  preferredDate: string;
  isFlexibleDates: boolean;
  flexibleStart: string;
  flexibleEnd: string;
  preferredTime: string;
  budget: string;
  location: string;
  isRemote: boolean;
  customerName: string;
  urgency: "normal" | "priority";
  allowMultipleQuotes: boolean;
  agreeToTerms: boolean;
}
