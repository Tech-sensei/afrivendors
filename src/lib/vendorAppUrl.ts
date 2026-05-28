/** Base URL for the vendor dashboard (sign-up, subscription, etc.). */
export function getVendorAppUrl(path = ""): string {
  const base =
    process.env.NEXT_PUBLIC_VENDOR_APP_URL?.replace(/\/$/, "") ??
    "http://localhost:3001";
  if (!path) return base;
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}
