"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface Service {
    id: string;
    name: string;
    price: number;
}

interface BookingSummaryProps {
    selectedServices: Service[];
    date: Date | undefined;
    selectedTime: string;
    paymentMethod: 'venue' | 'online' | 'wallet';
    totalPrice: number;
    isSubmitting: boolean;
    isFormValid: boolean;
    onSubmit: () => void;
}

export function BookingSummary({
    selectedServices,
    date,
    selectedTime,
    paymentMethod,
    totalPrice,
    isSubmitting,
    isFormValid,
    onSubmit,
}: BookingSummaryProps) {
    return (
        <div className="lg:sticky lg:top-24 h-fit">
            <Card className="rounded-2xl border border-accent-20 shadow-[0_8px_24px_rgba(35,19,5,0.06)]">
                <CardHeader>
                    <CardTitle className="font-unbounded text-xl font-semibold text-secondary-000">
                        Booking Summary
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Services */}
                    <div>
                        <p className="mb-3 text-xs text-accent-80 uppercase tracking-wider">
                            Services
                        </p>
                        <div className="space-y-2">
                            {selectedServices.map((service) => (
                                <div key={service.id} className="flex justify-between items-start gap-2">
                                    <p className="flex-1 text-sm text-secondary-000">
                                        {service.name}
                                    </p>
                                    <p className="text-sm font-semibold text-secondary-000">
                                        ${service.price.toFixed(2)}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="border-t border-accent-20 pt-4" />

                    {/* Date */}
                    <div>
                        <p className="mb-1 text-xs text-accent-80 uppercase tracking-wider">
                            Date
                        </p>
                        <p className="text-sm text-secondary-000">
                            {date ? date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }) : 'Not selected'}
                        </p>
                    </div>

                    <div className="border-t border-accent-20 pt-4" />

                    {/* Time */}
                    <div>
                        <p className="mb-1 text-xs text-accent-80 uppercase tracking-wider">
                            Time
                        </p>
                        <p className="text-sm text-secondary-000">
                            {selectedTime || 'Not selected'}
                        </p>
                    </div>

                    <div className="border-t border-accent-20 pt-4" />

                    {/* Payment */}
                    <div>
                        <p className="mb-1 text-xs text-accent-80 uppercase tracking-wider">
                            Payment
                        </p>
                        <p className="text-sm text-secondary-000">
                            {paymentMethod === 'venue' ? 'Pay at Venue' : paymentMethod === 'online' ? 'Pay Online' : 'Wallet'}
                        </p>
                    </div>

                    <div className="border-t border-accent-20 pt-4" />

                    {/* Total */}
                    <div className="pt-2">
                        <div className="flex justify-between items-center mb-6">
                            <span className="text-base font-semibold text-secondary-000">
                                Total
                            </span>
                            <span className="font-unbounded text-2xl leading-7 font-semibold text-secondary-000">
                                ${totalPrice.toFixed(2)}
                            </span>
                        </div>

                        <Button
                            onClick={onSubmit}
                            disabled={!isFormValid || isSubmitting}
                            className="w-full bg-primary-100 text-white hover:bg-primary-100/90 h-12 text-base font-semibold"
                        >
                            {isSubmitting ? 'Booking...' : paymentMethod === 'online' ? 'Pay & Confirm Booking' : 'Confirm Booking'}
                        </Button>
                    </div>

                    <p className="text-center pt-2 text-xs text-accent-80">
                        You'll receive a confirmation email after booking
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}

