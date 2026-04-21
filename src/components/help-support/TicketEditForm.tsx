"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { SupportTicket, SupportTicketPriority } from "@/types/support";
import { TicketCategorySelect } from "./TicketCategorySelect";
import { TicketPrioritySelect } from "./TicketPrioritySelect";

export type TicketEditFields = {
  subject: string;
  category: string;
  priority: SupportTicketPriority;
  description: string;
};

export function TicketEditForm({
  values,
  onChange,
  onSave,
  onCancel,
}: {
  values: TicketEditFields;
  onChange: (patch: Partial<TicketEditFields>) => void;
  onSave: () => void;
  onCancel: () => void;
}) {
  const canSave =
    Boolean(values.subject.trim()) &&
    Boolean(values.category) &&
    Boolean(values.description.trim());

  return (
    <div className="space-y-5">
      <h4 className="font-unageo text-xs font-bold uppercase tracking-widest text-accent-60">
        Edit ticket
      </h4>
      <div>
        <Label htmlFor="edit-subject" className="font-unageo text-sm font-semibold text-secondary-000">
          Subject *
        </Label>
        <Input
          id="edit-subject"
          value={values.subject}
          onChange={(e) => onChange({ subject: e.target.value })}
          className="mt-2 h-12 rounded-xl border-accent-20"
        />
      </div>
      <div>
        <Label htmlFor="edit-category" className="font-unageo text-sm font-semibold text-secondary-000">
          Category *
        </Label>
        <div className="mt-2">
          <TicketCategorySelect
            id="edit-category"
            value={values.category}
            onChange={(category) => onChange({ category })}
          />
        </div>
      </div>
      <div>
        <Label htmlFor="edit-priority" className="font-unageo text-sm font-semibold text-secondary-000">
          Priority
        </Label>
        <div className="mt-2">
          <TicketPrioritySelect
            id="edit-priority"
            value={values.priority}
            onChange={(priority) => onChange({ priority })}
          />
        </div>
      </div>
      <div>
        <Label htmlFor="edit-description" className="font-unageo text-sm font-semibold text-secondary-000">
          Description *
        </Label>
        <Textarea
          id="edit-description"
          value={values.description}
          onChange={(e) => onChange({ description: e.target.value })}
          rows={6}
          className="mt-2 rounded-xl border-accent-20"
        />
      </div>
      <div className="flex gap-3 pt-2">
        <Button
          type="button"
          variant="outline"
          className="flex-1 rounded-full border-accent-20 font-unageo font-semibold"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button
          type="button"
          disabled={!canSave}
          className="flex-1 rounded-full bg-primary-100 font-unageo font-semibold text-white"
          onClick={onSave}
        >
          Save changes
        </Button>
      </div>
    </div>
  );
}

export function ticketToEditFields(ticket: SupportTicket): TicketEditFields {
  return {
    subject: ticket.subject,
    category: ticket.category,
    priority: ticket.priority,
    description: ticket.description,
  };
}
