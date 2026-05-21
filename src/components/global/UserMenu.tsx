"use client";

import { User, Calendar, Wallet, Heart, FileText, Settings, LogOut, MessageCircle } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useRouter, usePathname } from "next/navigation";
import type { UserMenuProps } from "@/types/ui";

// Map page identifiers to actual routes
const pageToRoute: Record<string, string> = {
    "dashboard-profile": "/profile",
    "dashboard-appointments": "/appointments",
    "dashboard-messages": "/messages",
    "dashboard-wallet": "/wallet",
    "dashboard-favourites": "/favourites",
    "dashboard-custom-orders": "/custom-orders",
    "dashboard-settings": "/settings",
};

export function UserMenu({
    onNavigate,
    currentPage,
    onLogout,
    userInitials = "AO",
    userName = "Amara Okonkwo",
    userEmail = "amara@example.com",
    profilePhoto,
}: UserMenuProps) {
    const router = useRouter();
    const pathname = usePathname();

    const menuItems = [
        { id: "dashboard-profile", label: "Profile", icon: User, page: "dashboard-profile" },
        {
            id: "dashboard-appointments",
            label: "Appointments",
            icon: Calendar,
            page: "dashboard-appointments",
        },
        {
            id: "dashboard-messages",
            label: "Messages",
            icon: MessageCircle,
            page: "dashboard-messages",
        },
        { id: "dashboard-wallet", label: "Wallet", icon: Wallet, page: "dashboard-wallet" },
        {
            id: "dashboard-favourites",
            label: "Favourites",
            icon: Heart,
            page: "dashboard-favourites",
        },
        {
            id: "dashboard-custom-orders",
            label: "Custom Orders",
            icon: FileText,
            page: "dashboard-custom-orders",
        },
        {
            id: "dashboard-settings",
            label: "Settings",
            icon: Settings,
            page: "dashboard-settings",
        },
    ];

    const handleNavigation = (page: string) => {
        const route = pageToRoute[page];
        if (route) {
            router.push(route);
            onNavigate?.(page);
        }
    };

    const isActive = (page: string) => {
        const route = pageToRoute[page];
        return route ? pathname === route : false;
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    className="h-10 w-10 rounded-full p-0 hover:opacity-90 bg-transparent cursor-pointer"
                >
                    <Avatar className="h-10 w-10">
                        <AvatarImage src={profilePhoto ?? undefined} alt={userName} />
                        <AvatarFallback className="bg-primary-100 text-white font-semibold font-unbounded text-base transition-all duration-200">
                            {userInitials}
                        </AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                align="end"
                sideOffset={12}
                alignOffset={-8}
                className="w-80 p-3 rounded-2xl bg-white border border-accent-20 shadow-lg focus:outline-none"
            >
                {/* User Header */}
                <div className="flex items-center gap-3 px-3 py-2 mb-1">
                    <Avatar className="h-12 w-12">
                        <AvatarImage src={profilePhoto ?? undefined} alt={userName} />
                        <AvatarFallback className="bg-primary-100 text-white font-semibold font-unbounded text-base">
                            {userInitials}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                        <p className="truncate text-secondary-000 font-semibold text-base leading-[1.4]">
                            {userName}
                        </p>
                        <p className="truncate text-secondary-100 text-xs opacity-70 leading-[1.4]">
                            {userEmail}
                        </p>
                    </div>
                </div>

                {/* Menu Items */}
                <div className="space-y-1">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const active = isActive(item.page);

                        return (
                            <DropdownMenuItem
                                key={item.id}
                                className={cn(
                                    "cursor-pointer px-3 h-11 rounded-xl transition-colors duration-150 outline-none border-none",
                                    active
                                        ? "bg-primary-300 text-secondary-000 focus:bg-primary-300"
                                        : "bg-transparent text-secondary-000 hover:bg-primary-300/50 focus:bg-primary-300/50"
                                )}
                                onSelect={() => handleNavigation(item.page)}
                            >
                                <Icon
                                    className={cn(
                                        "mr-3 shrink-0 size-5",
                                        active ? "text-primary-100" : "text-accent-80"
                                    )}
                                    strokeWidth={2}
                                />
                                <span
                                    className={cn(
                                        "text-base",
                                        active ? "font-semibold text-secondary-000" : "font-normal text-secondary-000"
                                    )}
                                >
                                    {item.label}
                                </span>
                            </DropdownMenuItem>
                        );
                    })}
                </div>

                <DropdownMenuSeparator className="my-2 bg-accent-20" />

                {/* Log Out */}
                <DropdownMenuItem
                    className="cursor-pointer px-3 h-11 rounded-xl bg-transparent text-secondary-000 hover:bg-primary-300/50 focus:bg-primary-300/50 transition-colors duration-150 outline-none border-none"
                    onSelect={() => {
                        console.log("Logging out...");
                        onLogout?.();
                    }}
                >
                    <LogOut className="mr-3 shrink-0 size-5 text-accent-80" strokeWidth={2} />
                    <span className="text-base font-normal text-secondary-000">Log Out</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

