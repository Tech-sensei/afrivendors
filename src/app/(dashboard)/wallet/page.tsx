"use client";

import { useState, useEffect } from "react";
import {
  Plus,
  ChevronRight,
  Loader2,
  Eye,
  EyeOff,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TransactionDetail } from "@/components/wallet/TransactionDetail";
import { FundWalletDrawer } from "@/components/wallet/FundWalletDrawer";
import { format, parseISO } from "date-fns";
import { useTransactions, useWallet } from "@/services/useTransactions";
import type { Transaction } from "@/types/wallet";

const LIMIT = 10;

function getTypeLabel(type: Transaction["type"]) {
  switch (type) {
    case "wallet_top_up":
      return "Wallet top-up";
    case "appointment_payment":
      return "Appointment payment";
    case "refund":
      return "Refund";
    default:
      return type;
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

export default function WalletPage() {
  const [fundWalletOpen, setFundWalletOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isBalanceVisible, setIsBalanceVisible] = useState(true);

  // Pagination state
  const [page, setPage] = useState(1);
  const [allTransactions, setAllTransactions] = useState<Transaction[]>([]);

  const { data: wallet, isLoading: walletLoading } = useWallet();
  const { data, isLoading, isFetching } = useTransactions(page, LIMIT);

  // Accumulate items across pages
  useEffect(() => {
    if (!data?.items) return;
    if (page === 1) {
      setAllTransactions(data.items);
    } else {
      setAllTransactions((prev) => [...prev, ...data.items]);
    }
  }, [data]);

  const total = data?.total ?? 0;
  const hasMore = allTransactions.length < total;

  const handleLoadMore = () => setPage((p) => p + 1);

  const handleViewDetails = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setDetailsOpen(true);
  };

  return (
    <div>
      <h1 className="mb-6 font-unbounded text-[28px] leading-8 font-semibold text-secondary-200">
        Wallet
      </h1>

      {/* Balance Card */}
      <Card className="mb-6 rounded-2xl border-0 bg-primary-100 shadow-[0_8px_24px_rgba(35,19,5,0.15)] overflow-hidden">
        <CardContent className="p-6">
          <p className="mb-1 text-sm text-white/80 font-medium">Total Balance</p>
          <div className="flex items-end justify-between gap-4 mb-4">
            {walletLoading ? (
              <div className="h-10 w-36 rounded-lg bg-white/20 animate-pulse" />
            ) : (
              <p className="font-unbounded text-4xl font-bold text-white leading-none">
                {isBalanceVisible
                  ? `£${(wallet?.balance ?? 0).toFixed(2)}`
                  : "••••••"}
              </p>
            )}
            <button
              onClick={() => setIsBalanceVisible((v) => !v)}
              className="text-white/70 hover:text-white transition-colors p-1"
            >
              {isBalanceVisible ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
          {wallet?.escrowBalance != null && wallet.escrowBalance > 0 && (
            <p className="text-xs text-white/60 mb-1">
              Escrow: £{wallet.escrowBalance.toFixed(2)}
            </p>
          )}
          <p className="text-xs text-white/60">{wallet?.currency ?? "GBP"} account</p>
        </CardContent>
      </Card>

      <div className="mb-8">
        <Button
          onClick={() => setFundWalletOpen(true)}
          className="w-full h-12 bg-primary-100 text-white hover:bg-[#a65620] rounded-xl text-sm font-semibold shadow-lg shadow-primary-100/20"
        >
          <Plus className="h-4 w-4 mr-2" />
          Fund Wallet
        </Button>
      </div>

      {/* Transactions Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-secondary-000">Transactions</h2>
        {total > 0 && (
          <span className="text-xs text-accent-60">
            {allTransactions.length} of {total}
          </span>
        )}
      </div>

      {/* Initial load */}
      {isLoading && page === 1 ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 text-primary-100 animate-spin" />
        </div>
      ) : allTransactions.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center rounded-2xl border border-dashed border-accent-20 bg-accent-10/30">
          <p className="text-accent-60 text-sm">No transactions yet.</p>
          <p className="text-accent-40 text-xs mt-1">Fund your wallet to get started.</p>
        </div>
      ) : (
        <>
          <div className="space-y-2">
            {allTransactions.map((txn) => {
              const credit = isCredit(txn.type);
              return (
              <div
                key={txn.id}
                onClick={() => handleViewDetails(txn)}
                className="flex items-center gap-3 p-4 rounded-xl bg-white border border-accent-20 cursor-pointer hover:border-accent-40 hover:shadow-sm transition-all"
              >
                <div className="flex-1 min-w-0 space-y-2">
                  <p className="text-sm font-semibold text-secondary-000 line-clamp-2">
                    {txn.description}
                  </p>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge className="text-[10px] font-semibold capitalize border-0 px-2 py-0.5 bg-accent-10 text-accent-80">
                      {getTypeLabel(txn.type)}
                    </Badge>
                    <Badge className={`text-[10px] font-semibold capitalize border-0 px-2 py-0.5 ${getStatusStyle(txn.status)}`}>
                      {txn.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-accent-60">
                    {format(parseISO(txn.createdAt), "MMM d, yyyy")}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <p className={`text-base font-bold whitespace-nowrap ${credit ? "text-green-600" : "text-red-600"}`}>
                    {credit ? "+" : "-"}£{txn.amount.toFixed(2)}
                  </p>
                  <ChevronRight className="h-4 w-4 text-accent-60" />
                </div>
              </div>
            );
            })}
          </div>

          {/* Load More */}
          {hasMore && (
            <Button
              variant="outline"
              onClick={handleLoadMore}
              disabled={isFetching}
              className="w-full mt-4 h-11 rounded-xl border-accent-20 text-sm font-semibold text-accent-80 hover:bg-accent-10"
            >
              {isFetching ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Loading…
                </>
              ) : (
                `Load More (${total - allTransactions.length} remaining)`
              )}
            </Button>
          )}

          {!hasMore && total > LIMIT && (
            <p className="text-center text-xs text-accent-40 mt-4">
              All {total} transactions loaded
            </p>
          )}
        </>
      )}

      <TransactionDetail
        transaction={selectedTransaction}
        isOpen={detailsOpen}
        onClose={() => {
          setDetailsOpen(false);
          setSelectedTransaction(null);
        }}
      />

      <FundWalletDrawer
        isOpen={fundWalletOpen}
        onClose={() => setFundWalletOpen(false)}
      />
    </div>
  );
}
