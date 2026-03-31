"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
    ProfileAddressDrawer,
    MAX_PROFILE_ADDRESSES,
    type AddressLabel,
    type ProfileAddress,
    type ProfileAddressFormValues,
} from "@/components/profile/ProfileAddressDrawer";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useAppSelector } from "@/store/hooks";
import { useProfileAPI, profileLabelToApi } from "@/services/useProfileAPI";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import {
    Building2,
    Camera,
    Home,
    MapPinned,
    Pen,
    Plus,
    SquarePen,
    Tag,
    Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const initialPersonal = {
    firstName: "Amara",
    lastName: "Okafor",
    email: "amara.okafor@example.com",
    phone: "+234 123 456 7890",
    dateOfBirth: "03/15/1995",
    gender: "Female",
};

function formatAddressLine(a: ProfileAddress) {
    return [a.street, a.city, a.country].filter(Boolean).join(", ");
}

function mapApiEntryToProfile(entry: unknown): ProfileAddress | null {
    if (!entry || typeof entry !== "object") return null;
    const o = entry as Record<string, unknown>;
    if (o.id == null) return null;
    const rawLabel = String(o.label ?? o.type ?? "Other").toLowerCase();
    const label: AddressLabel =
        rawLabel === "home" ? "Home" : rawLabel === "work" ? "Work" : "Other";
    return {
        id: String(o.id),
        label,
        street: String(o.street ?? o.streetAddress ?? o.line1 ?? ""),
        city: String(o.city ?? ""),
        region: String(o.region ?? o.state ?? o.stateOrRegion ?? ""),
        country: String(o.country ?? ""),
        isDefault: Boolean(o.isDefault ?? o.is_default ?? o.default),
    };
}

// Convert MM/DD/YYYY (state) → YYYY-MM-DD (input type="date")
function formatDateForInput(mmddyyyy: string): string {
    if (!mmddyyyy) return "";
    const parts = mmddyyyy.split("/");
    if (parts.length !== 3) return "";
    const [mm, dd, yyyy] = parts;
    return `${yyyy}-${mm.padStart(2, "0")}-${dd.padStart(2, "0")}`;
}

// Convert YYYY-MM-DD (input) → MM/DD/YYYY (state)
function formatDateFromInput(yyyymmdd: string): string {
    if (!yyyymmdd) return "";
    const parts = yyyymmdd.split("-");
    if (parts.length !== 3) return "";
    const [yyyy, mm, dd] = parts;
    return `${mm}/${dd}/${yyyy}`;
}

// Convert MM/DD/YYYY (form) → YYYY-MM-DD (API)
function parseDobToISO(mmddyyyy: string): string | null {
    if (!mmddyyyy) return null;
    const parts = mmddyyyy.split("/");
    if (parts.length !== 3) return null;
    const [mm, dd, yyyy] = parts;
    if (!mm || !dd || !yyyy || yyyy.length !== 4) return null;
    return `${yyyy}-${mm.padStart(2, "0")}-${dd.padStart(2, "0")}`;
}

const MAX_AVATAR_BYTES = 5 * 1024 * 1024;

export default function ProfilePage() {
    const authUser = useAppSelector((s) => s.auth.user);
    const {
        updateProfileAsync,
        isUpdatingProfile,
        addAddressAsync,
        updateAddressAsync,
        deleteAddressAsync,
        isAddingAddress,
        isUpdatingAddress,
        uploadPhotoAsync,
        isUploadingPhoto,
    } = useProfileAPI();

    const userInitials = authUser
        ? `${authUser.firstName?.[0] ?? ""}${authUser.lastName?.[0] ?? ""}`.toUpperCase() || "?"
        : "A";
    const userName = authUser
        ? `${authUser.firstName ?? ""} ${authUser.lastName ?? ""}`.trim() || "Member"
        : "Amara Okafor";
    const memberSince = authUser?.createdAt
        ? new Date(String(authUser.createdAt)).toLocaleString("default", {
              month: "long",
              year: "numeric",
          })
        : "November 2025";

    const [personal, setPersonal] = useState(initialPersonal);
    const [personalBaseline, setPersonalBaseline] = useState(initialPersonal);
    const [addresses, setAddresses] = useState<ProfileAddress[]>([]);

    const [addressDrawerOpen, setAddressDrawerOpen] = useState(false);
    const [addressDrawerMode, setAddressDrawerMode] = useState<"add" | "edit">("add");
    const [editingAddress, setEditingAddress] = useState<ProfileAddress | null>(null);
    const [addressPendingDelete, setAddressPendingDelete] = useState<ProfileAddress | null>(null);

    const photoInputRef = useRef<HTMLInputElement>(null);
    const avatarObjectUrlRef = useRef<string | null>(null);
    const [avatarPreviewUrl, setAvatarPreviewUrl] = useState<string | null>(null);

    useEffect(() => {
        return () => {
            if (avatarObjectUrlRef.current) {
                URL.revokeObjectURL(avatarObjectUrlRef.current);
            }
        };
    }, []);

    useEffect(() => {
        if (!authUser?.id) {
            setAddresses([]);
            return;
        }
        const raw = authUser.addresses;
        if (!Array.isArray(raw) || raw.length === 0) {
            setAddresses([]);
            return;
        }
        const mapped = raw
            .map(mapApiEntryToProfile)
            .filter((a): a is ProfileAddress => a != null)
            .slice(0, MAX_PROFILE_ADDRESSES);
        setAddresses(mapped);
    }, [authUser?.id, authUser?.updatedAt, authUser?.addresses]);

    useEffect(() => {
        if (!authUser) return;
        const u = authUser as Record<string, unknown>;
        const phoneObj = u.phoneNumber as { code?: string; number?: string } | undefined;
        const phone = phoneObj
            ? `${phoneObj.code ?? ""} ${phoneObj.number ?? ""}`.trim()
            : "";
        const dobRaw = u.dob;
        let dateOfBirth = "";
        if (typeof dobRaw === "string" && dobRaw) {
            // Split directly to avoid timezone offset shifting the date
            const parts = dobRaw.split("T")[0].split("-"); // handles "2000-01-01" or "2000-01-01T00:00:00Z"
            if (parts.length === 3) {
                const [yyyy, mm, dd] = parts;
                dateOfBirth = `${mm}/${dd}/${yyyy}`;
            }
        }
        const next = {
            firstName: String(authUser.firstName ?? ""),
            lastName: String(authUser.lastName ?? ""),
            email: String(authUser.email ?? ""),
            phone,
            dateOfBirth,
            gender:
                u.gender != null && String(u.gender) !== ""
                    ? String(u.gender).charAt(0).toUpperCase() + String(u.gender).slice(1)
                    : "",
        };
        setPersonal(next);
        setPersonalBaseline(next);
    }, [authUser?.id, authUser?.updatedAt]);

    const openPhotoPicker = () => photoInputRef.current?.click();

    const handlePhotoSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        e.target.value = "";
        if (!file) return;
        if (!file.type.startsWith("image/")) {
            toast.error("Please choose an image file.");
            return;
        }
        if (file.size > MAX_AVATAR_BYTES) {
            toast.error("Image must be 5MB or smaller.");
            return;
        }
        // Show local preview immediately while uploading
        if (avatarObjectUrlRef.current) URL.revokeObjectURL(avatarObjectUrlRef.current);
        const previewUrl = URL.createObjectURL(file);
        avatarObjectUrlRef.current = previewUrl;
        setAvatarPreviewUrl(previewUrl);

        try {
            await uploadPhotoAsync(file);
            // Clear local preview — fetchUserProfile (called inside uploadPhotoAsync) returns the real Cloudinary URL
            setAvatarPreviewUrl(null);
            if (avatarObjectUrlRef.current) {
                URL.revokeObjectURL(avatarObjectUrlRef.current);
                avatarObjectUrlRef.current = null;
            }
        } catch {
            // Error toast handled by useProfileAPI; keep preview on screen
        }
    };

    const inputClass =
        "!h-11 w-full rounded-xl border-accent-20 text-sm text-secondary-000 placeholder:text-accent-60 focus-visible:ring-primary-100/30";

    const openAddAddress = () => {
        if (addresses.length >= MAX_PROFILE_ADDRESSES) {
            toast.error(`You can save up to ${MAX_PROFILE_ADDRESSES} addresses.`);
            return;
        }
        setAddressDrawerMode("add");
        setEditingAddress(null);
        setAddressDrawerOpen(true);
    };

    const openEditAddress = (a: ProfileAddress) => {
        setAddressDrawerMode("edit");
        setEditingAddress(a);
        setAddressDrawerOpen(true);
    };

    const closeAddressDrawer = () => {
        setAddressDrawerOpen(false);
        setEditingAddress(null);
    };

    const handleSaveAddress = async (
        values: ProfileAddressFormValues,
        editingId: string | null
    ) => {
        const payload = {
            label: profileLabelToApi(values.label),
            streetAddress: values.street.trim(),
            city: values.city.trim(),
            state: values.region.trim(),
        };
        if (editingId === null) {
            if (addresses.length >= MAX_PROFILE_ADDRESSES) {
                toast.error(`You can save up to ${MAX_PROFILE_ADDRESSES} addresses.`);
                return;
            }
            await addAddressAsync(payload);
            return;
        }
        await updateAddressAsync({ id: editingId, payload });
    };

    const handleConfirmDeleteAddress = async () => {
        if (!addressPendingDelete) return;
        await deleteAddressAsync(addressPendingDelete.id);
    };

    const updatePersonal = (field: keyof typeof personal, value: string) => {
        if (field === "email") return;
        setPersonal((p) => ({ ...p, [field]: value }));
    };

    const handleSavePersonal = async () => {
        try {
            await updateProfileAsync({
                firstName: personal.firstName,
                lastName: personal.lastName,
                dob: parseDobToISO(personal.dateOfBirth),
                gender: personal.gender ? personal.gender.toLowerCase() : null,
            });
            setPersonalBaseline(personal);
        } catch {
            // error toast is handled by useProfileAPI
        }
    };

    const handleCancelPersonal = () => {
        setPersonal(personalBaseline);
    };

    const sortedAddresses = useMemo(
        () => [...addresses].sort((a, b) => Number(b.isDefault) - Number(a.isDefault)),
        [addresses]
    );

    return (
        <div className="space-y-6">
            <h1 className="font-unbounded text-[28px] font-semibold leading-8 text-secondary-200 md:text-[32px] md:leading-9">
                Profile
            </h1>

            <input
                id="profile-photo-input"
                ref={photoInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                className="sr-only"
                tabIndex={-1}
                aria-label="Choose profile photo"
                onChange={handlePhotoSelected}
            />

            <div className="grid gap-6 lg:grid-cols-2 lg:items-start">
                <Card className="overflow-hidden rounded-2xl border border-accent-20 bg-white shadow-[0_8px_24px_rgba(35,19,5,0.06)]">
                    <CardContent className="flex flex-col items-center p-6 md:p-8">
                        <div className="relative mb-4">
                            <Avatar className="h-28 w-28 md:h-32 md:w-32">
                                <AvatarImage
                                    src={avatarPreviewUrl ?? authUser?.profilePhoto ?? undefined}
                                    alt={`${userName} profile photo`}
                                />
                                <AvatarFallback className="bg-primary-100 text-4xl font-semibold text-white md:text-5xl">
                                    {userInitials}
                                </AvatarFallback>
                            </Avatar>
                            <button
                                type="button"
                                onClick={openPhotoPicker}
                                className="absolute right-0 bottom-0 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border-2 border-white bg-secondary-200 transition-opacity hover:opacity-90"
                                aria-label="Upload profile photo"
                            >
                                <Camera className="h-4 w-4 text-white" />
                            </button>
                        </div>
                        <h2 className="mb-1 text-center text-xl font-semibold text-secondary-000">
                            {userName}
                        </h2>
                        <p className="mb-5 text-center text-sm text-accent-80">
                            Member since {memberSince}
                        </p>
                        <Button
                            variant="outline"
                            size="sm"
                            type="button"
                            onClick={openPhotoPicker}
                            disabled={isUploadingPhoto}
                            className="h-9 rounded-lg border-secondary-200 text-secondary-200 hover:bg-primary-300 disabled:opacity-70"
                        >
                            <Pen className="mr-2 h-3.5 w-3.5" />
                            {isUploadingPhoto ? "Uploading..." : "Edit Photo"}
                        </Button>
                    </CardContent>
                </Card>

                <Card className="rounded-2xl border border-accent-20 bg-white shadow-[0_8px_24px_rgba(35,19,5,0.06)] lg:sticky lg:top-6">
                    <CardHeader className="flex flex-row items-start justify-between gap-3 space-y-0 pb-4">
                        <div className="min-w-0">
                            <CardTitle className="text-lg font-semibold text-secondary-000">
                                My Addresses
                            </CardTitle>
                            <p className="mt-1 text-xs text-accent-80">
                                {addresses.length} of {MAX_PROFILE_ADDRESSES} saved
                            </p>
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={openAddAddress}
                            disabled={addresses.length >= MAX_PROFILE_ADDRESSES}
                            className="h-9 shrink-0 gap-1 rounded-lg border-secondary-200 text-secondary-200 hover:bg-primary-300 disabled:pointer-events-none disabled:opacity-50"
                        >
                            <Plus className="h-4 w-4" />
                            Add
                        </Button>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-3 pb-6">
                        {sortedAddresses.length === 0 ? (
                            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-accent-20 bg-secondary-800/30 px-4 py-10 text-center">
                                <MapPinned
                                    className="mb-3 h-10 w-10 text-accent-60"
                                    strokeWidth={1.5}
                                />
                                <p className="text-sm font-semibold text-secondary-000">
                                    No addresses yet
                                </p>
                                <p className="mt-1 max-w-[240px] text-xs leading-relaxed text-accent-80">
                                    Add up to {MAX_PROFILE_ADDRESSES} addresses for deliveries and
                                    bookings.
                                </p>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={openAddAddress}
                                    disabled={addresses.length >= MAX_PROFILE_ADDRESSES}
                                    className="mt-5 h-9 rounded-lg border-secondary-200 text-secondary-200 hover:bg-primary-300 disabled:opacity-50"
                                >
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add address
                                </Button>
                            </div>
                        ) : (
                        sortedAddresses.map((addr) => (
                            <div
                                key={addr.id}
                                className={cn(
                                    "flex gap-3 rounded-xl border p-4 transition-colors",
                                    addr.isDefault
                                        ? "border-transparent bg-primary-300/80"
                                        : "border-accent-20 bg-white"
                                )}
                            >
                                <div
                                    className={cn(
                                        "flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
                                        addr.isDefault
                                            ? "bg-primary-100 text-white"
                                            : "bg-secondary-800 text-accent-60"
                                    )}
                                >
                                    {addr.label === "Work" ? (
                                        <Building2 className="h-5 w-5" strokeWidth={2} />
                                    ) : addr.label === "Home" ? (
                                        <Home className="h-5 w-5" strokeWidth={2} />
                                    ) : (
                                        <Tag className="h-5 w-5" strokeWidth={2} />
                                    )}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className="mb-1 flex flex-wrap items-center gap-2">
                                        <span className="text-sm font-semibold text-secondary-000">
                                            {addr.label}
                                        </span>
                                        {addr.isDefault && (
                                            <Badge
                                                variant="outline"
                                                className="border-0 bg-white/70 px-2 py-0 text-[11px] font-medium text-accent-80"
                                            >
                                                Default
                                            </Badge>
                                        )}
                                    </div>
                                    <p className="text-sm leading-snug text-accent-80">
                                        {formatAddressLine(addr)}
                                    </p>
                                </div>
                                <div className="flex shrink-0 items-center gap-0.5">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="h-9 w-9 text-primary-100 hover:bg-primary-300/60"
                                        onClick={() => openEditAddress(addr)}
                                        aria-label={`Edit ${addr.label} address`}
                                    >
                                        <SquarePen className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="h-9 w-9 text-accent-80 hover:bg-red-50 hover:text-red-600"
                                        onClick={() => setAddressPendingDelete(addr)}
                                        aria-label={`Delete ${addr.label} address`}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        ))
                        )}
                    </CardContent>
                </Card>
            </div>

            <div className="flex min-w-0 flex-col gap-6">
                <Card className="rounded-2xl border border-accent-20 bg-white shadow-[0_8px_24px_rgba(35,19,5,0.06)]">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-lg font-semibold text-secondary-000">
                            Personal Information
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 pb-6">
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="firstName" className="text-xs font-semibold text-secondary-000">
                                    First Name
                                </Label>
                                <Input
                                    id="firstName"
                                    value={personal.firstName}
                                    onChange={(e) => updatePersonal("firstName", e.target.value)}
                                    className={inputClass}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="lastName" className="text-xs font-semibold text-secondary-000">
                                    Last Name
                                </Label>
                                <Input
                                    id="lastName"
                                    value={personal.lastName}
                                    onChange={(e) => updatePersonal("lastName", e.target.value)}
                                    className={inputClass}
                                />
                            </div>
                        </div>
                        <div className="space-y-2 sm:col-span-2">
                            <Label htmlFor="email" className="text-xs font-semibold text-secondary-000">
                                Email Address
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                readOnly
                                value={personal.email}
                                aria-readonly="true"
                                className={cn(
                                    inputClass,
                                    "cursor-default bg-accent-10 text-accent-80 focus-visible:ring-0"
                                )}
                            />
                        </div>
                        <div className="space-y-2 sm:col-span-2">
                            <Label htmlFor="phone" className="text-xs font-semibold text-secondary-000">
                                Phone Number
                            </Label>
                            <Input
                                id="phone"
                                type="tel"
                                readOnly
                                value={personal.phone}
                                aria-readonly="true"
                                className={cn(
                                    inputClass,
                                    "cursor-default bg-accent-10 text-accent-80 focus-visible:ring-0"
                                )}
                            />
                        </div>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="dob" className="text-xs font-semibold text-secondary-000">
                                    Date of Birth
                                </Label>
                                <Input
                                    id="dob"
                                    type="date"
                                    value={formatDateForInput(personal.dateOfBirth)}
                                    onChange={(e) => updatePersonal("dateOfBirth", formatDateFromInput(e.target.value))}
                                    className={inputClass}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="gender" className="text-xs font-semibold text-secondary-000">
                                    Gender
                                </Label>
                                <Select
                                    value={personal.gender}
                                    onValueChange={(v) => updatePersonal("gender", v)}
                                >
                                    <SelectTrigger className={inputClass}>
                                        <SelectValue placeholder="Select gender" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Male">Male</SelectItem>
                                        <SelectItem value="Female">Female</SelectItem>
                                        <SelectItem value="Other">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="flex flex-col gap-3 sm:flex-row">
                    <Button
                        onClick={handleSavePersonal}
                        disabled={isUpdatingProfile}
                        className="h-11 rounded-lg bg-primary-100 px-8 text-sm font-semibold text-white hover:bg-primary-100/90 disabled:opacity-70"
                    >
                        {isUpdatingProfile ? "Saving..." : "Save Changes"}
                    </Button>
                    <Button
                        variant="outline"
                        onClick={handleCancelPersonal}
                        disabled={isUpdatingProfile}
                        className="h-11 rounded-lg border-secondary-200 px-8 text-sm font-semibold text-secondary-000 hover:bg-primary-300"
                    >
                        Cancel
                    </Button>
                </div>
            </div>

            <ProfileAddressDrawer
                isOpen={addressDrawerOpen}
                onClose={closeAddressDrawer}
                mode={addressDrawerMode}
                address={addressDrawerMode === "edit" ? editingAddress : null}
                isSubmitting={isAddingAddress || isUpdatingAddress}
                onSave={handleSaveAddress}
            />

            <ConfirmModal
                open={!!addressPendingDelete}
                onOpenChange={(open) => !open && setAddressPendingDelete(null)}
                onConfirm={handleConfirmDeleteAddress}
                title="Remove this address?"
                description={
                    addressPendingDelete
                        ? `This will permanently delete your ${addressPendingDelete.label} address: ${formatAddressLine(addressPendingDelete)}.`
                        : ""
                }
                confirmText="Yes, remove"
                cancelText="Cancel"
                icon={Trash2}
                iconColor="text-red-600"
                iconBg="bg-red-50"
                confirmButtonVariant="destructive"
            />
        </div>
    );
}
