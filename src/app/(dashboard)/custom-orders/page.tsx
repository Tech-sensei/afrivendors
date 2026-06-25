"use client";

import { useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Plus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CustomOrderListCard } from "@/components/custom-orders/CustomOrderListCard";
import { CustomOrderEmptyState } from "@/components/custom-orders/CustomOrderEmptyState";
import { CustomOrderDetailDrawer } from "@/components/custom-orders/CustomOrderDetailDrawer";
import { AcceptQuotePaymentDialog } from "@/components/custom-orders/AcceptQuotePaymentDialog";
import { OpenDisputeDialog } from "@/components/disputes/OpenDisputeDialog";
import { DisputeResolutionDialog } from "@/components/appointments/DisputeResolutionDialog";
import { EscalateDisputeDialog } from "@/components/appointments/EscalateDisputeDialog";
import { FundWalletDrawer } from "@/components/wallet/FundWalletDrawer";
import { useWallet } from "@/services/useTransactions";
import { formatVendorPrice } from "@/services/vendor";
import type { PaymentMethod } from "@/types/booking";
import { ServiceFormEditorDrawer } from "@/components/custom-service-forms/ServiceFormEditorDrawer";
import { CUSTOM_ORDER_TABS } from "@/lib/customOrderFilters";
import {
  getAcceptedQuote,
} from "@/lib/customOrderUi";
import type { CustomOrder, CustomOrderDraft, CustomOrderQuote, CustomOrderTabId } from "@/types/customOrders";
import {
  validateCustomOrderDraft,
  zodFieldErrors,
} from "@/lib/validations";
import {
  getCustomOrderErrorMessage,
  useCreateCustomOrder,
  useCustomOrderDetail,
  useCustomOrders,
  useCustomOrderTabCounts,
  CUSTOM_ORDER_DETAIL_KEY,
  CUSTOM_ORDERS_COUNTS_KEY,
  CUSTOM_ORDERS_QUERY_KEY,
  useEscalateCustomOrderDispute,
  usePayCustomOrder,
  useReleaseCustomOrderFunds,
  useResolveCustomOrderDispute,
} from "@/services/useCustomOrders";
import { usePublicCategories } from "@/services/usePublicCategories";

const emptyDraft = (): CustomOrderDraft => ({
  title: "",
  categoryId: null,
  budget: "",
  date: "",
  time: "",
  location: "",
  priority: "medium",
  description: "",
  imageUrl: "",
  image: null,
});

type AcceptPaymentContext = {
  orderId: string;
  orderTitle: string;
  quote: CustomOrderQuote;
};

export default function CustomOrdersPage() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<CustomOrderTabId>("all");
  const [detailOpen, setDetailOpen] = useState(false);
  const [editorOpen, setEditorOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [formData, setFormData] = useState<CustomOrderDraft>(emptyDraft());
  const [formErrors, setFormErrors] = useState<
    Partial<Record<keyof CustomOrderDraft, string>>
  >({});

  const [acceptPaymentOpen, setAcceptPaymentOpen] = useState(false);
  const [acceptPaymentContext, setAcceptPaymentContext] =
    useState<AcceptPaymentContext | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("online");
  const [fundWalletOpen, setFundWalletOpen] = useState(false);

  const [disputeOrderId, setDisputeOrderId] = useState<number | null>(null);
  const [isDisputeOpen, setIsDisputeOpen] = useState(false);
  const [payVendorOrderId, setPayVendorOrderId] = useState<number | null>(null);
  const [isPayVendorOpen, setIsPayVendorOpen] = useState(false);
  const [escalateOrderId, setEscalateOrderId] = useState<number | null>(null);
  const [isEscalateOpen, setIsEscalateOpen] = useState(false);

  const { data: categories = [], isLoading: categoriesLoading } = usePublicCategories();
  const { data: orders = [], isLoading: ordersLoading } = useCustomOrders(activeTab);
  const { data: tabCounts } = useCustomOrderTabCounts();
  const { data: selectedOrderDetail, isLoading: detailLoading } = useCustomOrderDetail(
    selectedOrderId,
    detailOpen
  );

  const createOrder = useCreateCustomOrder();
  const payOrder = usePayCustomOrder();
  const releaseFunds = useReleaseCustomOrderFunds();
  const { mutate: resolveDispute, isPending: isResolvingDispute } =
    useResolveCustomOrderDispute();
  const { mutate: escalateDispute, isPending: isEscalating } =
    useEscalateCustomOrderDispute();

  const { data: wallet, isLoading: walletLoading } = useWallet();
  const walletBalance = wallet?.balance ?? 0;

  const selectedCategoryVendorCount = useMemo(() => {
    if (!formData.categoryId) return 0;
    return categories.find((item) => item.id === formData.categoryId)?.vendorCount ?? 0;
  }, [categories, formData.categoryId]);

  const selectedFromList = useMemo(
    () => orders.find((order) => Number(order.id) === selectedOrderId) ?? null,
    [orders, selectedOrderId]
  );

  const selectedForDrawer = selectedOrderDetail ?? selectedFromList;

  const disputeOrder = useMemo(() => {
    if (disputeOrderId == null) return null;
    return (
      (selectedForDrawer && Number(selectedForDrawer.id) === disputeOrderId
        ? selectedForDrawer
        : orders.find((order) => Number(order.id) === disputeOrderId)) ?? null
    );
  }, [disputeOrderId, orders, selectedForDrawer]);

  const disputeVendorName =
    (disputeOrder && getAcceptedQuote(disputeOrder)?.vendorName) || "Vendor";
  const disputeAmount =
    (disputeOrder && getAcceptedQuote(disputeOrder)?.totalAmount) ??
    disputeOrder?.budget ??
    0;

  const openAcceptPayment = (order: CustomOrder, quoteId: string) => {
    const quote = order.quotes.find((item) => item.id === quoteId);
    if (!quote) {
      toast.error("Quote not found", {
        description: "Refresh the page and try again.",
      });
      return;
    }

    setAcceptPaymentContext({
      orderId: order.id,
      orderTitle: order.title,
      quote,
    });
    setDetailOpen(false);
    setPaymentMethod("online");
    setAcceptPaymentOpen(true);
  };

  const openDetail = (order: CustomOrder) => {
    setSelectedOrderId(Number(order.id));
    setDetailOpen(true);
  };

  const handleAcceptQuote = (orderId: string, quoteId: string) => {
    const order =
      selectedForDrawer?.id === orderId
        ? selectedForDrawer
        : orders.find((item) => item.id === orderId);
    if (!order) return;
    openAcceptPayment(order, quoteId);
  };

  const confirmAcceptPayment = async () => {
    if (!acceptPaymentContext) return;

    const { orderId, quote } = acceptPaymentContext;

    if (paymentMethod === "wallet" && quote.totalAmount > walletBalance) {
      toast.error("Insufficient wallet balance. Add funds or pay online.");
      return;
    }

    try {
      const result = await payOrder.mutateAsync({
        orderId: Number(orderId),
        payload: {
          quoteId: Number(quote.id),
          paymentMethod,
        },
      });

      if (paymentMethod === "online" && result.checkoutUrl) {
        window.location.href = result.checkoutUrl;
        return;
      }

      toast.success(
        paymentMethod === "wallet"
          ? `Quote accepted and ${formatVendorPrice(quote.totalAmount)} paid from wallet. Funds held in escrow.`
          : "Quote accepted. Payment received."
      );
      setAcceptPaymentOpen(false);
      setAcceptPaymentContext(null);
      setActiveTab("active");
    } catch (err) {
      toast.error("Could not complete payment", {
        description: getCustomOrderErrorMessage(err),
      });
    }
  };

  const handleDeclineQuote = () => {
    toast.message("Quote declined on this device. Refresh to see the latest quotes.");
  };

  const handleReleaseFunds = async (orderId: string) => {
    try {
      await releaseFunds.mutateAsync(Number(orderId));
      toast.success("Funds released to vendor.");
      setDetailOpen(false);
    } catch (err) {
      toast.error("Could not release funds", {
        description: getCustomOrderErrorMessage(err),
      });
    }
  };

  const handleOpenDispute = (orderId: string) => {
    setDisputeOrderId(Number(orderId));
    setIsDisputeOpen(true);
  };

  const handlePayVendor = (orderId: string) => {
    setPayVendorOrderId(Number(orderId));
    setIsPayVendorOpen(true);
  };

  const handleEscalateDispute = (orderId: string) => {
    setEscalateOrderId(Number(orderId));
    setIsEscalateOpen(true);
  };

  const invalidateCustomOrders = (orderId?: number) => {
    void queryClient.invalidateQueries({ queryKey: [CUSTOM_ORDERS_QUERY_KEY] });
    void queryClient.invalidateQueries({ queryKey: [CUSTOM_ORDERS_COUNTS_KEY] });
    if (orderId != null) {
      void queryClient.invalidateQueries({
        queryKey: [CUSTOM_ORDER_DETAIL_KEY, orderId],
      });
    }
  };

  const handleNewOrder = () => {
    setFormData(emptyDraft());
    setFormErrors({});
    setEditorOpen(true);
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

  const handleSubmitForm = async () => {
    if (!validateBeforeSubmit()) return;

    try {
      await createOrder.mutateAsync(formData);
      const categoryName =
        categories.find((item) => item.id === formData.categoryId)?.name ??
        "your category";
      toast.success(`Request sent to vendors in ${categoryName}`);
      setActiveTab("waiting");
      setEditorOpen(false);
    } catch (err) {
      toast.error("Could not submit request", {
        description: getCustomOrderErrorMessage(err),
      });
    }
  };

  const isSubmitting = createOrder.isPending;
  const isPaying = payOrder.isPending;

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="font-unbounded text-[28px] leading-8 font-semibold text-secondary-200">
            Custom requests
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
          disabled={categoriesLoading}
        >
          <Plus className="h-4 w-4" />
          New custom order
        </Button>
      </div>

      <div className="mb-8 flex gap-2 overflow-x-auto pb-1">
        {CUSTOM_ORDER_TABS.map((tab) => {
          const count = tabCounts?.[tab.id] ?? 0;
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

      {ordersLoading ? (
        <div className="flex h-48 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary-100" />
        </div>
      ) : orders.length > 0 ? (
        <div className="space-y-4">
          {orders.map((order) => (
            <CustomOrderListCard
              key={order.id}
              order={order}
              activeTab={activeTab}
              onViewDetails={openDetail}
            />
          ))}
        </div>
      ) : (
        <CustomOrderEmptyState tab={activeTab} onCreate={handleNewOrder} />
      )}

      <CustomOrderDetailDrawer
        open={detailOpen}
        onOpenChange={(open) => {
          setDetailOpen(open);
          if (!open && !acceptPaymentOpen) {
            setSelectedOrderId(null);
          }
        }}
        order={selectedForDrawer}
        isLoading={detailLoading}
        onAcceptQuote={handleAcceptQuote}
        onDeclineQuote={() => handleDeclineQuote()}
        onReleaseFunds={handleReleaseFunds}
        onOpenDispute={handleOpenDispute}
        onPayVendor={handlePayVendor}
        onEscalateDispute={handleEscalateDispute}
        isReleasingFunds={releaseFunds.isPending}
      />

      <OpenDisputeDialog
        orderType="custom_request"
        orderId={disputeOrderId}
        vendorName={disputeVendorName}
        amount={disputeAmount}
        open={isDisputeOpen}
        onOpenChange={(open) => {
          setIsDisputeOpen(open);
          if (!open) setDisputeOrderId(null);
        }}
        onInvalidate={() => {
          if (disputeOrderId != null) invalidateCustomOrders(disputeOrderId);
        }}
        onSubmitted={() => setDisputeOrderId(null)}
      />

      <DisputeResolutionDialog
        open={isPayVendorOpen}
        onOpenChange={setIsPayVendorOpen}
        title="Pay vendor & close dispute"
        description="You agree the issue is resolved and payment should go to the vendor. Add a short note about what you agreed."
        confirmLabel="Pay vendor"
        isPending={isResolvingDispute}
        onConfirm={(resolution) => {
          if (payVendorOrderId == null) return;
          resolveDispute(
            {
              type: "custom_request",
              orderId: payVendorOrderId,
              resolution,
            },
            {
              onSuccess: () => {
                setIsPayVendorOpen(false);
                setPayVendorOrderId(null);
              },
            }
          );
        }}
      />

      <EscalateDisputeDialog
        open={isEscalateOpen}
        onOpenChange={setIsEscalateOpen}
        isPending={isEscalating}
        onConfirm={() => {
          if (escalateOrderId == null) return;
          escalateDispute(
            { type: "custom_request", orderId: escalateOrderId },
            {
              onSuccess: () => {
                setIsEscalateOpen(false);
                setEscalateOrderId(null);
              },
            }
          );
        }}
      />

      <ServiceFormEditorDrawer
        open={editorOpen}
        onOpenChange={setEditorOpen}
        isEditMode={false}
        formData={formData}
        setFormData={setFormData}
        categories={categories}
        selectedCategoryVendorCount={selectedCategoryVendorCount}
        onSubmit={handleSubmitForm}
        isValid={validateCustomOrderDraft(formData).success}
        fieldErrors={formErrors}
      />

      <AcceptQuotePaymentDialog
        open={acceptPaymentOpen}
        onOpenChange={(open) => {
          setAcceptPaymentOpen(open);
          if (!open) setAcceptPaymentContext(null);
        }}
        quote={acceptPaymentContext?.quote ?? null}
        orderTitle={acceptPaymentContext?.orderTitle}
        paymentMethod={paymentMethod}
        onPaymentMethodChange={setPaymentMethod}
        walletBalance={walletBalance}
        walletLoading={walletLoading}
        onFundWallet={() => setFundWalletOpen(true)}
        onConfirm={confirmAcceptPayment}
        isSubmitting={isPaying}
      />

      <FundWalletDrawer
        isOpen={fundWalletOpen}
        onClose={() => setFundWalletOpen(false)}
      />
    </div>
  );
}
