"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Trash2 } from 'lucide-react';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { toast } from 'sonner';

export function AccountSettings() {
    const [deleteAccountOpen, setDeleteAccountOpen] = useState(false);

    const handleDeleteAccount = () => {
        // TODO: Implement actual account deletion
        toast.success('Account deletion request submitted');
        setDeleteAccountOpen(false);
    };

    return (
        <>
            <Card className="rounded-2xl border border-accent-20 bg-white shadow-[0_8px_24px_rgba(35,19,5,0.06)]">
                <CardHeader>
                    <CardTitle className="text-lg font-semibold text-secondary-000">
                        Account Settings
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {/* Delete Account */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
                                <Trash2 className="h-5 w-5 text-red-600" />
                            </div>
                            <div>
                                <Label className="text-sm font-semibold text-secondary-000">
                                    Delete Account
                                </Label>
                                <p className="text-xs text-accent-80">
                                    Permanently delete your account and all data
                                </p>
                            </div>
                        </div>
                        <Button
                            variant="outline"
                            onClick={() => setDeleteAccountOpen(true)}
                            className="h-9 rounded-xl border-red-200 text-red-600 hover:bg-red-50 text-sm font-semibold"
                        >
                            Delete
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Delete Account Confirmation Modal */}
            <ConfirmModal
                open={deleteAccountOpen}
                onOpenChange={setDeleteAccountOpen}
                onConfirm={handleDeleteAccount}
                title="Delete Account?"
                description="Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently deleted."
                confirmText="Yes, Delete Account"
                cancelText="Cancel"
                icon={Trash2}
                iconColor="text-red-600"
                iconBg="bg-red-50"
                confirmButtonVariant="destructive"
            />
        </>
    );
}

