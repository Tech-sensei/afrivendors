"use client";

import { useMemo } from "react";
import axios from "axios";
import { toast } from "sonner";
import { AccountSettings } from "@/components/settings/AccountSettings";
import { SecuritySettings } from "@/components/settings/SecuritySettings";
import { PaymentMethodsSettings } from "@/components/settings/PaymentMethodsSettings";
import type { SavedPaymentAccount } from "@/types/savedPaymentMethod";
import {
  useUserPaymentAccounts,
  useUserStripeAccountLink,
} from "@/services/useUserPaymentMethods";

interface PaymentMethodRow {
  id: string;
  type: "bank" | "mobile-money";
  name: string;
  details: string;
  isPrimary: boolean;
}

function mapSavedToRow(p: SavedPaymentAccount): PaymentMethodRow {
  return {
    id: p.id,
    type: p.type === "mobile_money" ? "mobile-money" : "bank",
    name: p.name,
    details: p.details,
    isPrimary: p.isDefault,
  };
}

export default function SettingsPage() {
  const {
    data: savedAccounts = [],
    isLoading: isPaymentMethodsLoading,
  } = useUserPaymentAccounts();

  const stripeConnectMutation = useUserStripeAccountLink();

  const paymentMethods = useMemo(
    () => savedAccounts.map(mapSavedToRow),
    [savedAccounts]
  );

  const handleAddPaymentViaStripe = () => {
    stripeConnectMutation.mutate(undefined, {
      onSuccess: (url) => {
        window.location.href = url;
      },
      onError: (err: unknown) => {
        let msg = "Could not open Stripe. Please try again.";
        if (axios.isAxiosError(err)) {
          const d = err.response?.data as
            | { message?: string; responseMessage?: string }
            | undefined;
          const m = d?.message ?? d?.responseMessage;
          if (m) msg = Array.isArray(m) ? m.join(", ") : String(m);
          else if (err.message) msg = err.message;
        } else if (err instanceof Error) msg = err.message;
        toast.error(msg);
      },
    });
  };

  const handleDeleteMethod = (_id: string) => {
    toast.info(
      "Saved payment methods are managed in Stripe. Remove or update them from your Stripe account or contact support."
    );
  };

  const handleSetPrimary = (_id: string) => {
    toast.info(
      "Your default payment method is managed in Stripe when you pay or top up."
    );
  };

  return (
    <div className="space-y-6">
      <h1 className="mb-6 font-unbounded text-[28px] leading-8 font-semibold text-secondary-200">
        Settings
      </h1>

      <SecuritySettings />

      <PaymentMethodsSettings
        methods={paymentMethods}
        isLoading={isPaymentMethodsLoading}
        isStripeConnectPending={stripeConnectMutation.isPending}
        onAddMethod={handleAddPaymentViaStripe}
        onDeleteMethod={handleDeleteMethod}
        onSetPrimary={handleSetPrimary}
      />

      <AccountSettings />
    </div>
  );
}
