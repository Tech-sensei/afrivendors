"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { NewTicketFormState } from "@/types/support";
import { TicketCategorySelect } from "./TicketCategorySelect";
import { TicketPrioritySelect } from "./TicketPrioritySelect";

const emptyForm: NewTicketFormState = {
  subject: "",
  category: "",
  priority: "medium",
  description: "",
};

export function CreateTicketSheet({
  isOpen,
  onOpenChange,
  onSubmit,
  isSubmitting = false,
}: {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: NewTicketFormState) => void;
  isSubmitting?: boolean;
}) {
  const [isMobile, setIsMobile] = useState(false);
  const [form, setForm] = useState<NewTicketFormState>(emptyForm);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    if (isOpen) setForm(emptyForm);
  }, [isOpen]);

  const canSubmit =
    Boolean(form.subject.trim()) &&
    Boolean(form.category) &&
    Boolean(form.description.trim());

  const handleSubmit = () => {
    if (!canSubmit || isSubmitting) return;
    onSubmit(form);
  };

  const handleOpenChange = (open: boolean) => {
    if (!open && isSubmitting) return;
    onOpenChange(open);
  };

  return (
    <Sheet open={isOpen} onOpenChange={handleOpenChange}>
      <SheetContent
        side={isMobile ? "bottom" : "right"}
        className={`flex w-full flex-col border-0 p-0 sm:max-w-md ${
          isMobile ? "max-h-[90vh] rounded-t-3xl" : "h-full rounded-l-3xl rounded-tr-none"
        }`}
      >
        <div className="flex-1 overflow-y-auto p-6">
          <SheetHeader className="p-0 mb-6 text-left">
            <SheetTitle className="font-unbounded text-xl font-semibold text-secondary-000">
              Create new ticket
            </SheetTitle>
            <SheetDescription className="font-unageo text-sm text-accent-80">
              Tell us what you need — we will get back to you as soon as we can.
            </SheetDescription>
          </SheetHeader>

          <div className="space-y-5">
            <div>
              <Label
                htmlFor="new-ticket-subject"
                className="font-unageo text-sm font-semibold text-secondary-000"
              >
                Subject *
              </Label>
              <Input
                id="new-ticket-subject"
                value={form.subject}
                onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
                placeholder="Brief description of your issue"
                disabled={isSubmitting}
                className="mt-2 h-12 rounded-xl border-accent-20 focus-visible:border-primary-100"
              />
            </div>
            <div>
              <Label
                htmlFor="new-ticket-category"
                className="font-unageo text-sm font-semibold text-secondary-000"
              >
                Category *
              </Label>
              <div className="mt-2">
                <TicketCategorySelect
                  id="new-ticket-category"
                  value={form.category}
                  onChange={(category) => setForm((f) => ({ ...f, category }))}
                  disabled={isSubmitting}
                />
              </div>
            </div>
            <div>
              <Label
                htmlFor="new-ticket-priority"
                className="font-unageo text-sm font-semibold text-secondary-000"
              >
                Priority
              </Label>
              <div className="mt-2">
                <TicketPrioritySelect
                  id="new-ticket-priority"
                  value={form.priority}
                  onChange={(priority) => setForm((f) => ({ ...f, priority }))}
                  disabled={isSubmitting}
                />
              </div>
            </div>
            <div>
              <Label
                htmlFor="new-ticket-description"
                className="font-unageo text-sm font-semibold text-secondary-000"
              >
                Description *
              </Label>
              <Textarea
                id="new-ticket-description"
                value={form.description}
                onChange={(e) =>
                  setForm((f) => ({ ...f, description: e.target.value }))
                }
                placeholder="Provide as much detail as you can…"
                rows={6}
                disabled={isSubmitting}
                className="mt-2 rounded-xl border-accent-20 focus-visible:border-primary-100"
              />
            </div>
          </div>
        </div>

        <SheetFooter className="gap-3 border-t border-accent-20 bg-secondary-800 p-6 sm:flex-row">
          <Button
            type="button"
            variant="outline"
            className="flex-1 rounded-full border-accent-20 font-unageo font-semibold"
            disabled={isSubmitting}
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            type="button"
            disabled={!canSubmit || isSubmitting}
            className="flex-1 rounded-full bg-primary-100 font-unageo font-semibold text-white hover:bg-primary-100/90"
            onClick={handleSubmit}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating…
              </>
            ) : (
              "Create ticket"
            )}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
