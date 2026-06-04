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
import { profileAddressFormSchema, zodFieldErrors } from "@/lib/validations";
import { Loader2 } from "lucide-react";
import type {
    AddressLabel,
    ProfileAddress,
    ProfileAddressDrawerProps,
    ProfileAddressFormValues,
} from "@/types/profile";
import { PostalCodeAutocomplete } from "@/components/ui/PostalCodeAutocomplete";

/** Maximum saved addresses per account (enforced in UI and on save). */
export const MAX_PROFILE_ADDRESSES = 3;

const emptyForm = (): ProfileAddressFormValues => ({
    label: "Home",
    street: "",
    city: "",
    region: "",
    postCode: "",
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
    const [errors, setErrors] = useState<
        Partial<Record<keyof ProfileAddressFormValues, string>>
    >({});

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
                postCode: address.postCode,
            });
        } else {
            setForm(emptyForm());
        }
        setErrors({});
    }, [isOpen, mode, address]);

    const handleOpenChange = (open: boolean) => {
        if (!open && !isSubmitting) onClose();
    };

    const patchForm = (patch: Partial<ProfileAddressFormValues>) => {
        setForm((f) => ({ ...f, ...patch }));
        setErrors((prev) => {
            const next = { ...prev };
            for (const key of Object.keys(patch) as (keyof ProfileAddressFormValues)[]) {
                delete next[key];
            }
            return next;
        });
    };

    const handleSubmit = async () => {
        const result = profileAddressFormSchema.safeParse(form);
        if (!result.success) {
            setErrors(zodFieldErrors(result.error));
            return;
        }
        setErrors({});
        try {
            await onSave(
                result.data,
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
                                Post code <span className="text-primary-100">*</span>
                            </Label>
                            <PostalCodeAutocomplete
                                value={form.postCode}
                                onChange={(val) => patchForm({ postCode: val })}
                                onAddressSelect={(addr) =>
                                    patchForm({
                                        street: addr.street || form.street,
                                        city: addr.city,
                                        region: addr.state,
                                        postCode: addr.postalCode,
                                    })
                                }
                                disabled={isSubmitting}
                                error={errors.postCode}
                                placeholder="Type post code to auto-fill address"
                                inputClassName={`h-12 w-full rounded-xl border bg-white px-3 text-sm outline-none transition-colors focus:border-primary-100 disabled:opacity-50 ${
                                    errors.postCode ? "border-red-500" : "border-accent-20"
                                }`}
                            />
                            {errors.postCode && (
                                <p className="mt-1 text-sm text-red-600">{errors.postCode}</p>
                            )}
                        </div>

                        <div>
                            <Label className="mb-2 block text-sm font-semibold text-secondary-000">
                                Label <span className="text-primary-100">*</span>
                            </Label>
                            <Select
                                value={form.label}
                                onValueChange={(v) =>
                                    patchForm({ label: v as AddressLabel })
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
                                onChange={(e) => patchForm({ street: e.target.value })}
                                placeholder="e.g. 123 Admiralty Way"
                                disabled={isSubmitting}
                                className={`h-12 rounded-xl text-sm ${errors.street ? "border-red-500" : "border-accent-20"}`}
                            />
                            {errors.street && (
                                <p className="mt-1 text-sm text-red-600">{errors.street}</p>
                            )}
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
                                onChange={(e) => patchForm({ city: e.target.value })}
                                placeholder="e.g. Lagos"
                                disabled={isSubmitting}
                                className={`h-12 rounded-xl text-sm ${errors.city ? "border-red-500" : "border-accent-20"}`}
                            />
                            {errors.city && (
                                <p className="mt-1 text-sm text-red-600">{errors.city}</p>
                            )}
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
                                onChange={(e) => patchForm({ region: e.target.value })}
                                placeholder="e.g. Lagos State"
                                disabled={isSubmitting}
                                className={`h-12 rounded-xl text-sm ${errors.region ? "border-red-500" : "border-accent-20"}`}
                            />
                            {errors.region && (
                                <p className="mt-1 text-sm text-red-600">{errors.region}</p>
                            )}
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
