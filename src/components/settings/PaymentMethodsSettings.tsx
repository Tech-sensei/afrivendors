"use client";

import React from "react";
import { Plus, Building2, Smartphone, Trash2, Loader2 } from "lucide-react";

interface PaymentMethodRow {
  id: string;
  type: "bank" | "mobile-money";
  name: string;
  details: string;
  isPrimary: boolean;
}

interface PaymentMethodsSettingsProps {
  methods: PaymentMethodRow[];
  isLoading?: boolean;
  isStripeConnectPending?: boolean;
  onAddMethod: () => void;
  onDeleteMethod: (id: string) => void;
  onSetPrimary: (id: string) => void;
}

export function PaymentMethodsSettings({
  methods,
  isLoading = false,
  isStripeConnectPending = false,
  onAddMethod,
  onDeleteMethod,
  onSetPrimary,
}: PaymentMethodsSettingsProps) {
  return (
    <div
      id="payment-methods"
      className="bg-white border border-accent-20 rounded-2xl p-6 mb-5 shadow-sm"
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-unbounded text-xl font-semibold text-secondary-000">
          Payment methods
        </h2>
        <button
          type="button"
          onClick={onAddMethod}
          disabled={isStripeConnectPending}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-100 text-white text-sm font-semibold hover:bg-primary-100/90 transition-all active:scale-95 cursor-pointer disabled:opacity-60 disabled:pointer-events-none font-unageo"
        >
          {isStripeConnectPending ? (
            <Loader2 className="w-4 h-4 animate-spin" aria-hidden />
          ) : (
            <Plus className="w-4 h-4" aria-hidden />
          )}
          Add method
        </button>
      </div>

      <div className="flex flex-col gap-3">
        {isLoading && methods.length === 0 ? (
          <>
            <div className="h-20 rounded-xl bg-accent-10 animate-pulse" />
            <div className="h-20 rounded-xl bg-accent-10 animate-pulse" />
          </>
        ) : methods.length === 0 ? (
          <p className="font-unageo text-sm text-accent-80 py-2">
            No saved payment methods yet. Click Add method to open Stripe and
            add a card or bank account.
          </p>
        ) : (
          methods.map((method) => (
            <div
              key={method.id}
              className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                method.isPrimary
                  ? "border-primary-100 bg-primary-100/5"
                  : "border-accent-20 bg-white"
              }`}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    method.type === "bank" ? "bg-emerald-50" : "bg-amber-50"
                  }`}
                >
                  {method.type === "bank" ? (
                    <Building2 className="w-5 h-5 text-emerald-600" />
                  ) : (
                    <Smartphone className="w-5 h-5 text-amber-600" />
                  )}
                </div>
                <div>
                  <h4 className="font-unageo text-[15px] font-semibold text-secondary-000 mb-0.5">
                    {method.name}
                  </h4>
                  <p className="font-unageo text-sm text-accent-80">
                    {method.details}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {!method.isPrimary && (
                  <>
                    <button
                      type="button"
                      onClick={() => onSetPrimary(method.id)}
                      className="px-3 py-1.5 rounded-lg border border-accent-20 text-[12px] font-medium text-accent-80 hover:border-primary-100 hover:text-primary-100 transition-all active:scale-95 cursor-pointer font-unageo"
                    >
                      Set default
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeleteMethod(method.id)}
                      className="w-9 h-9 rounded-lg flex items-center justify-center text-accent-60 hover:text-red-500 hover:bg-red-50 transition-all active:scale-95 cursor-pointer"
                      aria-label="Remove method"
                    >
                      <Trash2 className="w-4.5 h-4.5" />
                    </button>
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
