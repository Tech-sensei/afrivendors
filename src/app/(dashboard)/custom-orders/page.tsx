"use client";

import { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CustomOrderListCard } from "@/components/custom-orders/CustomOrderListCard";
import { CustomOrderEmptyState } from "@/components/custom-orders/CustomOrderEmptyState";
import { CustomOrderDetailDrawer } from "@/components/custom-orders/CustomOrderDetailDrawer";
import { CancelCustomOrderDialog } from "@/components/custom-orders/CustomOrderConfirmDialogs";
import { AcceptQuotePaymentDialog } from "@/components/custom-orders/AcceptQuotePaymentDialog";
import { FundWalletDrawer } from "@/components/wallet/FundWalletDrawer";
import { useWallet } from "@/services/useTransactions";
import { formatVendorPrice } from "@/services/vendor";
import type { PaymentMethod } from "@/types/booking";
import { ServiceFormEditorDrawer } from "@/components/custom-service-forms/ServiceFormEditorDrawer";
import { mockCustomOrders } from "@/data/mockCustomOrders";
import { vendors } from "@/data/vendorsData";
import {
  CUSTOM_ORDER_TABS,
  countOrdersByTab,
  filterOrdersByTab,
} from "@/lib/customOrderFilters";
import { orderNeedsRelease } from "@/lib/customOrderUi";
import type {
  CustomOrder,
  CustomOrderDraft,
  CustomOrderQuote,
  CustomOrderTabId,
} from "@/types/customOrders";
import {
  validateCustomOrderDraft,
  zodFieldErrors,
} from "@/lib/validations";

const categories = Array.from(new Set(vendors.map((v) => v.category)));

const emptyDraft = (): CustomOrderDraft => ({
  title: "",
  category: "",
  description: "",
  attachments: [],
  preferredDate: "",
  isFlexibleDates: false,
  flexibleStart: "",
  flexibleEnd: "",
  preferredTime: "",
  budget: "",
  location: "",
  customerName: "Lisa Rice",
  urgency: "normal",
  allowMultipleQuotes: true,
  agreeToTerms: false,
});

function nextReferenceId(count: number) {
  return `CO-2026-${String(count + 1).padStart(3, "0")}`;
}

type AcceptPaymentContext = {
  orderId: string;
  quoteId: string;
};

function applyAcceptToOrder(order: CustomOrder, quoteId: string): CustomOrder {
  const accepted = order.quotes.find((q) => q.id === quoteId);
  if (!accepted) return order;
  return {
    ...order,
    acceptedQuoteId: quoteId,
    quotes: order.quotes.map((q) => ({
      ...q,
      status:
        q.id === quoteId
          ? ("accepted" as const)
          : q.status === "pending"
            ? ("rejected" as const)
            : q.status,
    })),
    timeline: [
      ...order.timeline,
      {
        at: new Date().toLocaleDateString("en-GB", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
        label: `Quote accepted — ${accepted.vendorName}`,
      },
    ],
  };
}

function applyPaymentToOrder(
  order: CustomOrder,
  method: PaymentMethod,
  quote: CustomOrderQuote
): CustomOrder {
  const dateLabel = new Date().toLocaleDateString("en-GB", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const paidLabel =
    method === "online"
      ? `Paid ${formatVendorPrice(quote.totalAmount)} online · funds in escrow`
      : `Paid ${formatVendorPrice(quote.totalAmount)} via wallet · funds in escrow`;

  return {
    ...order,
    status: "paid",
    paymentMethod: method,
    paymentStatus: "paid",
    timeline: [
      ...order.timeline,
      { at: dateLabel, label: paidLabel },
    ],
  };
}

export default function CustomOrdersPage() {
  const [orders, setOrders] = useState<CustomOrder[]>(mockCustomOrders);
  const [activeTab, setActiveTab] = useState<CustomOrderTabId>("all");
  const [detailOpen, setDetailOpen] = useState(false);
  const [editorOpen, setEditorOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<CustomOrder | null>(null);
  const [formData, setFormData] = useState<CustomOrderDraft>(emptyDraft);
  const [formErrors, setFormErrors] = useState<
    Partial<Record<keyof CustomOrderDraft, string>>
  >({});

  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [orderToCancel, setOrderToCancel] = useState<string | null>(null);
  const [acceptPaymentOpen, setAcceptPaymentOpen] = useState(false);
  const [acceptPaymentContext, setAcceptPaymentContext] =
    useState<AcceptPaymentContext | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("online");
  const [fundWalletOpen, setFundWalletOpen] = useState(false);
  const [paymentSubmitting, setPaymentSubmitting] = useState(false);

  const { data: wallet, isLoading: walletLoading } = useWallet();
  const walletBalance = wallet?.balance ?? 0;

  const filteredOrders = useMemo(
    () => filterOrdersByTab(orders, activeTab),
    [orders, activeTab]
  );

  const vendorsInCategory = formData.category
    ? vendors.filter((v) => v.category === formData.category)
    : [];

  const acceptPaymentOrder = useMemo(() => {
    if (!acceptPaymentContext) return null;
    return orders.find((o) => o.id === acceptPaymentContext.orderId) ?? null;
  }, [orders, acceptPaymentContext]);

  const acceptPaymentQuote = useMemo(() => {
    if (!acceptPaymentContext || !acceptPaymentOrder) return null;
    return (
      acceptPaymentOrder.quotes.find(
        (q) => q.id === acceptPaymentContext.quoteId
      ) ?? null
    );
  }, [acceptPaymentContext, acceptPaymentOrder]);

  const openAcceptPayment = (orderId: string, quoteId: string) => {
    setDetailOpen(false);
    setAcceptPaymentContext({ orderId, quoteId });
    setPaymentMethod("online");
    setAcceptPaymentOpen(true);
  };

  const openDetail = (order: CustomOrder) => {
    setSelectedOrder(order);
    setDetailOpen(true);
  };

  const handlePrimaryAction = (order: CustomOrder) => {
    if (orderNeedsRelease(order)) {
      handleReleaseFunds(order.id);
      openDetail(order);
      return;
    }
    openDetail(order);
  };

  const handleAcceptQuote = (orderId: string, quoteId: string) => {
    openAcceptPayment(orderId, quoteId);
  };

  const confirmAcceptPayment = () => {
    if (!acceptPaymentContext || !acceptPaymentQuote) return;

    const { orderId, quoteId } = acceptPaymentContext;
    const quote = acceptPaymentQuote;

    if (paymentMethod === "wallet" && quote.totalAmount > walletBalance) {
      toast.error("Insufficient wallet balance. Add funds or pay online.");
      return;
    }

    setPaymentSubmitting(true);

    setOrders((prev) => {
      const next = prev.map((o) => {
        if (o.id !== orderId) return o;
        const updated = applyAcceptToOrder(o, quoteId);
        return applyPaymentToOrder(updated, paymentMethod, quote);
      });
      const updatedOrder = next.find((o) => o.id === orderId);
      if (updatedOrder) setSelectedOrder(updatedOrder);
      return next;
    });

    if (paymentMethod === "online") {
      toast.success(
        `Quote accepted. Demo: redirecting to pay ${formatVendorPrice(quote.totalAmount)} online.`
      );
    } else {
      toast.success(
        `Quote accepted and ${formatVendorPrice(quote.totalAmount)} paid from wallet (demo). Funds held in escrow.`
      );
    }

    setPaymentSubmitting(false);
    setAcceptPaymentOpen(false);
    setAcceptPaymentContext(null);
    setActiveTab("active");
  };

  const handleDeclineQuote = (orderId: string, quoteId: string) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id !== orderId
          ? o
          : {
              ...o,
              quotes: o.quotes.map((q) =>
                q.id === quoteId ? { ...q, status: "rejected" as const } : q
              ),
            }
      )
    );
    toast.message("Quote declined");
  };

  const handleReleaseFunds = (orderId: string) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id !== orderId
          ? o
          : {
              ...o,
              status: "closed",
              timeline: [
                ...o.timeline,
                {
                  at: new Date().toLocaleDateString("en-GB", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  }),
                  label: "Funds released · order closed",
                },
              ],
              notes: "Funds released to vendor. Thank you!",
            }
      )
    );
    toast.success("Funds released to vendor (demo).");
    setDetailOpen(false);
  };

  const handleSimulateQuote = (orderId: string) => {
    const demoQuote: CustomOrderQuote = {
      id: `q-demo-${Date.now()}`,
      vendorId: "zuriglow-beauty-hub",
      vendorName: "ZuriGlow Beauty Hub",
      totalAmount: 78,
      lineItems: [
        { description: "Knotless box braids (medium)", amount: 65 },
        { description: "Hair prep & finish", amount: 13 },
      ],
      validUntil: new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10),
      message: "I have availability on your preferred date.",
      status: "pending",
      createdAt: new Date().toLocaleDateString("en-GB", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
    };
    setOrders((prev) =>
      prev.map((o) =>
        o.id !== orderId
          ? o
          : {
              ...o,
              status: "quoting",
              quotes: [...o.quotes, demoQuote],
              timeline: [
                ...o.timeline,
                {
                  at: demoQuote.createdAt,
                  label: "Quote received from ZuriGlow Beauty Hub",
                },
              ],
            }
      )
    );
    toast.success("Demo quote added");
  };

  const handleNewOrder = () => {
    setFormData(emptyDraft());
    setEditorOpen(true);
  };

  const handleCancelRequest = (orderId: string) => {
    setOrderToCancel(orderId);
    setCancelDialogOpen(true);
  };

  const confirmCancel = () => {
    if (!orderToCancel) return;
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderToCancel ? { ...o, status: "cancelled" as const } : o
      )
    );
    toast.success("Custom order cancelled");
    setCancelDialogOpen(false);
    setDetailOpen(false);
    setOrderToCancel(null);
  };

  const validateBeforeSubmit = () => {
    const result = validateCustomOrderDraft(formData);
    if (!result.success) {
      setFormErrors(zodFieldErrors(result.error));
      return false;
    }
    setFormErrors({});
    return true;
  };

  const handleSubmitForm = () => {
    if (!validateBeforeSubmit()) return;

    const vendorCount = vendors.filter((v) => v.category === formData.category)
      .length;
    const openMarketLabel = `All vendors in ${formData.category}`;
    const createdLabel = new Date().toLocaleDateString("en-GB", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });

    const newOrder: CustomOrder = {
      id: `co-${Date.now()}`,
      referenceId: nextReferenceId(orders.length),
      title: formData.title,
      category: formData.category,
      description: formData.description,
      attachments: formData.attachments,
      openMarketLabel,
      preferredDate: formData.preferredDate,
      flexibleDates: formData.isFlexibleDates
        ? { start: formData.flexibleStart, end: formData.flexibleEnd }
        : undefined,
      preferredTime: formData.preferredTime,
      budget: Number.parseFloat(formData.budget),
      location: formData.location,
      customerName: formData.customerName,
      urgency: formData.urgency,
      allowMultipleQuotes: formData.allowMultipleQuotes,
      status: "submitted",
      createdAt: createdLabel,
      quotes: [],
      paymentStatus: "unpaid",
      timeline: [
        { at: createdLabel, label: "Request submitted" },
        {
          at: createdLabel,
          label: `Sent to ${vendorCount} vendor${vendorCount !== 1 ? "s" : ""} in ${formData.category}`,
        },
      ],
    };
    setOrders((prev) => [newOrder, ...prev]);
    toast.success(
      `Request sent to ${vendorCount} vendor${vendorCount !== 1 ? "s" : ""} in ${formData.category}`
    );
    setActiveTab("waiting");
    setEditorOpen(false);
  };

  const selectedForDrawer =
    selectedOrder && orders.find((o) => o.id === selectedOrder.id)
      ? orders.find((o) => o.id === selectedOrder.id)!
      : selectedOrder;

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="font-unbounded text-[28px] leading-8 font-semibold text-secondary-200">
            Custom orders
          </h1>
          <p className="mt-2 max-w-xl text-sm text-accent-80">
            Pick a category, describe what you need, and every vendor in that
            category can quote. Accept a quote and pay in one step, then track
            delivery.
          </p>
        </div>
        <Button
          type="button"
          className="h-11 shrink-0 gap-2 rounded-[18px] bg-primary-100 px-5 font-semibold text-white hover:bg-primary-100/90"
          onClick={handleNewOrder}
        >
          <Plus className="h-4 w-4" />
          New custom order
        </Button>
      </div>

      <div className="mb-8 flex gap-2 overflow-x-auto pb-1">
        {CUSTOM_ORDER_TABS.map((tab) => {
          const count = countOrdersByTab(orders, tab.id);
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "shrink-0 rounded-full px-4 py-2.5 text-sm font-semibold transition-all",
                active
                  ? "bg-secondary-000 text-white shadow-md"
                  : "bg-white text-secondary-300 border border-accent-20 hover:border-accent-40"
              )}
            >
              {tab.label}
              {count > 0 && (
                <span
                  className={cn(
                    "ml-1.5 rounded-full px-1.5 py-0.5 text-xs",
                    active ? "bg-white/20" : "bg-primary-100/10 text-primary-100"
                  )}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {filteredOrders.length > 0 ? (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <CustomOrderListCard
              key={order.id}
              order={order}
              onViewDetails={openDetail}
              onPrimaryAction={handlePrimaryAction}
              onCancel={handleCancelRequest}
            />
          ))}
        </div>
      ) : (
        <CustomOrderEmptyState tab={activeTab} onCreate={handleNewOrder} />
      )}

      <CustomOrderDetailDrawer
        open={detailOpen}
        onOpenChange={setDetailOpen}
        order={selectedForDrawer}
        onCancel={handleCancelRequest}
        onAcceptQuote={handleAcceptQuote}
        onDeclineQuote={handleDeclineQuote}
        onReleaseFunds={handleReleaseFunds}
        onSimulateQuote={handleSimulateQuote}
      />

      <ServiceFormEditorDrawer
        open={editorOpen}
        onOpenChange={setEditorOpen}
        isEditMode={false}
        formData={formData}
        setFormData={setFormData}
        categories={categories}
        vendorsInCategory={vendorsInCategory}
        onSubmit={handleSubmitForm}
        isValid={validateCustomOrderDraft(formData).success}
        fieldErrors={formErrors}
      />

      <CancelCustomOrderDialog
        open={cancelDialogOpen}
        onOpenChange={setCancelDialogOpen}
        onConfirm={confirmCancel}
      />

      <AcceptQuotePaymentDialog
        open={acceptPaymentOpen}
        onOpenChange={(open) => {
          setAcceptPaymentOpen(open);
          if (!open) setAcceptPaymentContext(null);
        }}
        quote={acceptPaymentQuote}
        orderTitle={acceptPaymentOrder?.title}
        paymentMethod={paymentMethod}
        onPaymentMethodChange={setPaymentMethod}
        walletBalance={walletBalance}
        walletLoading={walletLoading}
        onFundWallet={() => setFundWalletOpen(true)}
        onConfirm={confirmAcceptPayment}
        isSubmitting={paymentSubmitting}
      />

      <FundWalletDrawer
        isOpen={fundWalletOpen}
        onClose={() => setFundWalletOpen(false)}
      />
    </div>
  );
}
