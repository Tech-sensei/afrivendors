import { useMutation, useQuery } from "@tanstack/react-query";
import http from "@/lib/http";
import type { SavedPaymentAccount } from "@/types/savedPaymentMethod";

/**
 * Client payment methods — mirrors the vendor dashboard pattern.
 * Adjust paths to match your API: default GET `/users/accounts`, POST `/users/stripe-connect-account-link`.
 */
export const USER_PAYMENT_ACCOUNTS_QUERY_KEY = ["users", "accounts"] as const;

/** Stripe external account / payment method row from `GET /users/accounts` (shape may vary). */
export interface UserStripeExternalAccountApi {
  id: string;
  object: string;
  bank_name?: string | null;
  last4?: string | null;
  account_holder_name?: string | null;
  default_for_currency?: boolean;
  currency?: string | null;
  country?: string | null;
  status?: string | null;
  brand?: string | null;
}

function unwrapAccountsPayload(data: unknown): UserStripeExternalAccountApi[] {
  if (Array.isArray(data)) return data as UserStripeExternalAccountApi[];
  if (data && typeof data === "object" && "data" in data) {
    const inner = (data as { data: unknown }).data;
    if (Array.isArray(inner)) return inner as UserStripeExternalAccountApi[];
  }
  return [];
}

function mapStripeRowToSavedAccount(row: UserStripeExternalAccountApi): SavedPaymentAccount {
  const last4 = row.last4?.replace(/\D/g, "").slice(-4) || "????";
  const bankName = (row.bank_name || row.brand || "Bank").trim() || "Bank";
  const holder = row.account_holder_name?.trim();
  const cur = (row.currency || "").toUpperCase();

  if (row.object === "bank_account") {
    const label = holder || `${bankName}${cur ? ` (${cur})` : ""}`;
    return {
      id: row.id,
      type: "bank",
      name: label,
      details: `****${last4} - ${bankName}`,
      isDefault: Boolean(row.default_for_currency),
    };
  }

  if (row.object === "card") {
    return {
      id: row.id,
      type: "bank",
      name: holder || `${row.brand ?? "Card"}${cur ? ` (${cur})` : ""}`,
      details: `****${last4}${row.brand ? ` - ${row.brand}` : ""}`,
      isDefault: Boolean(row.default_for_currency),
    };
  }

  return {
    id: row.id,
    type: "bank",
    name: holder || `Payment method (${row.object})`,
    details: row.last4 ? `****${last4}` : row.id,
    isDefault: Boolean(row.default_for_currency),
  };
}

export function mapUserAccountsToSavedAccounts(
  rows: UserStripeExternalAccountApi[]
): SavedPaymentAccount[] {
  const mapped = rows.map(mapStripeRowToSavedAccount);
  return mapped.sort((a, b) => Number(b.isDefault) - Number(a.isDefault));
}

type UseUserPaymentAccountsOptions = {
  /** When false, does not call `GET /users/accounts`; still reads cache if Settings already fetched. */
  enabled?: boolean;
};

export function useUserPaymentAccounts(options?: UseUserPaymentAccountsOptions) {
  const enabled = options?.enabled ?? true;
  return useQuery({
    queryKey: USER_PAYMENT_ACCOUNTS_QUERY_KEY,
    queryFn: async () => {
      const { data } = await http.get<unknown>("/users/accounts");
      const rows = unwrapAccountsPayload(data);
      return mapUserAccountsToSavedAccounts(rows);
    },
    staleTime: 60_000,
    enabled,
  });
}

function unwrapAccountLink(data: unknown): string {
  if (data && typeof data === "object") {
    const o = data as Record<string, unknown>;
    if (typeof o.accountLink === "string" && o.accountLink.length > 0) {
      return o.accountLink;
    }
    const inner = o.data;
    if (inner && typeof inner === "object") {
      const link = (inner as Record<string, unknown>).accountLink;
      if (typeof link === "string" && link.length > 0) return link;
    }
  }
  throw new Error("No account link in response");
}

/** `POST /users/stripe-connect-account-link` → redirect URL (mirror vendor flow for clients). */
export async function fetchUserStripeAccountLink(): Promise<string> {
  const { data } = await http.post<unknown>("/users/stripe-connect-account-link", {});
  return unwrapAccountLink(data);
}

export function useUserStripeAccountLink() {
  return useMutation({
    mutationFn: fetchUserStripeAccountLink,
  });
}
