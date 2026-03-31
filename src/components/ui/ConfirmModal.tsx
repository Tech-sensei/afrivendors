"use client";

import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, type LucideIcon } from "lucide-react";
import type { ConfirmModalProps } from "@/types/ui";

export function ConfirmModal({
    open,
    onOpenChange,
    onConfirm,
    title,
    description,
    confirmText = "Confirm",
    cancelText = "Cancel",
    icon: Icon,
    iconColor = "text-primary-100",
    iconBg = "bg-primary-100/10",
    confirmButtonVariant = "default",
}: ConfirmModalProps) {
    const [isPending, setIsPending] = useState(false);

    const handleConfirm = async () => {
        setIsPending(true);
        try {
            await onConfirm();
            onOpenChange(false);
        } catch {
            // Caller / mutation surfaces errors (e.g. toast)
        } finally {
            setIsPending(false);
        }
    };

    return (
        <Dialog
            open={open}
            onOpenChange={(next) => {
                if (isPending && !next) return;
                onOpenChange(next);
            }}
        >
            <DialogContent
                className="max-w-[calc(100%-2rem)] rounded-3xl border border-accent-20 bg-white p-4 sm:max-w-[440px] sm:p-8"
                onPointerDownOutside={(e) => isPending && e.preventDefault()}
                onEscapeKeyDown={(e) => isPending && e.preventDefault()}
            >
                <DialogHeader>
                    {Icon && (
                        <div
                            className={`mx-auto mb-4 flex size-14 items-center justify-center rounded-full ${iconBg}`}
                        >
                            <Icon className={`size-7 ${iconColor}`} strokeWidth={2} />
                        </div>
                    )}
                    <DialogTitle className="mb-2 text-center text-2xl leading-[1.3] font-semibold text-secondary-000">
                        {title}
                    </DialogTitle>
                    <DialogDescription className="text-center text-base leading-6 text-accent-80">
                        {description}
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="mt-6 flex-col gap-3 sm:flex-col">
                    <Button
                        onClick={handleConfirm}
                        disabled={isPending}
                        variant={confirmButtonVariant}
                        className={`h-12 w-full cursor-pointer rounded-full border-none text-base font-semibold ${
                            confirmButtonVariant === "destructive"
                                ? "bg-red-600 text-white hover:bg-red-700"
                                : "bg-primary-100 text-white hover:bg-primary-100/90"
                        } disabled:opacity-70`}
                    >
                        {isPending ? (
                            <>
                                <Loader2 className="mr-2 size-4 animate-spin" />
                                Please wait…
                            </>
                        ) : (
                            confirmText
                        )}
                    </Button>
                    <Button
                        variant="outline"
                        disabled={isPending}
                        onClick={() => onOpenChange(false)}
                        className="h-12 w-full cursor-pointer rounded-full border-2 border-accent-20 bg-transparent text-base font-semibold text-secondary-000 hover:bg-accent-10"
                    >
                        {cancelText}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
