import type {
  NewTicketFormState,
  SupportMessage,
  SupportMessageSender,
  SupportTicket,
  SupportTicketPriority,
  SupportTicketStatus,
} from "@/types/support";

export function supportStatusFilterToApiParam(
  status: SupportTicketStatus | "all"
): string | undefined {
  if (status === "all") return undefined;
  if (status === "in-progress") return "in_progress";
  return status;
}

function normalizeStatus(raw: unknown): SupportTicketStatus {
  const s = String(raw ?? "open")
    .toLowerCase()
    .replace(/_/g, "-");
  if (s === "in-progress" || s === "inprogress") return "in-progress";
  if (s === "pending") return "pending";
  if (s === "resolved") return "resolved";
  if (s === "closed") return "closed";
  if (s === "open") return "open";
  return "open";
}

function normalizePriority(
  raw: unknown,
  fallback: SupportTicketPriority = "medium"
): SupportTicketPriority {
  const p = String(raw ?? fallback).toLowerCase();
  if (p === "low" || p === "medium" || p === "high" || p === "urgent") {
    return p;
  }
  return fallback;
}

function mapMessage(raw: Record<string, unknown>, index: number): SupportMessage {
  const senderRaw = String(raw.sender ?? raw.role ?? "user").toLowerCase();
  const sender: SupportMessageSender =
    senderRaw === "support" || senderRaw === "admin" || senderRaw === "agent"
      ? "support"
      : "user";
  const content = String(
    raw.content ?? raw.message ?? raw.body ?? ""
  );
  const ts = String(
    raw.timestamp ?? raw.createdAt ?? raw.updatedAt ?? new Date().toISOString()
  );
  const id = raw.id != null ? String(raw.id) : `m-${index}`;
  const senderName = String(
    raw.senderName ?? raw.sender_name ?? (sender === "support" ? "Support Team" : "You")
  );
  return { id, sender, content, timestamp: ts, senderName };
}

/**
 * Maps POST /tickets (or GET) API payload into UI `SupportTicket`.
 */
export function mapApiTicketToSupportTicket(
  api: unknown,
  fallback?: NewTicketFormState
): SupportTicket {
  const r = api as Record<string, unknown>;
  const id = r.id != null ? String(r.id) : String(Date.now());
  const subject = String(r.subject ?? fallback?.subject ?? "");
  const category = String(r.category ?? fallback?.category ?? "");
  const priority = normalizePriority(r.priority, fallback?.priority);
  const status = normalizeStatus(r.status);
  const description = String(
    r.description ?? r.message ?? fallback?.description ?? ""
  );
  const createdAt = String(
    r.createdAt ?? r.created_at ?? new Date().toISOString()
  );
  const updatedAt = String(
    r.updatedAt ?? r.updated_at ?? createdAt
  );

  let messages: SupportMessage[] = [];
  if (Array.isArray(r.messages)) {
    messages = r.messages.map((m, i) =>
      mapMessage(m as Record<string, unknown>, i)
    );
  }
  const desc = description || subject;

  if (messages.length === 0 && desc) {
    messages = [
      {
        id: "1",
        sender: "user",
        content: desc,
        timestamp: createdAt,
        senderName: "You",
      },
    ];
  }

  return {
    id,
    subject,
    category,
    status,
    priority,
    createdAt,
    updatedAt,
    description: desc,
    messages,
  };
}

export function mapTicketMessageApiToSupportMessage(
  raw: Record<string, unknown>
): SupportMessage {
  const r = raw;
  const senderObj = (r.sender ?? {}) as Record<string, unknown>;
  const accountType = String(senderObj.accountType ?? "user").toLowerCase();
  const uiSender: SupportMessageSender =
    accountType === "user" ? "user" : "support";
  const firstName = String(senderObj.firstName ?? "");
  const lastName = String(senderObj.lastName ?? "");
  const senderName =
    `${firstName} ${lastName}`.trim() ||
    (uiSender === "support" ? "Support" : "You");

  return {
    id: String(r.id ?? ""),
    sender: uiSender,
    content: String(r.message ?? ""),
    timestamp: String(r.createdAt ?? new Date().toISOString()),
    senderName,
  };
}

export function buildCreateTicketFormData(form: NewTicketFormState): FormData {
  const fd = new FormData();
  fd.append("subject", form.subject.trim());
  fd.append("message", form.description.trim());
  fd.append("priority", form.priority);
  fd.append("category", form.category);
  return fd;
}
