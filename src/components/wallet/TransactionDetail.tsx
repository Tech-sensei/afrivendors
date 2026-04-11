"use client";

import { useState, useEffect } from "react";
import { Download, Loader2, Calendar, Clock, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { format, parseISO } from "date-fns";
import { useTransactionDetail } from "@/services/useTransactions";
import type { Transaction, TransactionDetailProps } from "@/types/wallet";

function SkeletonLine({ w = "w-full", h = "h-4" }: { w?: string; h?: string }) {
  return <div className={`${w} ${h} rounded-lg bg-gray-100 animate-pulse`} />;
}

function getTypeLabel(type: Transaction["type"]) {
  switch (type) {
    case "wallet_top_up":    return "Wallet Top-up";
    case "appointment_payment": return "Appointment Payment";
    case "refund":           return "Refund";
    default:                 return type;
  }
}

function getStatusStyle(status: Transaction["status"]) {
  switch (status) {
    case "completed": return "bg-green-100 text-green-700";
    case "pending":   return "bg-amber-100 text-amber-700";
    case "failed":    return "bg-red-100 text-red-700";
    case "refunded":  return "bg-blue-100 text-blue-700";
    default:          return "bg-gray-100 text-gray-700";
  }
}

function isCredit(type: Transaction["type"]) {
  return type === "wallet_top_up" || type === "refund";
}

export function TransactionDetail({ transaction, isOpen, onClose }: TransactionDetailProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const { data: detail, isLoading } = useTransactionDetail(transaction?.id, isOpen);
  const txn = detail ?? transaction;

  if (!isOpen && !txn) return null;

  const credit = txn ? isCredit(txn.type) : false;

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent
        side={isMobile ? "bottom" : "right"}
        className={`w-full sm:max-w-md flex flex-col border-0 p-0 overflow-hidden ${
          isMobile ? "rounded-t-3xl max-h-[85vh]" : "rounded-l-3xl rounded-tr-none h-full"
        }`}
      >
        <SheetHeader className="px-6 py-4 border-b bg-background shrink-0 flex flex-row items-center justify-between">
          <SheetTitle className="font-unbounded text-xl font-semibold text-secondary-000">
            Transaction Details
          </SheetTitle>
          {isLoading && <Loader2 className="h-4 w-4 animate-spin text-primary-100" />}
        </SheetHeader>

        {isLoading && !txn ? (
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <SkeletonLine h="h-24" />
            <SkeletonLine w="w-3/4" />
            <SkeletonLine w="w-1/2" />
            <SkeletonLine />
            <SkeletonLine w="w-2/3" />
          </div>
        ) : txn ? (
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Amount */}
            <div
              className={`p-5 rounded-2xl border ${
                credit
                  ? "bg-green-50 border-green-200"
                  : "bg-red-50 border-red-200"
              }`}
            >
              <p className="text-xs font-semibold text-accent-80 uppercase tracking-wider mb-1">
                Amount
              </p>
              <p
                className={`font-unbounded text-3xl font-bold ${
                  credit ? "text-green-600" : "text-red-600"
                }`}
              >
                {credit ? "+" : "-"}£{txn.amount.toFixed(2)}
              </p>
              <p className="text-xs text-accent-60 mt-2">{txn.currency}</p>
            </div>

            {/* Type & Status */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-accent-60 uppercase tracking-wider mb-1">
                  Type
                </p>
                <p className="text-sm font-semibold text-secondary-000">
                  {getTypeLabel(txn.type)}
                </p>
              </div>
              <Badge className={`text-xs font-semibold capitalize border-0 ${getStatusStyle(txn.status)}`}>
                {txn.status}
              </Badge>
            </div>

            {/* Description */}
            <div>
              <p className="text-xs font-semibold text-accent-60 uppercase tracking-wider mb-1">
                Description
              </p>
              <p className="text-sm text-secondary-000">{txn.description}</p>
            </div>

            {/* Vendor (if present) */}
            {txn.vendor && (
              <div>
                <p className="text-xs font-semibold text-accent-60 uppercase tracking-wider mb-1">
                  Vendor
                </p>
                <div className="flex items-center gap-2 text-sm text-secondary-000">
                  <User className="h-4 w-4 text-accent-60" />
                  <span className="font-semibold">
                    {txn.vendor.firstName} {txn.vendor.lastName}
                  </span>
                </div>
              </div>
            )}

            {/* Appointment (if present) */}
            {txn.appointment && (
              <>
                <Separator />
                <div className="space-y-4">
                  <p className="text-sm font-semibold text-secondary-000">Appointment</p>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-start gap-2">
                      <Calendar className="h-4 w-4 text-accent-60 mt-0.5" />
                      <div>
                        <p className="text-xs text-accent-60 uppercase tracking-wider font-semibold mb-0.5">Date</p>
                        <p className="text-sm text-secondary-000">
                          {format(parseISO(txn.appointment.date), "MMM d, yyyy")}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Clock className="h-4 w-4 text-accent-60 mt-0.5" />
                      <div>
                        <p className="text-xs text-accent-60 uppercase tracking-wider font-semibold mb-0.5">Time</p>
                        <p className="text-sm text-secondary-000">
                          {txn.appointment.time.slice(0, 5)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {txn.appointment.services.map((s) => (
                    <div
                      key={s.id}
                      className="flex items-start justify-between gap-4 py-2 border-b border-accent-20 last:border-0"
                    >
                      <div>
                        <p className="text-sm font-semibold text-secondary-000">{s.serviceName}</p>
                        <p className="text-xs text-accent-60">{s.category.name} • {s.duration}</p>
                      </div>
                      <span className="text-sm font-bold text-primary-100 shrink-0">
                        £{Number(s.price).toFixed(2)}
                      </span>
                    </div>
                  ))}

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-sm font-semibold text-secondary-000">Total</span>
                    <span className="text-base font-bold text-primary-100">
                      £{txn.appointment.totalAmount.toFixed(2)}
                    </span>
                  </div>
                </div>
              </>
            )}

            <Separator />

            {/* Reference */}
            <div>
              <p className="text-xs font-semibold text-accent-60 uppercase tracking-wider mb-1">
                Reference
              </p>
              <p className="text-xs text-secondary-000 font-mono break-all">{txn.referenceId}</p>
            </div>

            {/* Date */}
            <div>
              <p className="text-xs font-semibold text-accent-60 uppercase tracking-wider mb-1">
                Date
              </p>
              <p className="text-sm text-secondary-000">
                {format(parseISO(txn.createdAt), "MMMM d, yyyy • h:mm a")}
              </p>
            </div>
          </div>
        ) : null}

        <div className="p-6 border-t bg-background shrink-0 mt-auto">
          <Button
            variant="outline"
            onClick={() => toast.success("Receipt downloaded")}
            disabled={!txn || isLoading}
            className="w-full h-12 rounded-xl border-accent-20 hover:bg-accent-10 text-sm font-semibold text-secondary-000"
          >
            <Download className="h-4 w-4 mr-2" />
            Download Receipt
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
