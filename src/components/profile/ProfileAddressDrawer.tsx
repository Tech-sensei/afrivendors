"use client";

import { useEffect, useState } from "react";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import type {
    AddressLabel,
    ProfileAddress,
    ProfileAddressDrawerProps,
    ProfileAddressFormValues,
} from "@/types/profile";

/** Maximum saved addresses per account (enforced in UI and on save). */
export const MAX_PROFILE_ADDRESSES = 3;

const emptyForm = (): ProfileAddressFormValues => ({
    label: "Home",
    street: "",
    city: "",
    region: "",
});

export function ProfileAddressDrawer({
    isOpen,
    onClose,
    mode,
    address,
    isSubmitting = false,
    onSave,
}: ProfileAddressDrawerProps) {
    const [isMobile, setIsMobile] = useState(false);
    const [form, setForm] = useState<ProfileAddressFormValues>(emptyForm);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 640);
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    useEffect(() => {
        if (!isOpen) return;
        if (mode === "edit" && address) {
            setForm({
                label: address.label,
                street: address.street,
                city: address.city,
                region: address.region,
            });
        } else {
            setForm(emptyForm());
        }
    }, [isOpen, mode, address]);

    const handleOpenChange = (open: boolean) => {
        if (!open && !isSubmitting) onClose();
    };

    const handleSubmit = async () => {
        if (!form.street.trim() || !form.city.trim() || !form.region.trim()) {
            toast.error("Please fill in street, city, and state / region.");
            return;
        }
        try {
            await onSave(
                {
                    label: form.label,
                    street: form.street.trim(),
                    city: form.city.trim(),
                    region: form.region.trim(),
                },
                mode === "edit" && address ? address.id : null
            );
            onClose();
        } catch {
            // Mutations show error toasts; keep drawer open
        }
    };

    return (
        <Sheet open={isOpen} onOpenChange={handleOpenChange}>
            <SheetContent
                side={isMobile ? "bottom" : "right"}
                onPointerDownOutside={(e) => isSubmitting && e.preventDefault()}
                onEscapeKeyDown={(e) => isSubmitting && e.preventDefault()}
                className={cn(
                    "flex w-full flex-col border-0 p-0 sm:max-w-md",
                    isMobile
                        ? "max-h-[85vh] rounded-t-3xl"
                        : "h-full rounded-l-3xl rounded-tr-none"
                )}
            >
                <div className="flex-1 overflow-y-auto p-6">
                    <SheetHeader className="p-0">
                        <SheetTitle className="font-unbounded text-xl font-semibold text-secondary-000">
                            {mode === "add" ? "Add New Address" : "Edit Address"}
                        </SheetTitle>
                        <SheetDescription className="text-sm text-accent-80">
                            {mode === "add"
                                ? "Add a new address to your profile"
                                : "Update your address details"}
                        </SheetDescription>
                    </SheetHeader>

                    <div className="mt-6 space-y-6 px-0">
                        <div>
                            <Label className="mb-2 block text-sm font-semibold text-secondary-000">
                                Label <span className="text-primary-100">*</span>
                            </Label>
                            <Select
                                value={form.label}
                                onValueChange={(v) =>
                                    setForm((f) => ({ ...f, label: v as AddressLabel }))
                                }
                                disabled={isSubmitting}
                            >
                                <SelectTrigger className="h-12 w-full rounded-xl border-accent-20 text-sm">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Home">Home</SelectItem>
                                    <SelectItem value="Work">Work</SelectItem>
                                    <SelectItem value="Other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <Label
                                htmlFor="profile-addr-street"
                                className="mb-2 block text-sm font-semibold text-secondary-000"
                            >
                                Street Address <span className="text-primary-100">*</span>
                            </Label>
                            <Input
                                id="profile-addr-street"
                                value={form.street}
                                onChange={(e) =>
                                    setForm((f) => ({ ...f, street: e.target.value }))
                                }
                                placeholder="e.g. 123 Admiralty Way"
                                disabled={isSubmitting}
                                className="h-12 rounded-xl border-accent-20 text-sm"
                            />
                        </div>

                        <div>
                            <Label
                                htmlFor="profile-addr-city"
                                className="mb-2 block text-sm font-semibold text-secondary-000"
                            >
                                City <span className="text-primary-100">*</span>
                            </Label>
                            <Input
                                id="profile-addr-city"
                                value={form.city}
                                onChange={(e) =>
                                    setForm((f) => ({ ...f, city: e.target.value }))
                                }
                                placeholder="e.g. Lagos"
                                disabled={isSubmitting}
                                className="h-12 rounded-xl border-accent-20 text-sm"
                            />
                        </div>

                        <div>
                            <Label
                                htmlFor="profile-addr-region"
                                className="mb-2 block text-sm font-semibold text-secondary-000"
                            >
                                State / Region <span className="text-primary-100">*</span>
                            </Label>
                            <Input
                                id="profile-addr-region"
                                value={form.region}
                                onChange={(e) =>
                                    setForm((f) => ({ ...f, region: e.target.value }))
                                }
                                placeholder="e.g. Lagos State"
                                disabled={isSubmitting}
                                className="h-12 rounded-xl border-accent-20 text-sm"
                            />
                        </div>
                    </div>
                </div>

                <SheetFooter className="sticky bottom-0 z-10 flex-col gap-3 border-t border-accent-20 bg-white p-6 pt-4">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        disabled={isSubmitting}
                        className="h-12 w-full rounded-xl border-accent-20 text-sm font-semibold"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="h-12 w-full rounded-xl bg-primary-100 text-sm font-semibold text-white hover:bg-primary-100/90 disabled:opacity-70"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="mr-2 size-4 animate-spin" />
                                Saving…
                            </>
                        ) : (
                            "Save Address"
                        )}
                    </Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}
