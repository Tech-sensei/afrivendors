"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Mail, Bell, Calendar, MessageSquare, Heart, Package } from 'lucide-react';

export function NotificationPreferences() {
    const [notifications, setNotifications] = useState({
        email: true,
        push: true,
        bookingConfirmations: true,
        bookingReminders: true,
        newMessages: true,
        vendorUpdates: true,
        serviceUpdates: true,
    });

    return (
        <Card className="rounded-2xl border border-accent-20 bg-white shadow-[0_8px_24px_rgba(35,19,5,0.06)]">
            <CardHeader>
                <CardTitle className="text-lg font-semibold text-secondary-000">
                    Notification Preferences
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Email Notifications */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary-100/10 flex items-center justify-center">
                            <Mail className="h-5 w-5 text-primary-100" />
                        </div>
                        <div>
                            <Label className="text-sm font-semibold text-secondary-000">
                                Email Notifications
                            </Label>
                            <p className="text-xs text-accent-80">
                                Receive notifications via email
                            </p>
                        </div>
                    </div>
                    <Switch
                        checked={notifications.email}
                        onCheckedChange={(checked) => setNotifications({ ...notifications, email: checked })}
                    />
                </div>

                <Separator className="bg-accent-20" />

                {/* Push Notifications */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary-100/10 flex items-center justify-center">
                            <Bell className="h-5 w-5 text-primary-100" />
                        </div>
                        <div>
                            <Label className="text-sm font-semibold text-secondary-000">
                                Push Notifications
                            </Label>
                            <p className="text-xs text-accent-80">
                                Receive push notifications on your device
                            </p>
                        </div>
                    </div>
                    <Switch
                        checked={notifications.push}
                        onCheckedChange={(checked) => setNotifications({ ...notifications, push: checked })}
                    />
                </div>

                <Separator className="bg-accent-20" />

                {/* Booking Confirmations */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary-100/10 flex items-center justify-center">
                            <Calendar className="h-5 w-5 text-primary-100" />
                        </div>
                        <div>
                            <Label className="text-sm font-semibold text-secondary-000">
                                Booking Confirmations
                            </Label>
                            <p className="text-xs text-accent-80">
                                Get notified when bookings are confirmed
                            </p>
                        </div>
                    </div>
                    <Switch
                        checked={notifications.bookingConfirmations}
                        onCheckedChange={(checked) => setNotifications({ ...notifications, bookingConfirmations: checked })}
                    />
                </div>

                <Separator className="bg-accent-20" />

                {/* Booking Reminders */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary-100/10 flex items-center justify-center">
                            <Calendar className="h-5 w-5 text-primary-100" />
                        </div>
                        <div>
                            <Label className="text-sm font-semibold text-secondary-000">
                                Booking Reminders
                            </Label>
                            <p className="text-xs text-accent-80">
                                Receive reminders before your appointments
                            </p>
                        </div>
                    </div>
                    <Switch
                        checked={notifications.bookingReminders}
                        onCheckedChange={(checked) => setNotifications({ ...notifications, bookingReminders: checked })}
                    />
                </div>

                <Separator className="bg-accent-20" />

                {/* New Messages */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary-100/10 flex items-center justify-center">
                            <MessageSquare className="h-5 w-5 text-primary-100" />
                        </div>
                        <div>
                            <Label className="text-sm font-semibold text-secondary-000">
                                New Messages
                            </Label>
                            <p className="text-xs text-accent-80">
                                Get notified when you receive new messages
                            </p>
                        </div>
                    </div>
                    <Switch
                        checked={notifications.newMessages}
                        onCheckedChange={(checked) => setNotifications({ ...notifications, newMessages: checked })}
                    />
                </div>

                <Separator className="bg-accent-20" />

                {/* Vendor Updates */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary-100/10 flex items-center justify-center">
                            <Heart className="h-5 w-5 text-primary-100" />
                        </div>
                        <div>
                            <Label className="text-sm font-semibold text-secondary-000">
                                Vendor Updates
                            </Label>
                            <p className="text-xs text-accent-80">
                                Get notified about updates from your favourite vendors
                            </p>
                        </div>
                    </div>
                    <Switch
                        checked={notifications.vendorUpdates}
                        onCheckedChange={(checked) => setNotifications({ ...notifications, vendorUpdates: checked })}
                    />
                </div>

                <Separator className="bg-accent-20" />

                {/* Service Updates */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary-100/10 flex items-center justify-center">
                            <Package className="h-5 w-5 text-primary-100" />
                        </div>
                        <div>
                            <Label className="text-sm font-semibold text-secondary-000">
                                Service Updates
                            </Label>
                            <p className="text-xs text-accent-80">
                                Get notified about new services and updates
                            </p>
                        </div>
                    </div>
                    <Switch
                        checked={notifications.serviceUpdates}
                        onCheckedChange={(checked) => setNotifications({ ...notifications, serviceUpdates: checked })}
                    />
                </div>
            </CardContent>
        </Card>
    );
}

