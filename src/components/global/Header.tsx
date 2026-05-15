"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowRight, Bell, TextAlignJustify } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { UserMenu } from "./UserMenu";
import { NotificationPanel } from "./NotificationPanel";
import { LogoutConfirmModal } from "@/components/dashboard/LogoutConfirmModal";
import { useAuthAPI } from "@/services/useAuthAPI";
import { useAppSelector } from "@/store/hooks";

// Module-level constants — never recreated on re-render
const NAV_LINKS = [
  { label: "Browse", href: "/categories" },
  { label: "About", href: "/about-us" },
  { label: "How it Works", href: "/how-it-works" },
  { label: "Contact Us", href: "/contact-us" },
];

const NOTIFICATION_ROUTE_MAP: Record<string, string> = {
  "dashboard-appointments": "/appointments",
  "dashboard-messages": "/messages",
  "dashboard-wallet": "/wallet",
  "dashboard-payments": "/payments",
  "dashboard-favourites": "/favourites",
  "dashboard-profile": "/profile",
  "dashboard-settings": "/settings",
};

function mapNotificationUrl(url: string): string {
  if (url.startsWith("dashboard-")) {
    return NOTIFICATION_ROUTE_MAP[url] ?? url;
  }
  return url;
}

const Header = () => {
  const router = useRouter();
  const { logoutAsync } = useAuthAPI();
  const { user: currentUser, isAuthenticated } = useAppSelector((state) => state.auth);
  const [isNotificationOpen, setNotificationOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const isLoggedIn = isAuthenticated;

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const userName = currentUser ? `${currentUser.firstName ?? ''} ${currentUser.lastName ?? ''}`.trim() : '';
  const userEmail = currentUser?.email ?? '';
  const userInitials = currentUser
    ? `${currentUser.firstName?.[0] ?? ''}${currentUser.lastName?.[0] ?? ''}`.toUpperCase()
    : '';
  const notificationCount = 2;

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-accent-20">
      <div className="container mx-auto px-4 md:px-6 lg:px-24">
        <div className="relative grid h-20 w-full grid-cols-[auto_1fr] items-center gap-3 md:gap-4 lg:grid-cols-[1fr_auto_1fr]">
          {/* Logo + mobile menu (single grid column) */}
          <div className="flex min-w-0 items-center gap-3 justify-self-start">
            {isMounted && (
              <Sheet>
                <SheetTrigger asChild>
                  <button
                    type="button"
                    className="lg:hidden text-secondary-000 hover:text-accent-80 transition-colors"
                    aria-label="Open menu"
                  >
                    <TextAlignJustify className="size-6" />
                  </button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[85%] sm:w-[400px] rounded-r-3xl border-l-0 p-0">
                  <SheetHeader className="px-6 pt-8 pb-6">
                    <SheetTitle className="text-secondary-000 font-bold text-3xl tracking-[-0.02em]">Menu</SheetTitle>
                    <p className="text-secondary-000 text-base font-normal mt-2">Browse and explore Afrivendor</p>
                  </SheetHeader>

                  <div className="flex flex-col px-6 pb-6">
                    <nav className="flex flex-col gap-1">
                      {NAV_LINKS.map((link) => (
                        <SheetClose key={link.href} asChild>
                          <Link
                            href={link.href}
                            className="text-secondary-000 font-normal text-base transition-colors tracking-[-0.01em] py-3 px-4 rounded-lg hover:bg-primary-300/50"
                          >
                            {link.label}
                          </Link>
                        </SheetClose>
                      ))}
                    </nav>

                    <div className="flex flex-col gap-4 mt-8 pt-6 border-t border-accent-20">
                      <SheetClose asChild>
                        <Button
                          variant="outline"
                          className="w-full border-secondary-000 text-secondary-000 bg-white hover:bg-secondary-000 hover:text-white rounded-full transition-all duration-300 h-12"
                          asChild
                        >
                          <Link
                            href="/vendor/register"
                            className="text-secondary-000 font-semibold text-base transition-colors tracking-[-0.01em]"
                          >
                            Become a Vendor
                          </Link>
                        </Button>
                      </SheetClose>

                      {!isLoggedIn && (
                        <SheetClose asChild>
                          <Button
                            className="w-full bg-primary-100 text-white hover:bg-primary-100/90 transition-colors rounded-full h-12"
                            asChild
                          >
                            <Link
                              href="/sign-up-choice"
                              className="flex items-center justify-center gap-2 text-white font-semibold text-base transition-colors tracking-[-0.01em]"
                            >
                              Log In/Sign Up
                              <ArrowRight className="size-4" />
                            </Link>
                          </Button>
                        </SheetClose>
                      )}
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            )}

            {!isMounted && (
              <button
                type="button"
                className="lg:hidden p-2 text-secondary-000 hover:text-accent-80 transition-colors"
                aria-label="Open menu"
              >
                <TextAlignJustify className="size-6" />
              </button>
            )}

            <Link href="/" className="shrink-0">
              <Image
                src="/assets/images/Logo.svg"
                alt="Afrivendor Logo"
                width={220}
                height={23}
                className="h-6 sm:h-7 w-auto hover:opacity-80 transition-opacity duration-300"
                priority
              />
            </Link>
          </div>

          {/* Navigation Links - Desktop, centered in header */}
          <nav className="hidden items-center justify-center gap-6 xl:gap-8 lg:flex lg:justify-self-center">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-secondary-000 hover:text-accent-80 font-medium text-base transition-colors tracking-[-0.01em]"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 sm:gap-4 shrink-0 justify-self-end">
            {/* Become a Vendor Button - Desktop */}
            <Button
              variant="outline"
              className="hidden lg:flex border-secondary-000 text-secondary-000 bg-white hover:bg-secondary-000 hover:text-white rounded-full transition-all duration-300"
              asChild
            >
              <Link href="/vendor/register" className="text-secondary-000 font-semibold text-base transition-colors tracking-[-0.01em]">
                Become a Vendor
              </Link>
            </Button>

            {!isMounted ? (
              /* Skeleton — prevents SSR hydration flash */
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-accent-20 animate-pulse" />
                <div className="h-9 w-9 rounded-full bg-accent-20 animate-pulse" />
              </div>
            ) : isLoggedIn ? (
              <>
                {/* Notification Icon with Badge */}
                <button
                  type="button"
                  onClick={() => setNotificationOpen(true)}
                  className="relative p-2 text-secondary-000 hover:text-accent-80 transition-colors cursor-pointer"
                  aria-label="Notifications"
                >
                  <Bell className="size-6" />
                  {notificationCount > 0 && (
                    <span className="absolute top-1 right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 bg-primary-100 text-white text-xs font-semibold rounded-full">
                      {notificationCount}
                    </span>
                  )}
                </button>

                {/* User Menu */}
                <UserMenu
                  userInitials={userInitials}
                  userName={userName}
                  userEmail={userEmail}
                  profilePhoto={currentUser?.profilePhoto}
                  onNavigate={() => {
                    // Navigation is handled inside UserMenu component
                  }}
                  onLogout={() => {
                    setIsLogoutModalOpen(true);
                  }}
                />
              </>
            ) : (
              /* Log In/Sign Up Button - Desktop */
              <Button size="lg" className="hidden md:flex bg-primary-100 text-white hover:bg-primary-100/90 transition-colors rounded-full" asChild>
                <Link
                  href="/sign-up-choice"
                  className="flex items-center gap-2 text-white font-semibold text-base transition-colors tracking-[-0.01em]"
                >
                  Log In/Sign Up
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Notification Panel */}
      <NotificationPanel
        isOpen={isNotificationOpen}
        onClose={() => setNotificationOpen(false)}
        onNavigate={(page) => {
          const route = mapNotificationUrl(page);
          router.push(route);
        }}
      />

      {/* Logout Confirm Modal */}
      <LogoutConfirmModal
        open={isLogoutModalOpen}
        onOpenChange={setIsLogoutModalOpen}
        onConfirm={async () => {
          await logoutAsync();
          setIsLogoutModalOpen(false);
          router.push('/');
        }}
      />
    </header>
  );
};

export default Header;
