"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Lock, Shield, Mail, CheckCircle2, XCircle, Eye, EyeOff } from 'lucide-react';
import { useAuthAPI } from '@/services/useAuthAPI';
import { changePasswordSchema } from '@/lib/validations/authValidationSchema';
import { useAppSelector } from '@/store/hooks';

export function SecuritySettings() {
    const { changePasswordAsync, isChangingPassword, enableTwoFactorAsync, disableTwoFactorAsync, isEnablingTwoFactor, isDisablingTwoFactor } = useAuthAPI();
    const user = useAppSelector((state) => state.auth.user);

    const twoFactorEnabled =
        user?.allow2faLogin ?? user?.twoFactorEnabled ?? false;
    const emailVerified = !!user?.emailVerifiedAt;
    const [showChangePassword, setShowChangePassword] = useState(false);

    const emptyPasswordData = { oldPassword: '', newPassword: '', confirmNewPassword: '' };
    const [passwordData, setPasswordData] = useState(emptyPasswordData);
    const [passwordErrors, setPasswordErrors] = useState(emptyPasswordData);
    const [showFields, setShowFields] = useState({ oldPassword: false, newPassword: false, confirmNewPassword: false });

    const handlePasswordChange = async () => {
        const result = changePasswordSchema.safeParse(passwordData);
        if (!result.success) {
            const fieldErrors = result.error.flatten().fieldErrors;
            setPasswordErrors({
                oldPassword: fieldErrors.oldPassword?.[0] ?? '',
                newPassword: fieldErrors.newPassword?.[0] ?? '',
                confirmNewPassword: fieldErrors.confirmNewPassword?.[0] ?? '',
            });
            return;
        }
        setPasswordErrors(emptyPasswordData);
        try {
            await changePasswordAsync(passwordData);
            setPasswordData(emptyPasswordData);
            setShowChangePassword(false);
        } catch {
            // error toast handled inside useAuthAPI
        }
    };

    const handleToggleTwoFactor = async () => {
        try {
            if (twoFactorEnabled) {
                await disableTwoFactorAsync();
            } else {
                await enableTwoFactorAsync();
            }
        } catch {
            // error toast handled inside useAuthAPI
        }
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
                                    setPasswordData(emptyPasswordData);
                                    setPasswordErrors(emptyPasswordData);
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
                                <Label htmlFor="oldPassword" className="block mb-2 text-sm font-semibold text-secondary-000">
                                    Current Password
                                </Label>
                                <div className="relative">
                                    <Input
                                        id="oldPassword"
                                        type={showFields.oldPassword ? 'text' : 'password'}
                                        value={passwordData.oldPassword}
                                        onChange={(e) => setPasswordData({ ...passwordData, oldPassword: e.target.value })}
                                        className="h-12 rounded-xl border-accent-20 text-sm pr-10"
                                        placeholder="Enter current password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowFields({ ...showFields, oldPassword: !showFields.oldPassword })}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-accent-60 hover:text-secondary-000 transition-colors"
                                    >
                                        {showFields.oldPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                                {passwordErrors.oldPassword && <p className="mt-1 text-xs text-red-600">{passwordErrors.oldPassword}</p>}
                            </div>
                            <div>
                                <Label htmlFor="newPassword" className="block mb-2 text-sm font-semibold text-secondary-000">
                                    New Password
                                </Label>
                                <div className="relative">
                                    <Input
                                        id="newPassword"
                                        type={showFields.newPassword ? 'text' : 'password'}
                                        value={passwordData.newPassword}
                                        onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                        className="h-12 rounded-xl border-accent-20 text-sm pr-10"
                                        placeholder="Enter new password (min. 8 characters)"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowFields({ ...showFields, newPassword: !showFields.newPassword })}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-accent-60 hover:text-secondary-000 transition-colors"
                                    >
                                        {showFields.newPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                                {passwordErrors.newPassword && <p className="mt-1 text-xs text-red-600">{passwordErrors.newPassword}</p>}
                            </div>
                            <div>
                                <Label htmlFor="confirmNewPassword" className="block mb-2 text-sm font-semibold text-secondary-000">
                                    Confirm New Password
                                </Label>
                                <div className="relative">
                                    <Input
                                        id="confirmNewPassword"
                                        type={showFields.confirmNewPassword ? 'text' : 'password'}
                                        value={passwordData.confirmNewPassword}
                                        onChange={(e) => setPasswordData({ ...passwordData, confirmNewPassword: e.target.value })}
                                        className="h-12 rounded-xl border-accent-20 text-sm pr-10"
                                        placeholder="Confirm new password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowFields({ ...showFields, confirmNewPassword: !showFields.confirmNewPassword })}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-accent-60 hover:text-secondary-000 transition-colors"
                                    >
                                        {showFields.confirmNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                                {passwordErrors.confirmNewPassword && <p className="mt-1 text-xs text-red-600">{passwordErrors.confirmNewPassword}</p>}
                            </div>
                            <Button
                                onClick={handlePasswordChange}
                                disabled={isChangingPassword}
                                className="h-12 bg-primary-100 text-white hover:bg-primary-100/90 rounded-xl text-sm font-semibold disabled:opacity-70"
                            >
                                {isChangingPassword ? 'Updating...' : 'Update Password'}
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
                        onCheckedChange={handleToggleTwoFactor}
                        disabled={isEnablingTwoFactor || isDisablingTwoFactor}
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
                            className="h-9 rounded-xl border-accent-20 text-sm font-semibold"
                            disabled
                        >
                            Verify
                        </Button>
                    )}
                </div>

            </CardContent>
        </Card>
    );
}

