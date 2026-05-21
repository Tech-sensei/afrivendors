"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Bell, Mail, Calendar, MessageCircle, Megaphone } from "lucide-react";

export type ClientNotificationPreferenceKey =
  | "emailNotifications"
  | "bookingEmails"
  | "messageEmails"
  | "marketingEmails";

export type ClientNotificationPreferences = Record<
  ClientNotificationPreferenceKey,
  boolean
>;

const PREFERENCE_ROWS: {
  key: ClientNotificationPreferenceKey;
  label: string;
  description: string;
  icon: typeof Mail;
  iconClass: string;
  iconBg: string;
}[] = [
  {
    key: "emailNotifications",
    label: "Email notifications",
    description: "Master switch for email updates about your account",
    icon: Mail,
    iconClass: "text-primary-100",
    iconBg: "bg-primary-100/10",
  },
  {
    key: "bookingEmails",
    label: "Booking updates",
    description: "Appointment confirmations, reminders, and status changes",
    icon: Calendar,
    iconClass: "text-emerald-600",
    iconBg: "bg-emerald-50",
  },
  {
    key: "messageEmails",
    label: "Message alerts",
    description: "Email when a vendor sends you a new message",
    icon: MessageCircle,
    iconClass: "text-blue-600",
    iconBg: "bg-blue-50",
  },
  {
    key: "marketingEmails",
    label: "Promotions & tips",
    description: "Offers, product news, and platform tips (optional)",
    icon: Megaphone,
    iconClass: "text-amber-600",
    iconBg: "bg-amber-50",
  },
];

interface NotificationSettingsProps {
  preferences: ClientNotificationPreferences;
  onToggle: (key: ClientNotificationPreferenceKey) => void;
  isSaving?: boolean;
}

export function NotificationSettings({
  preferences,
  onToggle,
  isSaving = false,
}: NotificationSettingsProps) {
  const emailMasterOn = preferences.emailNotifications;

  return (
    <Card className="rounded-2xl border border-accent-20 bg-white shadow-[0_8px_24px_rgba(35,19,5,0.06)]">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-100/10">
            <Bell className="h-5 w-5 text-primary-100" />
          </div>
          <div>
            <CardTitle className="text-lg font-semibold text-secondary-000">
              Notification settings
            </CardTitle>
            <p className="text-xs text-accent-80 mt-0.5">
              Choose how we contact you by email
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-0">
        {PREFERENCE_ROWS.map((row, index) => {
          const Icon = row.icon;
          const isMaster = row.key === "emailNotifications";
          const checked = preferences[row.key];
          const disabled =
            isSaving || (!isMaster && !emailMasterOn && row.key !== "emailNotifications");

          return (
            <div key={row.key}>
              {index > 0 && <Separator className="my-6 bg-accent-20" />}
              <div className="flex items-center justify-between gap-4">
                <div className="flex min-w-0 flex-1 items-center gap-3">
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${row.iconBg}`}
                  >
                    <Icon className={`h-5 w-5 ${row.iconClass}`} />
                  </div>
                  <div className="min-w-0">
                    <Label
                      htmlFor={row.key}
                      className={`text-sm font-semibold text-secondary-000 ${
                        disabled && !isMaster ? "opacity-50" : ""
                      }`}
                    >
                      {row.label}
                    </Label>
                    <p
                      className={`text-xs text-accent-80 ${
                        disabled && !isMaster ? "opacity-50" : ""
                      }`}
                    >
                      {row.description}
                    </p>
                  </div>
                </div>
                <Switch
                  id={row.key}
                  checked={checked}
                  onCheckedChange={() => onToggle(row.key)}
                  disabled={disabled}
                  aria-label={row.label}
                />
              </div>
            </div>
          );
        })}
        {!emailMasterOn && (
          <p className="mt-6 text-xs text-accent-80 rounded-xl bg-accent-10/80 px-4 py-3">
            Turn on email notifications to receive booking and message alerts by
            email. In-app notifications in the bell icon are not affected.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
