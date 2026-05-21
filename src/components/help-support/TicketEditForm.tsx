"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { SupportTicket, SupportTicketPriority } from "@/types/support";
import {
  editSupportTicketSchema,
  zodFieldErrors,
} from "@/lib/validations";
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
  const [errors, setErrors] = useState<
    Partial<Record<keyof TicketEditFields, string>>
  >({});

  const patch = (patchValues: Partial<TicketEditFields>) => {
    onChange(patchValues);
    setErrors((prev) => {
      const next = { ...prev };
      for (const key of Object.keys(patchValues) as (keyof TicketEditFields)[]) {
        delete next[key];
      }
      return next;
    });
  };

  const handleSaveClick = () => {
    const result = editSupportTicketSchema.safeParse(values);
    if (!result.success) {
      setErrors(zodFieldErrors(result.error));
      return;
    }
    setErrors({});
    onSave();
  };

  const canSave = editSupportTicketSchema.safeParse(values).success;

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
          onChange={(e) => patch({ subject: e.target.value })}
          className={`mt-2 h-12 rounded-xl ${errors.subject ? "border-red-500" : "border-accent-20"}`}
        />
        {errors.subject && (
          <p className="mt-1 font-unageo text-sm text-red-600">{errors.subject}</p>
        )}
      </div>
      <div>
        <Label htmlFor="edit-category" className="font-unageo text-sm font-semibold text-secondary-000">
          Category *
        </Label>
        <div className="mt-2">
          <TicketCategorySelect
            id="edit-category"
            value={values.category}
            onChange={(category) => patch({ category })}
          />
        </div>
        {errors.category && (
          <p className="mt-1 font-unageo text-sm text-red-600">{errors.category}</p>
        )}
      </div>
      <div>
        <Label htmlFor="edit-priority" className="font-unageo text-sm font-semibold text-secondary-000">
          Priority
        </Label>
        <div className="mt-2">
          <TicketPrioritySelect
            id="edit-priority"
            value={values.priority}
            onChange={(priority) => patch({ priority })}
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
          onChange={(e) => patch({ description: e.target.value })}
          rows={6}
          className={`mt-2 rounded-xl ${errors.description ? "border-red-500" : "border-accent-20"}`}
        />
        {errors.description && (
          <p className="mt-1 font-unageo text-sm text-red-600">{errors.description}</p>
        )}
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
          onClick={handleSaveClick}
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
