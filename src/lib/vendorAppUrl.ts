/** Base URL for the vendor dashboard (sign-up, subscription, etc.). */
export const VENDOR_APP_URL =
  process.env.NEXT_PUBLIC_VENDOR_APP_URL?.replace(/\/$/, "") ??
  "https://afrivendors-vendor-dashboard.vercel.app";

export function getVendorAppUrl(path = ""): string {
  if (!path) return VENDOR_APP_URL;
  return `${VENDOR_APP_URL}${path.startsWith("/") ? path : `/${path}`}`;
}
