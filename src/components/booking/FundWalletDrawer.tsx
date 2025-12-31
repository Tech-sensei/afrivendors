"use client";

import { DollarSign } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface FundWalletDrawerProps {
    isOpen: boolean;
    onClose: () => void;
}

export function FundWalletDrawer({ isOpen, onClose }: FundWalletDrawerProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
                <h3 className="text-xl font-semibold text-secondary-000 mb-2">Fund Wallet</h3>
                <p className="text-sm text-accent-80 mb-6">Add funds to your Afrivendor wallet instantly</p>
                <div className="space-y-4">
                    <div>
                        <Label htmlFor="amount" className="block mb-2 text-sm font-semibold text-secondary-000">
                            Amount
                        </Label>
                        <div className="relative">
                            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-accent-60" />
                            <Input
                                id="amount"
                                type="number"
                                placeholder="0.00"
                                className="h-12 rounded-xl border-accent-20 pl-10 text-base font-semibold"
                            />
                        </div>
                        <p className="mt-2 text-xs text-accent-80">
                            Instant funding. A 0.9% processing fee may apply.
                        </p>
                    </div>
                    <div className="flex gap-3 pt-4">
                        <Button
                            variant="secondary"
                            onClick={onClose}
                            className="flex-1"
                        >
                            Cancel
                        </Button>
                        <Button
                            className="flex-1 bg-primary-100 text-white hover:bg-primary-100/90"
                            onClick={() => {
                                toast.success('Funds added to wallet!');
                                onClose();
                            }}
                        >
                            Add Funds
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

