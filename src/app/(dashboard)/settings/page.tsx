"use client";

import { AccountSettings } from '@/components/settings/AccountSettings';
import { SecuritySettings } from '@/components/settings/SecuritySettings';
import { NotificationPreferences } from '@/components/settings/NotificationPreferences';

export default function SettingsPage() {
    return (
        <div className="space-y-6">
            {/* Page Title */}
            <h1 className="mb-6 font-unbounded text-[28px] leading-8 font-semibold text-secondary-200">
                Settings
            </h1>

            {/* Security Settings */}
            <SecuritySettings />

            {/* Notification Preferences */}
            <NotificationPreferences />

            {/* Account Settings */}
            <AccountSettings />
        </div>
    );
}
