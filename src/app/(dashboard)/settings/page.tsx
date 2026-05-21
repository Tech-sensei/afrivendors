"use client";

import { useState } from "react";
import { toast } from "sonner";
import { AccountSettings } from "@/components/settings/AccountSettings";
import { SecuritySettings } from "@/components/settings/SecuritySettings";
import {
  NotificationSettings,
  type ClientNotificationPreferenceKey,
  type ClientNotificationPreferences,
} from "@/components/settings/NotificationSettings";

const DEFAULT_NOTIFICATION_PREFERENCES: ClientNotificationPreferences = {
  emailNotifications: true,
  bookingEmails: true,
  messageEmails: true,
  marketingEmails: false,
};

export default function SettingsPage() {
  const [preferences, setPreferences] = useState<ClientNotificationPreferences>(
    DEFAULT_NOTIFICATION_PREFERENCES
  );

  const handleNotificationToggle = (key: ClientNotificationPreferenceKey) => {
    setPreferences((prev) => {
      const next = { ...prev, [key]: !prev[key] };

      if (key === "emailNotifications" && !next.emailNotifications) {
        next.bookingEmails = false;
        next.messageEmails = false;
        next.marketingEmails = false;
      }

      if (
        key !== "emailNotifications" &&
        next[key] &&
        !next.emailNotifications
      ) {
        next.emailNotifications = true;
      }

      return next;
    });
    toast.success("Notification preferences updated");
  };

  return (
    <div className="space-y-6">
      <h1 className="mb-6 font-unbounded text-[28px] leading-8 font-semibold text-secondary-200">
        Settings
      </h1>

      <SecuritySettings />

      <NotificationSettings
        preferences={preferences}
        onToggle={handleNotificationToggle}
      />

      <AccountSettings />
    </div>
  );
}
