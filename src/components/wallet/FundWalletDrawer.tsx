"use client";

import { useState, useEffect } from "react";
import { PoundSterling, Loader2, Zap } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useFundWallet } from "@/services/useTransactions";
import type { FundWalletDrawerProps } from "@/types/wallet";

const QUICK_AMOUNTS = [10, 20, 50, 100, 200, 500];

export function FundWalletDrawer({ isOpen, onClose }: FundWalletDrawerProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [amount, setAmount] = useState("");

  const { mutate: fundWallet, isPending } = useFundWallet();

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Reset form when drawer opens
  useEffect(() => {
    if (isOpen) setAmount("");
  }, [isOpen]);

  const parsedAmount = parseFloat(amount);
  const isValid = !isNaN(parsedAmount) && parsedAmount > 0;

  const handleSubmit = () => {
    if (!isValid) {
      toast.error("Please enter a valid amount");
      return;
    }

    fundWallet(parsedAmount, {
      onSuccess: ({ checkoutUrl }) => {
        window.location.href = checkoutUrl;
      },
      onError: (error: any) => {
        toast.error(
          error?.response?.data?.message || "Failed to initiate payment. Please try again."
        );
      },
    });
  };

  return (
    <Sheet open={isOpen} onOpenChange={isPending ? undefined : onClose}>
      <SheetContent
        side={isMobile ? "bottom" : "right"}
        className={`w-full sm:max-w-md flex flex-col border-0 p-0 ${
          isMobile ? "rounded-t-3xl max-h-[85vh]" : "rounded-l-3xl rounded-tr-none h-full"
        }`}
      >
        <div className="flex-1 overflow-y-auto p-6">
          <SheetHeader className="p-0 mb-6">
            <SheetTitle className="font-unbounded text-xl font-semibold text-secondary-000">
              Fund Wallet
            </SheetTitle>
            <SheetDescription className="text-sm text-accent-80">
              Add money securely via Stripe
            </SheetDescription>
          </SheetHeader>

          <div className="space-y-6">
            {/* Amount Input */}
            <div>
              <Label
                htmlFor="fundAmount"
                className="block mb-2 text-sm font-semibold text-secondary-000"
              >
                Enter Amount (GBP)
              </Label>
              <div className="relative">
                <PoundSterling className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-accent-60" />
                <Input
                  id="fundAmount"
                  type="number"
                  step="0.01"
                  min="1"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  disabled={isPending}
                  className="h-14 pl-10 rounded-xl border-accent-20 text-xl font-bold focus:border-primary-100"
                />
              </div>
            </div>

            {/* Quick-select amounts */}
            <div>
              <p className="text-xs font-semibold text-accent-60 uppercase tracking-wider mb-3">
                Quick Select
              </p>
              <div className="grid grid-cols-3 gap-2">
                {QUICK_AMOUNTS.map((q) => (
                  <button
                    key={q}
                    type="button"
                    disabled={isPending}
                    onClick={() => setAmount(String(q))}
                    className={`h-11 rounded-xl text-sm font-semibold border transition-all ${
                      amount === String(q)
                        ? "bg-secondary-000 text-white border-secondary-000 shadow-md"
                        : "bg-white text-secondary-000 border-accent-20 hover:border-primary-100/50 hover:bg-primary-300/20"
                    }`}
                  >
                    £{q}
                  </button>
                ))}
              </div>
            </div>

            {/* Stripe info banner */}
            <div className="flex items-start gap-3 p-4 rounded-xl bg-green-50 border border-green-200">
              <Zap className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
              <p className="text-xs text-green-700 leading-relaxed">
                You'll be redirected to Stripe's secure checkout. Your wallet will be credited once payment is confirmed.
              </p>
            </div>
          </div>
        </div>

        <SheetFooter className="flex-col gap-3 p-6 border-t border-accent-20 bg-white shrink-0">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isPending}
            className="w-full h-12 rounded-xl border-accent-20 text-sm font-semibold"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!isValid || isPending}
            className="w-full h-12 bg-primary-100 text-white hover:bg-[#a65620] rounded-xl text-sm font-semibold disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-primary-100/20"
          >
            {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            {isPending ? "Redirecting…" : `Add £${isValid ? parsedAmount.toFixed(2) : "0.00"}`}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
