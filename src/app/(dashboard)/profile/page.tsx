"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { User, Mail, Phone, MapPin, Calendar } from "lucide-react";

export default function ProfilePage() {
    // User data - replace with actual user data later
    const userInitials = "AO";
    const userName = "Amara Okonkwo";
    const userEmail = "amara@example.com";
    const userPhone = "+44 7700 900123";
    const userLocation = "London, UK";
    const joinDate = "January 2024";

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Page Header */}
            <div>
                <h1 className="text-2xl font-bold text-secondary-000">Profile</h1>
                <p className="text-accent-80 mt-1">Manage your account information and preferences</p>
            </div>
        </div>
    );
}

