"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Lock, Shield, Mail, Phone, CheckCircle2, XCircle } from 'lucide-react';
import { toast } from 'sonner';

export function SecuritySettings() {
    const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
    const [emailVerified, setEmailVerified] = useState(true);
    const [phoneVerified, setPhoneVerified] = useState(false);
    const [showChangePassword, setShowChangePassword] = useState(false);

    // Password change state
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    const handlePasswordChange = () => {
        if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
            toast.error('Please fill in all password fields');
            return;
        }

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast.error('New passwords do not match');
            return;
        }

        if (passwordData.newPassword.length < 8) {
            toast.error('Password must be at least 8 characters');
            return;
        }

        // TODO: Implement actual password change
        toast.success('Password changed successfully');
        setPasswordData({
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
        });
        setShowChangePassword(false);
    };

    const handleVerifyEmail = () => {
        // TODO: Implement email verification
        toast.info('Verification email sent. Please check your inbox.');
    };

    const handleVerifyPhone = () => {
        // TODO: Implement phone verification
        toast.info('Verification code sent to your phone.');
    };

    return (
        <Card className="rounded-2xl border border-accent-20 bg-white shadow-[0_8px_24px_rgba(35,19,5,0.06)]">
            <CardHeader>
                <CardTitle className="text-lg font-semibold text-secondary-000">
                    Security
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Change Password */}
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-primary-100/10 flex items-center justify-center">
                                <Lock className="h-5 w-5 text-primary-100" />
                            </div>
                            <div>
                                <Label className="text-sm font-semibold text-secondary-000">
                                    Password
                                </Label>
                                <p className="text-xs text-accent-80">
                                    Change your account password
                                </p>
                            </div>
                        </div>
                        {!showChangePassword ? (
                            <Button
                                variant="outline"
                                onClick={() => setShowChangePassword(true)}
                                className="h-9 rounded-xl border-accent-20 text-sm font-semibold"
                            >
                                Change Password
                            </Button>
                        ) : (
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setShowChangePassword(false);
                                    setPasswordData({
                                        currentPassword: '',
                                        newPassword: '',
                                        confirmPassword: '',
                                    });
                                }}
                                className="h-9 rounded-xl border-accent-20 text-sm font-semibold"
                            >
                                Cancel
                            </Button>
                        )}
                    </div>

                    {showChangePassword && (
                        <div className="pl-13 space-y-4 pt-2 border-t border-accent-20">
                            <div>
                                <Label htmlFor="currentPassword" className="block mb-2 text-sm font-semibold text-secondary-000">
                                    Current Password
                                </Label>
                                <Input
                                    id="currentPassword"
                                    type="password"
                                    value={passwordData.currentPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                    className="h-12 rounded-xl border-accent-20 text-sm"
                                    placeholder="Enter current password"
                                />
                            </div>
                            <div>
                                <Label htmlFor="newPassword" className="block mb-2 text-sm font-semibold text-secondary-000">
                                    New Password
                                </Label>
                                <Input
                                    id="newPassword"
                                    type="password"
                                    value={passwordData.newPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                    className="h-12 rounded-xl border-accent-20 text-sm"
                                    placeholder="Enter new password"
                                />
                            </div>
                            <div>
                                <Label htmlFor="confirmPassword" className="block mb-2 text-sm font-semibold text-secondary-000">
                                    Confirm New Password
                                </Label>
                                <Input
                                    id="confirmPassword"
                                    type="password"
                                    value={passwordData.confirmPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                    className="h-12 rounded-xl border-accent-20 text-sm"
                                    placeholder="Confirm new password"
                                />
                            </div>
                            <Button
                                onClick={handlePasswordChange}
                                className="h-12 bg-primary-100 text-white hover:bg-primary-100/90 rounded-xl text-sm font-semibold"
                            >
                                Update Password
                            </Button>
                        </div>
                    )}
                </div>

                <Separator className="bg-accent-20" />

                {/* Two-Factor Authentication */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary-100/10 flex items-center justify-center">
                            <Shield className="h-5 w-5 text-primary-100" />
                        </div>
                        <div>
                            <Label className="text-sm font-semibold text-secondary-000">
                                Two-Factor Authentication
                            </Label>
                            <p className="text-xs text-accent-80">
                                Add an extra layer of security to your account
                            </p>
                        </div>
                    </div>
                    <Switch
                        checked={twoFactorEnabled}
                        onCheckedChange={setTwoFactorEnabled}
                    />
                </div>

                <Separator className="bg-accent-20" />

                {/* Email Verification */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${emailVerified ? 'bg-green-50' : 'bg-accent-20'
                            }`}>
                            <Mail className={`h-5 w-5 ${emailVerified ? 'text-green-600' : 'text-accent-60'
                                }`} />
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                                <Label className="text-sm font-semibold text-secondary-000">
                                    Email Verification
                                </Label>
                                {emailVerified ? (
                                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                                ) : (
                                    <XCircle className="h-4 w-4 text-red-600" />
                                )}
                            </div>
                            <p className="text-xs text-accent-80">
                                {emailVerified ? 'Your email is verified' : 'Please verify your email address'}
                            </p>
                        </div>
                    </div>
                    {!emailVerified && (
                        <Button
                            variant="outline"
                            onClick={handleVerifyEmail}
                            className="h-9 rounded-xl border-accent-20 text-sm font-semibold"
                        >
                            Verify
                        </Button>
                    )}
                </div>

                <Separator className="bg-accent-20" />

                {/* Phone Verification */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${phoneVerified ? 'bg-green-50' : 'bg-accent-20'
                            }`}>
                            <Phone className={`h-5 w-5 ${phoneVerified ? 'text-green-600' : 'text-accent-60'
                                }`} />
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                                <Label className="text-sm font-semibold text-secondary-000">
                                    Phone Verification
                                </Label>
                                {phoneVerified ? (
                                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                                ) : (
                                    <XCircle className="h-4 w-4 text-red-600" />
                                )}
                            </div>
                            <p className="text-xs text-accent-80">
                                {phoneVerified ? 'Your phone is verified' : 'Please verify your phone number'}
                            </p>
                        </div>
                    </div>
                    {!phoneVerified && (
                        <Button
                            variant="outline"
                            onClick={handleVerifyPhone}
                            className="h-9 rounded-xl border-accent-20 text-sm font-semibold"
                        >
                            Verify
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}

