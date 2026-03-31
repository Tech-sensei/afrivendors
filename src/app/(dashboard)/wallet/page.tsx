"use client";

import { useState } from "react";
import { Plus, ArrowDownCircle, ArrowUpCircle, RotateCcw, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { TransactionDetail } from "@/components/wallet/TransactionDetail";
import { FundWalletDrawer } from "@/components/wallet/FundWalletDrawer";
import { toast } from "sonner";
import type { SavedCard, Transaction, WalletCardInput } from "@/types/wallet";

const transactions: Transaction[] = [
  {
    id: 1,
    date: "Nov 8, 2025",
    type: "debit" as const,
    vendor: "ZuriGlow Beauty Hub",
    service: "Box Braids",
    amount: -70,
    status: "completed" as const,
    reference: "TXN-2025-1108-001",
  },
  {
    id: 2,
    date: "Nov 7, 2025",
    type: "credit" as const,
    vendor: "Wallet Top-up",
    service: "Funding",
    amount: 500,
    status: "completed" as const,
    reference: "TXN-2025-1107-001",
  },
  {
    id: 3,
    date: "Nov 5, 2025",
    type: "debit" as const,
    vendor: "Fade District Barbershop",
    service: "Precision Cut",
    amount: -40,
    status: "completed" as const,
    reference: "TXN-2025-1105-001",
  },
  {
    id: 4,
    date: "Nov 3, 2025",
    type: "debit" as const,
    vendor: "Chef Aisha's Kitchen",
    service: "Private Chef Dinner",
    amount: -150,
    status: "pending" as const,
    reference: "TXN-2025-1103-001",
  },
  {
    id: 5,
    date: "Nov 1, 2025",
    type: "refund" as const,
    vendor: "TastyRoots Catering",
    service: "Corporate Lunch (Cancelled)",
    amount: 180,
    status: "refunded" as const,
    reference: "TXN-2025-1101-001",
  },
];

export default function WalletPage() {
  const [fundWalletOpen, setFundWalletOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isBalanceVisible, setIsBalanceVisible] = useState(true);

  // Saved cards
  const [savedCards, setSavedCards] = useState<SavedCard[]>([
    { id: "card-1", lastFour: "4242", brand: "Visa", expiryMonth: "12", expiryYear: "25", isDefault: true },
    { id: "card-2", lastFour: "5555", brand: "Mastercard", expiryMonth: "08", expiryYear: "26", isDefault: false },
  ]);

  const balance = 430;
  const lastTopup = { amount: 500, date: "Nov 7, 2025" };

  const handleFundWallet = (
    amount: string,
    paymentMethod: string,
    cardData?: WalletCardInput
  ) => {
    toast.success(`£${amount} added to your wallet!`);
    setFundWalletOpen(false);

    // If new card was added and should be saved
    if (cardData && cardData.saveAsDefault) {
      const newCard: SavedCard = {
        id: `card-${Date.now()}`,
        lastFour: cardData.cardNumber.slice(-4),
        brand: "Card", // You might want to detect this from card number
        expiryMonth: cardData.cardExpiry.split("/")[0],
        expiryYear: cardData.cardExpiry.split("/")[1],
        isDefault: cardData.saveAsDefault,
      };
      setSavedCards((prev) => [newCard, ...prev]);
    }
  };

  const handleDeleteCard = (cardId: string) => {
    setSavedCards(savedCards.filter((card) => card.id !== cardId));
    toast.success("Card removed successfully");
  };

  const handleViewDetails = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setDetailsOpen(true);
  };

  return (
    <div>
      {/* Page Title */}
      <h1 className="mb-6 font-unbounded text-[28px] leading-8 font-semibold text-secondary-200">Wallet</h1>

      {/* Balance Card */}
      <Card className="mb-6 rounded-2xl border border-accent-20 bg-primary-100 shadow-[0_8px_24px_rgba(35,19,5,0.06)] overflow-hidden">
        <CardContent className="p-6 min-h-[140px]">
          <div className="flex flex-col h-full">
            <p className="mb-2 text-sm text-white/90">Total Balance</p>
            <p className="mb-4 font-unbounded text-4xl font-semibold text-white leading-none">
              {isBalanceVisible ? `£${balance.toFixed(2)}` : "******"}
            </p>
            <div className="flex items-center justify-between">
              <p className="text-xs text-white/80">
                Last top-up: £{lastTopup.amount} on {lastTopup.date}
              </p>
              <div className="flex items-center gap-2">
                <Label htmlFor="balance-toggle" className="text-xs text-white/80 cursor-pointer">
                  {isBalanceVisible ? "Hide" : "Show"}
                </Label>
                <Switch id="balance-toggle" checked={isBalanceVisible} onCheckedChange={setIsBalanceVisible} />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Fund Wallet Button */}
      <Button
        onClick={() => setFundWalletOpen(true)}
        className="w-full mb-6 h-12 bg-primary-100 text-white hover:bg-primary-100/90 rounded-xl text-sm font-semibold"
      >
        <Plus className="h-4 w-4 mr-2" />
        Fund Wallet
      </Button>

      {/* Recent Transactions */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-secondary-000 leading-6">Recent Transactions</h2>
      </div>

      {/* Transaction List */}
      <div className="space-y-2">
        {transactions.map((transaction) => {
          const isCredit = transaction.amount > 0;
          const isRefund = transaction.type === "refund";

          const getIcon = () => {
            if (isRefund) return RotateCcw;
            return isCredit ? ArrowDownCircle : ArrowUpCircle;
          };

          const Icon = getIcon();
          const iconColor = isRefund ? "text-blue-600" : isCredit ? "text-green-600" : "text-red-600";
          const iconBg = isRefund ? "bg-blue-50" : isCredit ? "bg-green-50" : "bg-red-50";

          return (
            <div
              key={transaction.id}
              onClick={() => handleViewDetails(transaction)}
              className="flex items-center gap-4 p-4 rounded-xl bg-white border border-accent-20 cursor-pointer"
            >
              {/* Icon */}
              <div className={`shrink-0 w-12 h-12 rounded-xl ${iconBg} flex items-center justify-center`}>
                <Icon className={`h-6 w-6 ${iconColor}`} />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3 mb-1">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-secondary-000 truncate">{transaction.vendor}</p>
                    <p className="text-xs text-accent-80 mt-0.5">{transaction.service}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <p className={`text-base font-semibold whitespace-nowrap ${isCredit ? "text-green-600" : "text-red-600"}`}>
                      {isCredit ? "+" : ""}£{Math.abs(transaction.amount).toFixed(2)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center gap-2">
                    <p className="text-xs text-accent-60">{transaction.date}</p>
                    <span className="text-accent-40">•</span>
                    <StatusBadge status={transaction.status} size="sm" />
                  </div>
                  <ChevronRight className="h-4 w-4 text-accent-60" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Transaction Details Drawer */}
      <TransactionDetail
        transaction={selectedTransaction}
        isOpen={detailsOpen}
        onClose={() => {
          setDetailsOpen(false);
          setSelectedTransaction(null);
        }}
      />

      {/* Fund Wallet Drawer */}
      <FundWalletDrawer
        isOpen={fundWalletOpen}
        onClose={() => setFundWalletOpen(false)}
        savedCards={savedCards}
        onDeleteCard={handleDeleteCard}
        onFundWallet={handleFundWallet}
      />
    </div>
  );
}
