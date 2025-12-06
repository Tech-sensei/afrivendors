"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, ArrowRight, Bell, Menu } from "lucide-react";
import Logo from "../../../public/assets/images/Logo.svg";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { UserMenu } from "./UserMenu";
import { NotificationPanel } from "./NotificationPanel";

const Header = () => {
  // Hardcoded user status - replace with actual auth state later
  const isLoggedIn = true; // Change to false to see logged-out state
  // const isLoggedIn = false; // Change to false to see logged-out state

  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  const navLinks = [
    { label: "Browse", href: "/categories" },
    { label: "About", href: "/about-us" },
    { label: "How it Works", href: "/how-it-works" },
    { label: "Contact Us", href: "/contact-us" },
  ];

  // User data - replace with actual user data later
  const userInitials = "AO";
  const userName = "Amara Okonkwo";
  const userEmail = "amara@example.com";
  const notificationCount = 2;

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-accent-20">
      <div className="container mx-auto px-4 md:px-6 lg:px-24">
        <div className="flex items-center justify-between h-20 gap-4">
          {/* Mobile Menu Button */}
          <Sheet>
            <SheetTrigger asChild>
              <button
                type="button"
                className="lg:hidden p-2 text-secondary-000 hover:text-accent-80 transition-colors"
                aria-label="Open menu"
              >
                <Menu className="size-6" />
              </button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="w-[85%] sm:w-[400px] rounded-r-3xl border-l-0 p-0"
            >
              <SheetHeader className="px-6 pt-8 pb-6">
                <SheetTitle className="text-secondary-000 font-bold text-3xl tracking-[-0.02em]">
                  Menu
                </SheetTitle>
                <p className="text-secondary-000 text-base font-normal mt-2">
                  Browse and explore Afrivendor
                </p>
              </SheetHeader>

              {/* Mobile Menu Content */}
              <div className="flex flex-col px-6 pb-6">
                {/* Mobile Navigation Links */}
                <nav className="flex flex-col gap-1">
                  {navLinks.map((link) => (
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

                {/* Mobile Action Buttons */}
                <div className="flex flex-col gap-4 mt-8 pt-6 border-t border-accent-20">
                  <SheetClose asChild>
                    <Button
                      variant="outline"
                      className="w-full border-secondary-000 text-secondary-000 bg-white hover:bg-secondary-000 hover:text-white rounded-full transition-all duration-300 h-12"
                      asChild
                    >
                      <Link href="/vendor/register" className="text-secondary-000 font-semibold text-base transition-colors tracking-[-0.01em]">
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
                        <Link href="/sign-up-choice" className="flex items-center justify-center gap-2 text-white font-semibold text-base transition-colors tracking-[-0.01em]">
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

          {/* Logo */}
          <Link href="/" className="shrink-0">
            <Image
              src={Logo}
              alt="Afrivendor Logo"
              width={220}
              height={23}
              className="h-6 sm:h-7 w-auto hover:opacity-80 transition-opacity duration-300"
              priority
            />
          </Link>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-sm mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-accent-60 size-5" />
              <input
                type="text"
                placeholder="Search vendors, services, categories..."
                className="w-full h-10 pl-10 pr-4 rounded-full border border-accent-60 text-accent-80 placeholder:text-accent-60 focus:outline-none focus:ring-2 focus:ring-primary-100/20 focus:border-primary-100 transition-all"
              />
            </div>
          </div>

          {/* Navigation Links - Desktop */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-secondary-000 hover:text-accent-80 font-medium text-base transition-colors tracking-[-0.01em]"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Action Buttons - Desktop */}
          <div className="flex items-center gap-4 shrink-0">
            {/* Become a Vendor Button - Desktop */}
            <Button
              variant="outline"
              className="hidden lg:flex border-secondary-000 text-secondary-000 bg-white hover:bg-secondary-000 hover:text-white rounded-full transition-all duration-300"
              asChild
            >
              <Link href="/vendor/register" className="text-secondary-000 font-semibold text-base transition-colors tracking-[-0.01em]">Become a Vendor</Link>
            </Button>

            {isLoggedIn ? (
              <>
                {/* Notification Icon with Badge */}
                <button
                  type="button"
                  onClick={() => setIsNotificationOpen(true)}
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
                  onNavigate={(page) => {
                    console.log("Navigate to:", page);
                    // Add navigation logic here
                  }}
                  onLogout={() => {
                    console.log("Logout");
                    // Add logout logic here
                  }}
                />
              </>
            ) : (
              /* Log In/Sign Up Button - Desktop */
              <Button
                className="hidden md:flex bg-primary-100 text-white hover:bg-primary-100/90 transition-colors rounded-full"
                asChild
              >
                <Link href="/sign-up-choice" className="flex items-center gap-2 text-white font-semibold text-base transition-colors tracking-[-0.01em]">
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
        onClose={() => setIsNotificationOpen(false)}
        onNavigate={(page) => {
          console.log("Navigate to:", page);
          // Add navigation logic here
        }}
      />
    </header>
  );
};

export default Header;
