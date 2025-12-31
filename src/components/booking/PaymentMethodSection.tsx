"use client";

import { CreditCard, Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

const WALLET_BALANCE = 430.00;

interface CardFormData {
    cardNumber: string;
    cardExpiry: string;
    cardCvc: string;
    cardName: string;
}

interface PaymentMethodSectionProps {
    paymentMethod: 'venue' | 'online' | 'wallet';
    totalPrice: number;
    cardFormData: CardFormData;
    hasInsufficientFunds: boolean;
    onPaymentMethodChange: (method: 'venue' | 'online' | 'wallet') => void;
    onCardFormDataChange: (data: Partial<CardFormData>) => void;
    onFundWallet: () => void;
}

export function PaymentMethodSection({
    paymentMethod,
    totalPrice,
    cardFormData,
    hasInsufficientFunds,
    onPaymentMethodChange,
    onCardFormDataChange,
    onFundWallet,
}: PaymentMethodSectionProps) {
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
                        {/* Pay at Venue */}
                        <label
                            htmlFor="venue"
                            className={cn(
                                "flex items-start space-x-3 p-4 cursor-pointer transition-all rounded-xl",
                                paymentMethod === 'venue'
                                    ? "border-2 border-primary-100 bg-primary-300"
                                    : "border-2 border-accent-20 bg-white"
                            )}
                        >
                            <RadioGroupItem value="venue" id="venue" className="mt-1" />
                            <div className="flex-1">
                                <h4 className="text-base font-semibold text-secondary-000 mb-1">
                                    Pay at Venue
                                </h4>
                                <p className="text-sm text-accent-80">
                                    Pay with cash or card when you arrive at the venue
                                </p>
                            </div>
                        </label>

                        {/* Pay Online */}
                        <label
                            htmlFor="online"
                            className={cn(
                                "flex items-start space-x-3 p-4 cursor-pointer transition-all rounded-xl",
                                paymentMethod === 'online'
                                    ? "border-2 border-primary-100 bg-primary-300"
                                    : "border-2 border-accent-20 bg-white"
                            )}
                        >
                            <RadioGroupItem value="online" id="online" className="mt-1" />
                            <div className="flex-1">
                                <h4 className="text-base font-semibold text-secondary-000 mb-1">
                                    Pay Now Online
                                </h4>
                                <p className="text-sm text-accent-80">
                                    Pay securely with your debit/credit card now
                                </p>
                            </div>
                        </label>

                        {/* Wallet */}
                        <label
                            htmlFor="wallet"
                            className={cn(
                                "flex items-start space-x-3 p-4 cursor-pointer transition-all rounded-xl",
                                paymentMethod === 'wallet'
                                    ? "border-2 border-primary-100 bg-primary-300"
                                    : "border-2 border-accent-20 bg-white"
                            )}
                        >
                            <RadioGroupItem value="wallet" id="wallet" className="mt-1" />
                            <div className="flex-1">
                                <div className="flex items-center justify-between mb-1">
                                    <h4 className="text-base font-semibold text-secondary-000">
                                        Use Wallet
                                    </h4>
                                    <span className={cn(
                                        "px-3 py-1 rounded-full text-xs font-semibold",
                                        hasInsufficientFunds
                                            ? "bg-yellow-50 text-yellow-700"
                                            : "bg-green-50 text-green-700"
                                    )}>
                                        Balance: ${WALLET_BALANCE.toFixed(2)}
                                    </span>
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

                {/* Pay at Venue Cancellation Policy Notice */}
                {paymentMethod === 'venue' && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="pt-4 border-t border-accent-20"
                    >
                        <div className="p-4 rounded-xl bg-yellow-50/30 border border-yellow-200/50">
                            <div className="flex items-start gap-3">
                                <Info className="h-5 w-5 flex-shrink-0 mt-0.5 text-yellow-600" />
                                <div>
                                    <p className="mb-2 text-sm font-semibold leading-5 text-secondary-000">
                                        Cancellation Policy
                                    </p>
                                    <p className="text-xs leading-[18px] text-accent-80">
                                        If you cancel this appointment after booking, a <strong className="text-secondary-000">30% cancellation fee</strong> will apply to compensate the vendor for reserved time. This helps maintain fair scheduling for all customers.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Card Payment Form */}
                {paymentMethod === 'online' && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-4 pt-4 border-t border-accent-20"
                    >
                        <div>
                            <Label htmlFor="cardName" className="block mb-2 text-sm font-semibold text-secondary-000">
                                Cardholder Name *
                            </Label>
                            <Input
                                id="cardName"
                                required
                                value={cardFormData.cardName}
                                onChange={(e) => onCardFormDataChange({ cardName: e.target.value })}
                                placeholder="Name on card"
                                className="h-12 rounded-xl border-accent-20 text-sm"
                            />
                        </div>
                        <div>
                            <Label htmlFor="cardNumber" className="block mb-2 text-sm font-semibold text-secondary-000">
                                Card Number *
                            </Label>
                            <Input
                                id="cardNumber"
                                required
                                value={cardFormData.cardNumber}
                                onChange={(e) => {
                                    const value = e.target.value.replace(/\s/g, '');
                                    const formatted = value.match(/.{1,4}/g)?.join(' ') || value;
                                    onCardFormDataChange({ cardNumber: formatted });
                                }}
                                placeholder="1234 5678 9012 3456"
                                maxLength={19}
                                className="h-12 rounded-xl border-accent-20 text-sm"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="cardExpiry" className="block mb-2 text-sm font-semibold text-secondary-000">
                                    Expiry Date *
                                </Label>
                                <Input
                                    id="cardExpiry"
                                    required
                                    value={cardFormData.cardExpiry}
                                    onChange={(e) => {
                                        const value = e.target.value.replace(/\D/g, '');
                                        const formatted = value.length >= 2 ? `${value.slice(0, 2)}/${value.slice(2, 4)}` : value;
                                        onCardFormDataChange({ cardExpiry: formatted });
                                    }}
                                    placeholder="MM/YY"
                                    maxLength={5}
                                    className="h-12 rounded-xl border-accent-20 text-sm"
                                />
                            </div>
                            <div>
                                <Label htmlFor="cardCvc" className="block mb-2 text-sm font-semibold text-secondary-000">
                                    CVV *
                                </Label>
                                <Input
                                    id="cardCvc"
                                    required
                                    value={cardFormData.cardCvc}
                                    onChange={(e) => {
                                        const value = e.target.value.replace(/\D/g, '');
                                        onCardFormDataChange({ cardCvc: value });
                                    }}
                                    placeholder="123"
                                    maxLength={4}
                                    type="password"
                                    className="h-12 rounded-xl border-accent-20 text-sm"
                                />
                            </div>
                        </div>
                        <div className="p-3 flex items-start gap-2 rounded-lg bg-green-50">
                            <svg className="h-5 w-5 mt-0.5 flex-shrink-0 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                            <p className="text-xs text-green-700">
                                Your payment information is encrypted and secure
                            </p>
                        </div>
                    </motion.div>
                )}
            </CardContent>
        </Card>
    );
}

