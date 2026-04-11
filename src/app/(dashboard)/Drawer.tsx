"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
    SheetFooter,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import type { DrawerProps } from "@/types/ui";

export function Drawer({
    open,
    onOpenChange,
    title,
    description,
    size = "md",
    type = "default",
    footer,
    children,
}: DrawerProps) {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 640);
        };

        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    const sizeClasses = {
        sm: "sm:max-w-sm",
        md: "sm:max-w-md",
        lg: "sm:max-w-lg",
    };

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent
                side={isMobile ? "bottom" : "right"}
                className={cn(
                    "flex flex-col p-0 w-full",
                    sizeClasses[size],
                    type === "message" && "sm:max-w-md",
                    isMobile
                        ? "rounded-t-3xl max-h-[85vh] border-0"
                        : "rounded-l-3xl rounded-tr-none h-full"
                )}
            >
                {(title || description) && (
                    <SheetHeader className="px-6 pt-6 pb-4 border-b">
                        {title && (
                            <SheetTitle className="text-xl font-semibold text-secondary-000">
                                {title}
                            </SheetTitle>
                        )}
                        {description && (
                            <SheetDescription className="text-sm text-accent-80">
                                {description}
                            </SheetDescription>
                        )}
                    </SheetHeader>
                )}
                <div className="flex-1 overflow-y-auto px-6 py-4">
                    {children}
                </div>
                {footer && (
                    <div className="px-6 py-4 border-t border-accent-20 mt-auto">
                        {footer}
                    </div>
                )}
            </SheetContent>
        </Sheet>
    );
}

export function DrawerSection({
    children,
    className,
    title,
}: {
    children: React.ReactNode;
    className?: string;
    title?: string;
}) {
    return (
        <div className={cn("w-full mb-8 last:mb-0", className)}>
            {title ? (
                <h3 className="font-unbounded text-base font-semibold text-secondary-000 mb-4">
                    {title}
                </h3>
            ) : null}
            {children}
        </div>
    );
}
