"use client";

import type { ReactNode } from "react";
import {
  Calendar,
  Clock,
  DollarSign,
  MapPin,
  User,
} from "lucide-react";
import Image from "next/image";
import { Drawer, DrawerSection } from "@/app/(dashboard)/Drawer";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import type { MockVendor } from "@/types/misc";
import type { ServiceForm } from "@/types/customServiceForms";
import { ServiceFormStatusBadge } from "./ServiceFormStatusBadge";

function SoftPanel({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        "rounded-xl border border-accent-20 bg-secondary-800 p-4",
        className,
      )}
    >
      {children}
    </div>
  );
}

function DetailRow({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-xs uppercase tracking-wide text-accent-80">
        {label}
      </span>
      <span className="text-right text-sm font-semibold text-secondary-000">
        {value}
      </span>
    </div>
  );
}

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  form: ServiceForm | null;
  vendors: MockVendor[];
  onEdit: (form: ServiceForm) => void;
  onDuplicate: (form: ServiceForm) => void;
  onCloseRequest: (formId: string) => void;
};

export function ServiceFormDetailsDrawer({
  open,
  onOpenChange,
  form,
  vendors,
  onEdit,
  onDuplicate,
  onCloseRequest,
}: Props) {
  if (!form) return null;

  const vendor = vendors.find((v) => v.id === form.vendorId);

  const dateDisplay = form.flexibleDates
    ? `${form.flexibleDates.start} to ${form.flexibleDates.end}`
    : new Date(form.preferredDate).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      });

  const showActions =
    form.status !== "completed" && form.status !== "closed";

  return (
    <Drawer
      open={open}
      onOpenChange={onOpenChange}
      title="Custom Service Form Details"
      description={`Reference ID: ${form.referenceId}`}
      size="md"
      type="view"
      footer={
        showActions ? (
          <div className="flex flex-wrap gap-3">
            <Button
              type="button"
              variant="outline"
              className="rounded-[18px] border-accent-20"
              onClick={() => onEdit(form)}
            >
              Edit Request
            </Button>
            <Button
              type="button"
              variant="ghost"
              className="rounded-[18px]"
              onClick={() => onDuplicate(form)}
            >
              Duplicate
            </Button>
            <Button
              type="button"
              variant="destructive"
              className="rounded-[18px]"
              onClick={() => onCloseRequest(form.id)}
            >
              Close Request
            </Button>
          </div>
        ) : (
          <div className="flex gap-3">
            <Button
              type="button"
              variant="ghost"
              className="rounded-[18px]"
              onClick={() => onDuplicate(form)}
            >
              Duplicate
            </Button>
          </div>
        )
      }
    >
      <DrawerSection title="Request Summary">
        <SoftPanel>
          <div className="mb-3 flex items-start justify-between gap-3">
            <h4 className="font-unbounded text-base font-semibold text-secondary-000">
              {form.title}
            </h4>
            <ServiceFormStatusBadge status={form.status} />
          </div>
          <div className="space-y-2">
            <DetailRow label="Reference ID" value={form.referenceId} />
            <DetailRow label="Created" value={form.createdDate} />
          </div>
        </SoftPanel>
      </DrawerSection>

      <DrawerSection title="Vendor">
        {form.isOpenToAllVendors ? (
          <SoftPanel>
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-100">
                <User className="h-5 w-5 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="mb-1 font-unbounded text-base font-semibold text-secondary-000">
                  All Vendors in {form.category}
                </p>
                <p className="text-xs leading-relaxed text-accent-80">
                  Request sent to all available vendors offering {form.service}
                </p>
              </div>
            </div>
          </SoftPanel>
        ) : vendor ? (
          <div className="flex items-center gap-3">
            <Image
              src={vendor.image}
              alt={vendor.name}
              width={48}
              height={48}
              className="h-12 w-12 shrink-0 rounded-lg object-cover"
            />
            <div className="min-w-0 flex-1">
              <p className="mb-1 font-unbounded text-base font-semibold text-secondary-000">
                {vendor.name}
              </p>
              <div className="flex flex-wrap items-center gap-2 text-xs text-accent-80">
                <MapPin className="h-3 w-3 shrink-0 text-accent-60" />
                <span>{vendor.location}</span>
                <span className="text-accent-60">•</span>
                <span>{vendor.category}</span>
              </div>
            </div>
          </div>
        ) : null}
      </DrawerSection>

      <DrawerSection title="Requested Service">
        <div className="space-y-3">
          <div>
            <p className="mb-1 text-xs uppercase tracking-wide text-accent-80">
              Category → Service
            </p>
            <p className="text-sm text-secondary-000">
              {form.category} → {form.service}
            </p>
          </div>
          <Separator className="bg-accent-20" />
          <div>
            <p className="mb-1 text-xs uppercase tracking-wide text-accent-80">
              Scope & Notes
            </p>
            <p className="text-sm leading-relaxed text-secondary-000">
              {form.description}
            </p>
          </div>
        </div>
      </DrawerSection>

      {form.quote && (
        <DrawerSection title="Vendor Quote">
          <div className="rounded-xl border border-amber-200 bg-amber-50/80 p-4">
            <div className="mb-3 space-y-2">
              {form.quote.items.map((item, idx) => (
                <div
                  key={`${item.description}-${idx}`}
                  className="flex items-start justify-between gap-3"
                >
                  <span className="text-sm text-secondary-000">
                    {item.description}
                  </span>
                  <span className="shrink-0 text-sm font-semibold text-secondary-000">
                    ${item.price.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between border-t border-amber-200/80 pt-3">
              <span className="font-unbounded text-base font-semibold text-secondary-000">
                Total Quote
              </span>
              <span className="font-unbounded text-xl font-semibold text-primary-100">
                ${form.quote.amount.toFixed(2)}
              </span>
            </div>
            <p className="mt-2 text-xs text-amber-800">
              Valid until {form.quote.validUntil}
            </p>
          </div>
        </DrawerSection>
      )}

      <DrawerSection title="Schedule & Budget">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="mb-1 flex items-center gap-2">
              <Calendar className="h-3 w-3 text-accent-60" />
              <p className="text-xs uppercase tracking-wide text-accent-80">
                Preferred Date
              </p>
            </div>
            <p className="text-sm text-secondary-000">{dateDisplay}</p>
          </div>
          <div>
            <div className="mb-1 flex items-center gap-2">
              <Clock className="h-3 w-3 text-accent-60" />
              <p className="text-xs uppercase tracking-wide text-accent-80">
                Preferred Time
              </p>
            </div>
            <p className="text-sm text-secondary-000">{form.preferredTime}</p>
          </div>
          <div className="col-span-2">
            <div className="mb-1 flex items-center gap-2">
              <DollarSign className="h-3 w-3 text-accent-60" />
              <p className="text-xs uppercase tracking-wide text-accent-80">
                Budget
              </p>
            </div>
            <p className="font-unbounded text-base font-semibold text-primary-100">
              ${form.budget.toFixed(2)}
            </p>
          </div>
        </div>
      </DrawerSection>

      <DrawerSection title="Customer & Fulfillment">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-accent-60" />
            <span className="text-sm text-secondary-000">
              {form.customerName}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-accent-60" />
            <span className="text-sm text-secondary-000">
              {form.isRemote ? "Remote/Online" : form.location}
            </span>
          </div>
        </div>
      </DrawerSection>
    </Drawer>
  );
}
