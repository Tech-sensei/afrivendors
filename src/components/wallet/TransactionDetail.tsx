"use client";

import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/dashboard/StatusBadge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { toast } from 'sonner';

interface Transaction {
    id: number;
    date: string;
    type: 'debit' | 'credit' | 'refund';
    vendor: string;
    service: string;
    amount: number;
    status: 'completed' | 'pending' | 'refunded';
    reference: string;
}

interface TransactionDetailProps {
    transaction: Transaction | null;
    isOpen: boolean;
    onClose: () => void;
}

export function TransactionDetail({ transaction, isOpen, onClose }: TransactionDetailProps) {
    if (!transaction) return null;

    const isCredit = transaction.amount > 0;

    return (
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent className="w-full sm:max-w-md overflow-y-auto rounded-t-3xl sm:rounded-l-3xl sm:rounded-tr-none border-0 p-6">
                <SheetHeader className="p-0">
                    <SheetTitle className="font-unbounded text-xl font-semibold text-secondary-000">
                        Transaction Details
                    </SheetTitle>
                    <SheetDescription className="text-sm text-accent-80">
                        Reference: {transaction.reference}
                    </SheetDescription>
                </SheetHeader>

                <div className="mt-6 space-y-6 px-0">
                    {/* Amount Display */}
                    <div
                        className={`p-4 rounded-xl border ${isCredit
                            ? 'bg-green-50 border-green-200'
                            : 'bg-accent-10 border-accent-20'
                            }`}
                    >
                        <p className="mb-1 text-xs font-semibold text-accent-80 uppercase tracking-wider">
                            Amount
                        </p>
                        <p
                            className={`font-unbounded text-3xl font-semibold ${isCredit ? 'text-green-600' : 'text-secondary-000'
                                }`}
                        >
                            {isCredit ? '+' : ''}£{Math.abs(transaction.amount).toFixed(2)}
                        </p>
                    </div>

                    {/* Transaction Details */}
                    <div className="space-y-4">
                        <div>
                            <p className="mb-1 text-xs font-semibold text-accent-80 uppercase tracking-wider">
                                Vendor/Service
                            </p>
                            <p className="text-sm font-semibold text-secondary-000">{transaction.vendor}</p>
                            <p className="text-sm text-accent-80">{transaction.service}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="mb-1 text-xs font-semibold text-accent-80 uppercase tracking-wider">
                                    Date
                                </p>
                                <p className="text-sm text-secondary-000">{transaction.date}</p>
                            </div>
                            <div>
                                <p className="mb-1 text-xs font-semibold text-accent-80 uppercase tracking-wider">
                                    Type
                                </p>
                                <p className="text-sm text-secondary-000 capitalize">{transaction.type}</p>
                            </div>
                        </div>

                        <div>
                            <p className="mb-1 text-xs font-semibold text-accent-80 uppercase tracking-wider">
                                Reference
                            </p>
                            <p className="text-xs text-secondary-000 font-mono">{transaction.reference}</p>
                        </div>

                        <div>
                            <p className="mb-1 text-xs font-semibold text-accent-80 uppercase tracking-wider">
                                Status
                            </p>
                            <StatusBadge status={transaction.status} />
                        </div>
                    </div>

                    {/* Download Receipt Button */}
                    <Button
                        variant="outline"
                        onClick={() => {
                            toast.success('Receipt downloaded successfully');
                        }}
                        className="w-full h-12 rounded-xl border-accent-20 hover:bg-accent-10 hover:border-accent-30 text-sm font-semibold text-secondary-000"
                    >
                        <Download className="h-4 w-4 mr-2" />
                        Download Receipt
                    </Button>
                </div>
            </SheetContent>
        </Sheet>
    );
}

