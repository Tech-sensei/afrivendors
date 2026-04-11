"use client";

import {
  Copy,
  Edit,
  Eye,
  FileText,
  MoreHorizontal,
  Trash2,
  XCircle,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import type { ServiceForm } from "@/types/customServiceForms";
import { ServiceFormStatusBadge } from "./ServiceFormStatusBadge";

type Props = {
  form: ServiceForm;
  onViewDetails: (form: ServiceForm) => void;
  onEdit: (form: ServiceForm) => void;
  onDuplicate: (form: ServiceForm) => void;
  onCloseRequest: (formId: string) => void;
  onDelete: (formId: string) => void;
};

export function ServiceFormListCard({
  form,
  onViewDetails,
  onEdit,
  onDuplicate,
  onCloseRequest,
  onDelete,
}: Props) {
  return (
    <Card
      className={cn(
        "rounded-2xl border border-[#EFE6E1] bg-white shadow-[0_8px_24px_rgba(35,19,5,0.06)]",
      )}
    >
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-300/40">
            <FileText className="h-6 w-6 text-primary-100" />
          </div>

          <div className="min-w-0 flex-1">
            <div className="mb-2 flex items-start justify-between gap-4">
              <h3 className="font-unbounded text-base font-semibold text-secondary-000">
                {form.title}
              </h3>
              <ServiceFormStatusBadge status={form.status} />
            </div>

            <div className="mb-3 flex flex-wrap items-center gap-3">
              <p className="text-sm text-accent-80">{form.vendorName}</p>
              <span className="text-accent-60">•</span>
              <p className="text-sm text-accent-80">
                Created {form.createdDate}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-9 gap-1.5 rounded-[18px] border-accent-20 text-secondary-100"
                onClick={() => onViewDetails(form)}
              >
                <Eye className="h-3.5 w-3.5" />
                View Details
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="h-9 w-9 rounded-xl border-accent-20 text-secondary-000"
                    aria-label="More actions"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {(form.status === "open" || form.status === "quoted") && (
                    <DropdownMenuItem onClick={() => onEdit(form)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={() => onDuplicate(form)}>
                    <Copy className="mr-2 h-4 w-4" />
                    Duplicate
                  </DropdownMenuItem>
                  {form.status !== "closed" && form.status !== "completed" && (
                    <DropdownMenuItem
                      onClick={() => onCloseRequest(form.id)}
                    >
                      <XCircle className="mr-2 h-4 w-4" />
                      Close Request
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem
                    className="text-destructive focus:text-destructive"
                    onClick={() => onDelete(form.id)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
