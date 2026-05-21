"use client";

import { CreditCard, Zap, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';
import type { PaymentMethodSectionProps } from '@/types/booking';

export function PaymentMethodSection({
    paymentMethod,
    totalPrice,
    walletBalance,
    walletLoading,
    hasInsufficientFunds,
    onPaymentMethodChange,
    onFundWallet,
    radioIdPrefix = "booking",
}: PaymentMethodSectionProps) {
    const onlineId = `${radioIdPrefix}-online`;
    const walletId = `${radioIdPrefix}-wallet`;
    return (
        <Card className="rounded-2xl border border-accent-20">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-semibold text-secondary-000">
                    <CreditCard className="h-5 w-5" />
                    Payment Method
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <RadioGroup value={paymentMethod} onValueChange={(value: any) => onPaymentMethodChange(value)}>
                    <div className="space-y-3">
                        {/* Pay Online */}
                        <label
                            htmlFor={onlineId}
                            className={cn(
                                "flex items-start space-x-3 p-4 cursor-pointer transition-all rounded-xl",
                                paymentMethod === 'online'
                                    ? "border-2 border-primary-100 bg-primary-300"
                                    : "border-2 border-accent-20 bg-white"
                            )}
                        >
                            <RadioGroupItem value="online" id={onlineId} className="mt-1" />
                            <div className="flex-1">
                                <h4 className="text-base font-semibold text-secondary-000 mb-1">
                                    Pay Now Online
                                </h4>
                                <p className="text-sm text-accent-80">
                                    Pay securely via our payment gateway
                                </p>
                            </div>
                        </label>

                        {/* Wallet */}
                        <label
                            htmlFor={walletId}
                            className={cn(
                                "flex items-start space-x-3 p-4 cursor-pointer transition-all rounded-xl",
                                paymentMethod === 'wallet'
                                    ? "border-2 border-primary-100 bg-primary-300"
                                    : "border-2 border-accent-20 bg-white"
                            )}
                        >
                            <RadioGroupItem value="wallet" id={walletId} className="mt-1" />
                            <div className="flex-1">
                                <div className="flex items-center justify-between mb-1">
                                    <h4 className="text-base font-semibold text-secondary-000">
                                        Use Wallet
                                    </h4>
                                    {walletLoading ? (
                                        <Loader2 className="h-4 w-4 animate-spin text-accent-60" />
                                    ) : (
                                        <span className={cn(
                                            "px-3 py-1 rounded-full text-xs font-semibold",
                                            hasInsufficientFunds
                                                ? "bg-yellow-50 text-yellow-700"
                                                : "bg-green-50 text-green-700"
                                        )}>
                                            Balance: £{walletBalance.toFixed(2)}
                                        </span>
                                    )}
                                </div>
                                <p className="text-sm text-accent-80">
                                    Use funds from your Afrivendor Wallet
                                </p>
                                {hasInsufficientFunds && (
                                    <div className="mt-3">
                                        <Button
                                            variant="secondary"
                                            size="sm"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                onFundWallet();
                                            }}
                                        >
                                            Add Funds
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </label>
                    </div>
                </RadioGroup>

                {/* Pay Online note */}
                {paymentMethod === 'online' && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="pt-4 border-t border-accent-20"
                    >
                        <div className="p-4 rounded-xl bg-green-50 border border-green-200/50 flex items-start gap-3">
                            <Zap className="h-5 w-5 shrink-0 mt-0.5 text-green-600" />
                            <div>
                                <p className="text-sm font-semibold text-green-800 mb-0.5">
                                    Secure Payment Gateway
                                </p>
                                <p className="text-xs text-green-700 leading-relaxed">
                                    After confirming your booking, you&apos;ll be redirected to our secure payment page to complete your payment.
                                </p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </CardContent>
        </Card>
    );
}
