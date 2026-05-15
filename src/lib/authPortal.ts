/**
 * Sent as `portal` on `POST /auth/login` — must match backend contract.
 */
export const APP_AUTH_PORTAL = "user" as const;

const EXPECTED_LOGIN_ACCOUNT_TYPE = "user";

export function loginAccountTypeMatchesPortal(accountType?: string | null): boolean {
  if (accountType == null || String(accountType).trim() === "") return true;
  return String(accountType).trim().toLowerCase() === EXPECTED_LOGIN_ACCOUNT_TYPE;
}

export function wrongPortalLoginMessage(): string {
  return "This account isn't for the client app. Use the vendor or admin portal to sign in.";
}

export function assertLoginAccountTypeOrThrow(data: { accountType?: string | null }) {
  if (!loginAccountTypeMatchesPortal(data?.accountType)) {
    const err = new Error(wrongPortalLoginMessage()) as Error & { wrongPortal: true };
    err.wrongPortal = true;
    throw err;
  }
}
