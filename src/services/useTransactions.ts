import { useQuery, useMutation } from "@tanstack/react-query";
import http from "@/lib/http";
import type { Transaction, TransactionsResponse, WalletInfo } from "@/types/wallet";

export const useWallet = () =>
  useQuery<WalletInfo>({
    queryKey: ["wallet"],
    queryFn: async () => {
      const { data } = await http.get("/wallet/me");
      return (data?.data ?? data) as WalletInfo;
    },
  });

export const useTransactions = (page = 1, limit = 20) =>
  useQuery<TransactionsResponse>({
    queryKey: ["transactions", page, limit],
    queryFn: async () => {
      const { data } = await http.get(`/transactions?page=${page}&limit=${limit}`);
      return data?.data ?? data;
    },
  });

export const useTransactionDetail = (id: number | undefined, enabled: boolean) =>
  useQuery<Transaction>({
    queryKey: ["transaction-detail", id],
    queryFn: async () => {
      const { data } = await http.get(`/transactions/${id}`);
      return (data?.data ?? data) as Transaction;
    },
    enabled: enabled && !!id,
    staleTime: 30_000,
  });

export const useFundWallet = () =>
  useMutation({
    mutationFn: async (amount: number) => {
      const { data } = await http.post("/wallet/fund", { amount });
      return (data?.data ?? data) as { checkoutUrl: string; sessionId: string; transactionId: number };
    },
  });
