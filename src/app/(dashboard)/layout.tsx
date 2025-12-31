"use client";

import { User, Calendar, Wallet, Heart, FileText, Settings, LogOut, HelpCircle, Download, MessageCircle } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ReactNode, useState } from 'react';
import { LogoutConfirmModal } from '@/components/dashboard/LogoutConfirmModal';
import { cn } from '@/lib/utils';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/global/Header';

export default function DashboardLayout({
    children,
}: {
    children: ReactNode;
}) {
    const pathname = usePathname();
    const router = useRouter();
    const [logoutModalOpen, setLogoutModalOpen] = useState(false);

    const tabs = [
        { id: 'dashboard-profile', label: 'Profile', icon: User, page: '/profile' },
        { id: 'dashboard-appointments', label: 'Appointments', icon: Calendar, page: '/appointments' },
        { id: 'dashboard-messages', label: 'Messages', icon: MessageCircle, page: '/messages' },
        { id: 'dashboard-wallet', label: 'Wallet', icon: Wallet, page: '/wallet' },
        { id: 'dashboard-favourites', label: 'Favourites', icon: Heart, page: '/favourites' },
        { id: 'dashboard-custom-service-forms', label: 'Custom Service Forms', icon: FileText, page: '/custom-service-forms' },
        { id: 'dashboard-settings', label: 'Settings', icon: Settings, page: '/settings' },
    ];

    const isActive = (path: string) => {
        return pathname === path;
    };

    return (
        <div className="min-h-screen bg-accent-10">
            {/* Header */}
            <Header />

            {/* Desktop Layout */}
            <div className="hidden lg:flex gap-6 mx-auto container px-4 md:px-6 lg:px-24 py-6 bg">
                {/* Left Sidebar */}
                <aside className="flex-shrink-0 w-[280px]">
                    <div className="sticky top-6 bg-white rounded-2xl shadow-lg p-4" style={{ boxShadow: '0 8px 24px rgba(0,0,0,0.06)' }}>
                        {/* User Card */}
                        <div className="pb-4 mb-4 border-b border-secondary-600">
                            <div className="flex items-center gap-3 mb-3">
                                <Avatar className="h-16 w-16">
                                    <AvatarFallback className="bg-primary-100 text-white text-xl font-semibold">
                                        AO
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <h3 className="text-base font-semibold text-secondary-000 mb-1">
                                        Amara Okonkwo
                                    </h3>
                                    <p className="text-xs text-secondary-100 opacity-70">
                                        amara@example.com
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Navigation */}
                        <nav className="space-y-1 mb-4">
                            {tabs.map((item) => {
                                const Icon = item.icon;
                                const active = isActive(item.page);

                                return (
                                    <Link
                                        key={item.id}
                                        href={item.page}
                                    >
                                        <Button
                                            variant="ghost"
                                            className={cn(
                                                "w-full justify-start gap-3 h-11 text-sm rounded-xl transition-colors duration-150 my-0.5",
                                                active
                                                    ? "bg-primary-300 text-primary-100 font-semibold"
                                                    : "bg-transparent text-secondary-000 font-normal hover:bg-primary-300"
                                            )}
                                        >
                                            <Icon
                                                className={cn(
                                                    "h-5 w-5",
                                                    active ? "text-primary-100" : "text-secondary-400"
                                                )}
                                                strokeWidth={active ? 2.5 : 2}
                                            />
                                            {item.label}
                                        </Button>
                                    </Link>
                                );
                            })}
                        </nav>

                        {/* Divider */}
                        <div className="border-t border-secondary-600 mb-4" />

                        {/* Secondary Items */}
                        <nav className="space-y-1 mb-4">
                            <Link href="/help-support">
                                <Button
                                    variant="ghost"
                                    className={cn(
                                        "w-full justify-start gap-3 h-11 text-sm rounded-xl transition-colors duration-150",
                                        isActive('/help-support')
                                            ? "bg-primary-300 text-primary-100 font-semibold"
                                            : "bg-transparent text-secondary-000 font-normal hover:bg-primary-300"
                                    )}
                                >
                                    <HelpCircle
                                        className={cn(
                                            "h-5 w-5",
                                            isActive('/help-support') ? "text-primary-100" : "text-secondary-400"
                                        )}
                                        strokeWidth={isActive('/help-support') ? 2.5 : 2}
                                    />
                                    Help & Support
                                </Button>
                            </Link>

                            <Button
                                variant="ghost"
                                className="w-full justify-start gap-3 h-11 text-sm text-secondary-000 rounded-xl transition-colors duration-150 hover:bg-primary-300"
                            >
                                <Download className="h-5 w-5 text-secondary-400" strokeWidth={2} />
                                Download the app
                            </Button>
                        </nav>

                        {/* Divider */}
                        <div className="border-t border-secondary-600 mb-4" />

                        {/* Logout */}
                        <Button
                            variant="ghost"
                            onClick={() => setLogoutModalOpen(true)}
                            className="w-full justify-start gap-3 h-11 text-[#9C2E2E] text-sm font-semibold rounded-xl transition-colors duration-150 hover:bg-red-50"
                        >
                            <LogOut className="h-5 w-5 text-[#9C2E2E]" strokeWidth={2} />
                            Log out
                        </Button>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 min-w-0">
                    {children}
                </main>
            </div>

            {/* Mobile Layout */}
            <main className="lg:hidden p-4" style={{ paddingBottom: 'calc(72px + env(safe-area-inset-bottom))' }}>
                {children}
            </main>

            {/* Logout Confirm Modal */}
            <LogoutConfirmModal
                open={logoutModalOpen}
                onOpenChange={setLogoutModalOpen}
                onConfirm={() => {
                    setLogoutModalOpen(false);
                    router.push('/');
                }}
            />
        </div>
    );
}
