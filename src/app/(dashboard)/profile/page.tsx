"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Camera, Pencil, Mail, Phone, MapPin, Calendar, Save } from "lucide-react";
import { toast } from "sonner";

export default function ProfilePage() {
    // User data - replace with actual user data later
    const userInitials = "A";
    const userName = "Amara Okafor";
    const memberSince = "November 2025";

    const [formData, setFormData] = useState({
        firstName: "Amara",
        lastName: "Okafor",
        email: "amara@example.com",
        phone: "+44 7700 900123",
        address: "123 Main Street",
        city: "London",
        postalCode: "SW1A 1AA",
        country: "United Kingdom",
        bio: "",
    });

    const [isEditing, setIsEditing] = useState(false);

    const handleInputChange = (field: string, value: string) => {
        setFormData({ ...formData, [field]: value });
    };

    const handleEditPhoto = () => {
        // TODO: Implement photo upload functionality
        toast.info("Photo upload feature coming soon");
    };

    const handleSave = () => {
        // TODO: Implement save functionality
        toast.success("Profile updated successfully!");
        setIsEditing(false);
    };

    const handleCancel = () => {
        // TODO: Reset form data to original values
        setIsEditing(false);
    };

    return (
        <div className="space-y-6">
            {/* Page Title */}
            <h1 className="mb-6 font-unbounded text-[28px] leading-8 font-semibold text-secondary-200">
                Profile
            </h1>

            {/* Profile Picture Card */}
            <Card className="rounded-2xl border border-accent-20 bg-white shadow-[0_8px_24px_rgba(35,19,5,0.06)] overflow-hidden">
                <CardContent className="p-6">
                    <div className="flex flex-col items-center">
                        {/* Profile Picture Section */}
                        <div className="relative mb-4">
                            <Avatar className="h-24 w-24">
                                <AvatarFallback className="bg-[#A06A42] text-white text-4xl font-semibold">
                                    {userInitials}
                                </AvatarFallback>
                            </Avatar>
                            {/* Camera Icon Overlay */}
                            <div className="absolute bottom-0 right-0 w-8 h-8 bg-secondary-000 rounded-full flex items-center justify-center border-2 border-white">
                                <Camera className="h-4 w-4 text-white" />
                            </div>
                        </div>

                        {/* Name */}
                        <h2 className="text-xl font-semibold text-secondary-000 mb-1">
                            {userName}
                        </h2>

                        {/* Member Since */}
                        <p className="text-xs text-accent-80 mb-4">
                            Member since {memberSince}
                        </p>

                        {/* Edit Photo Button */}
                        <Button
                            variant="outline"
                            onClick={handleEditPhoto}
                            size="sm"
                            className="rounded-xl border border-secondary-000 text-secondary-000 hover:bg-accent-10 h-9"
                        >
                            <Pencil className="h-3.5 w-3.5 mr-2" />
                            Edit Photo
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Personal Information */}
            <Card className="rounded-2xl border border-accent-20 bg-white shadow-[0_8px_24px_rgba(35,19,5,0.06)]">
                <CardHeader>
                    <CardTitle className="text-lg font-semibold text-secondary-000">
                        Personal Information
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="firstName" className="block mb-2 text-sm font-semibold text-secondary-000">
                                First Name
                            </Label>
                            <Input
                                id="firstName"
                                value={formData.firstName}
                                onChange={(e) => handleInputChange("firstName", e.target.value)}
                                disabled={!isEditing}
                                className="h-12 rounded-xl border-accent-20 text-sm disabled:bg-accent-10"
                            />
                        </div>
                        <div>
                            <Label htmlFor="lastName" className="block mb-2 text-sm font-semibold text-secondary-000">
                                Last Name
                            </Label>
                            <Input
                                id="lastName"
                                value={formData.lastName}
                                onChange={(e) => handleInputChange("lastName", e.target.value)}
                                disabled={!isEditing}
                                className="h-12 rounded-xl border-accent-20 text-sm disabled:bg-accent-10"
                            />
                        </div>
                    </div>
                    <div>
                        <Label htmlFor="email" className="block mb-2 text-sm font-semibold text-secondary-000">
                            Email Address
                        </Label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-accent-60" />
                            <Input
                                id="email"
                                type="email"
                                value={formData.email}
                                onChange={(e) => handleInputChange("email", e.target.value)}
                                disabled={!isEditing}
                                className="h-12 pl-10 rounded-xl border-accent-20 text-sm disabled:bg-accent-10"
                            />
                        </div>
                    </div>
                    <div>
                        <Label htmlFor="phone" className="block mb-2 text-sm font-semibold text-secondary-000">
                            Phone Number
                        </Label>
                        <div className="relative">
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-accent-60" />
                            <Input
                                id="phone"
                                type="tel"
                                value={formData.phone}
                                onChange={(e) => handleInputChange("phone", e.target.value)}
                                disabled={!isEditing}
                                className="h-12 pl-10 rounded-xl border-accent-20 text-sm disabled:bg-accent-10"
                            />
                        </div>
                    </div>
                    <div>
                        <Label htmlFor="bio" className="block mb-2 text-sm font-semibold text-secondary-000">
                            Bio (Optional)
                        </Label>
                        <Textarea
                            id="bio"
                            value={formData.bio}
                            onChange={(e) => handleInputChange("bio", e.target.value)}
                            disabled={!isEditing}
                            placeholder="Tell us about yourself..."
                            rows={4}
                            className="rounded-xl border-accent-20 text-sm disabled:bg-accent-10"
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Address Information */}
            <Card className="rounded-2xl border border-accent-20 bg-white shadow-[0_8px_24px_rgba(35,19,5,0.06)]">
                <CardHeader>
                    <CardTitle className="text-lg font-semibold text-secondary-000">
                        Address Information
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <Label htmlFor="address" className="block mb-2 text-sm font-semibold text-secondary-000">
                            Street Address
                        </Label>
                        <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-accent-60" />
                            <Input
                                id="address"
                                value={formData.address}
                                onChange={(e) => handleInputChange("address", e.target.value)}
                                disabled={!isEditing}
                                className="h-12 pl-10 rounded-xl border-accent-20 text-sm disabled:bg-accent-10"
                            />
                        </div>
                    </div>
                    <div className="grid md:grid-cols-3 gap-4">
                        <div>
                            <Label htmlFor="city" className="block mb-2 text-sm font-semibold text-secondary-000">
                                City
                            </Label>
                            <Input
                                id="city"
                                value={formData.city}
                                onChange={(e) => handleInputChange("city", e.target.value)}
                                disabled={!isEditing}
                                className="h-12 rounded-xl border-accent-20 text-sm disabled:bg-accent-10"
                            />
                        </div>
                        <div>
                            <Label htmlFor="postalCode" className="block mb-2 text-sm font-semibold text-secondary-000">
                                Postal Code
                            </Label>
                            <Input
                                id="postalCode"
                                value={formData.postalCode}
                                onChange={(e) => handleInputChange("postalCode", e.target.value)}
                                disabled={!isEditing}
                                className="h-12 rounded-xl border-accent-20 text-sm disabled:bg-accent-10"
                            />
                        </div>
                        <div>
                            <Label htmlFor="country" className="block mb-2 text-sm font-semibold text-secondary-000">
                                Country
                            </Label>
                            <Input
                                id="country"
                                value={formData.country}
                                onChange={(e) => handleInputChange("country", e.target.value)}
                                disabled={!isEditing}
                                className="h-12 rounded-xl border-accent-20 text-sm disabled:bg-accent-10"
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Account Information */}
            <Card className="rounded-2xl border border-accent-20 bg-white shadow-[0_8px_24px_rgba(35,19,5,0.06)]">
                <CardHeader>
                    <CardTitle className="text-lg font-semibold text-secondary-000">
                        Account Information
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center gap-3 p-4 rounded-xl bg-accent-10">
                        <Calendar className="h-5 w-5 text-accent-60" />
                        <div>
                            <p className="text-sm font-semibold text-secondary-000">Member Since</p>
                            <p className="text-sm text-accent-80">{memberSince}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-end">
                {!isEditing ? (
                    <Button
                        onClick={() => setIsEditing(true)}
                        className="h-12 px-8 bg-primary-100 text-white hover:bg-primary-100/90 rounded-xl text-sm font-semibold"
                    >
                        <Pencil className="h-4 w-4 mr-2" />
                        Edit Profile
                    </Button>
                ) : (
                    <>
                        <Button
                            variant="outline"
                            onClick={handleCancel}
                            className="h-12 px-8 rounded-xl border-accent-20 text-secondary-000 hover:bg-accent-10 text-sm font-semibold"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSave}
                            className="h-12 px-8 bg-primary-100 text-white hover:bg-primary-100/90 rounded-xl text-sm font-semibold"
                        >
                            <Save className="h-4 w-4 mr-2" />
                            Save Changes
                        </Button>
                    </>
                )}
            </div>
        </div>
    );
}
