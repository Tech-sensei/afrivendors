"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle, Calendar, Clock, CreditCard } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

export default function BookingConfirmationPage() {
    const router = useRouter();
    const [showAnimation, setShowAnimation] = useState(false);
    const [bookingData, setBookingData] = useState<any>(null);

    useEffect(() => {
        // Get booking data from sessionStorage (set after successful booking)
        const storedBookingData = sessionStorage.getItem('bookingConfirmationData');

        if (storedBookingData) {
            try {
                const parsed = JSON.parse(storedBookingData);

                // Validate that we have the required data
                if (!parsed.vendor || !parsed.services || !parsed.date) {
                    console.error('Invalid booking data structure:', parsed);
                    sessionStorage.removeItem('bookingConfirmationData');
                    // Don't redirect automatically - show error state instead
                    return;
                }

                // Convert date string back to Date object
                if (parsed.date) {
                    const dateObj = new Date(parsed.date);
                    if (isNaN(dateObj.getTime())) {
                        console.error('Invalid date:', parsed.date);
                        sessionStorage.removeItem('bookingConfirmationData');
                        return;
                    }
                    parsed.date = dateObj;
                }

                // Ensure prices are numbers (not strings)
                if (parsed.services && Array.isArray(parsed.services)) {
                    parsed.services = parsed.services.map((service: any) => ({
                        ...service,
                        price: Number(service.price) || 0,
                    }));
                }

                // Ensure total is a number
                parsed.total = Number(parsed.total) || 0;

                setBookingData(parsed);

                // Clear the stored data after reading (only if successful)
                sessionStorage.removeItem('bookingConfirmationData');

                // Trigger animation after mount
                setTimeout(() => setShowAnimation(true), 100);

                // Announce to screen readers
                const announcement = document.createElement('div');
                announcement.setAttribute('role', 'alert');
                announcement.setAttribute('aria-live', 'assertive');
                announcement.className = 'sr-only';
                announcement.textContent = 'Booking confirmed successfully!';
                document.body.appendChild(announcement);

                return () => {
                    if (document.body.contains(announcement)) {
                        document.body.removeChild(announcement);
                    }
                };
            } catch (error) {
                console.error('Error parsing booking data:', error);
                sessionStorage.removeItem('bookingConfirmationData');
                // Don't redirect automatically - show error state instead
                return;
            }
        }
        // If no booking data, don't redirect - just show loading/error state
        // The component will handle showing appropriate message
    }, []);

    if (!bookingData) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-white px-6">
                <div className="text-center max-w-md">
                    <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center bg-red-50">
                        <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </div>
                    <h2 className="mb-2 font-unbounded text-2xl font-semibold text-secondary-000">
                        Booking Not Found
                    </h2>
                    <p className="mb-6 text-base text-accent-80">
                        We couldn't find your booking information. Please complete a new booking.
                    </p>
                    <Button
                        onClick={() => router.push('/categories')}
                        className="bg-primary-100 text-white hover:bg-primary-100/90"
                    >
                        Browse Categories
                    </Button>
                </div>
            </div>
        );
    }

    const { vendor, services, date, time, total, paymentMethod, customerInfo } = bookingData;

    // Calculate total duration - sum up all service durations
    const calculateTotalDuration = () => {
        // Assuming duration is in format like "30 minutes" or "1 hour"
        // For now, just show the first service duration or combine them
        if (services.length === 1) {
            return services[0].duration;
        }
        // If multiple services, you might want to calculate total
        return services.map((s: any) => s.duration).join(', ');
    };

    const totalDuration = calculateTotalDuration();

    const getPaymentMethodLabel = () => {
        switch (paymentMethod) {
            case 'venue':
                return 'Pay at Venue';
            case 'online':
                return 'Paid Online';
            case 'wallet':
                return 'Paid via Wallet';
            default:
                return paymentMethod;
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="flex flex-col min-h-screen bg-white"
        >
            <section className="py-16 flex-1">
                <div className="mx-auto max-w-[850px] px-4 md:px-6 lg:px-24">
                    {/* Success Animation */}
                    <div className="text-center mb-8">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={showAnimation ? { scale: 1 } : { scale: 0 }}
                            transition={{ duration: 0.25, ease: 'easeOut' }}
                            className="inline-flex items-center justify-center w-20 h-20 mb-6 rounded-full bg-green-50"
                        >
                            <CheckCircle
                                className="w-12 h-12 text-green-600"
                                strokeWidth={2.5}
                            />
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={showAnimation ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                            transition={{ duration: 0.3, delay: 0.15 }}
                            className="mb-3 font-unbounded text-3xl leading-10 font-semibold text-secondary-000"
                        >
                            Booking Confirmed!
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={showAnimation ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                            transition={{ duration: 0.3, delay: 0.2 }}
                            className="mb-2 text-base leading-6 text-accent-80"
                        >
                            Your appointment with <strong className="text-secondary-000">{vendor.name}</strong> is confirmed for{' '}
                            <strong className="text-secondary-000">
                                {date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })} at {time}
                            </strong>
                        </motion.p>

                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={showAnimation ? { opacity: 1 } : { opacity: 0 }}
                            transition={{ duration: 0.3, delay: 0.25 }}
                            className="text-sm text-accent-80"
                        >
                            A confirmation email has been sent to <strong>{customerInfo.email}</strong>
                        </motion.p>
                    </div>

                    {/* Booking Details Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={showAnimation ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                        transition={{ duration: 0.3, delay: 0.3 }}
                    >
                        <Card className="rounded-2xl border border-accent-20 bg-[#F8F5F2] shadow-[0_8px_24px_rgba(35,19,5,0.06)]">
                            <CardContent className="p-6 lg:p-8">
                                {/* Services Booked */}
                                <div className="mb-6 pb-6 border-b border-accent-20">
                                    {services.map((service: any, index: number) => (
                                        <div
                                            key={service.id}
                                            className={cn(
                                                "flex items-start justify-between gap-4",
                                                index > 0 && "mt-4"
                                            )}
                                        >
                                            <div className="flex-1 min-w-0">
                                                <p className="mb-1.5 text-base font-semibold text-secondary-000">
                                                    {service.name}
                                                </p>
                                                <div className="flex items-center gap-1.5">
                                                    <Clock className="h-3.5 w-3.5 text-accent-60" />
                                                    <span className="text-sm text-accent-80">
                                                        {service.duration}
                                                    </span>
                                                </div>
                                            </div>
                                            <p className="text-lg font-semibold text-primary-100">
                                                ${service.price.toFixed(2)}
                                            </p>
                                        </div>
                                    ))}
                                </div>

                                {/* Appointment Details */}
                                <div className="grid md:grid-cols-2 gap-6 mb-6 pb-6 border-b border-accent-20">
                                    <div>
                                        <div className="flex items-center gap-2 mb-2">
                                            <Calendar className="h-4 w-4 text-accent-60" />
                                            <span className="text-xs font-semibold text-accent-80 uppercase tracking-wider">
                                                Date
                                            </span>
                                        </div>
                                        <p className="text-base text-secondary-000">
                                            {date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                                        </p>
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 mb-2">
                                            <Clock className="h-4 w-4 text-accent-60" />
                                            <span className="text-xs font-semibold text-accent-80 uppercase tracking-wider">
                                                Time
                                            </span>
                                        </div>
                                        <p className="text-base text-secondary-000">
                                            {time}
                                        </p>
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 mb-2">
                                            <Clock className="h-4 w-4 text-accent-60" />
                                            <span className="text-xs font-semibold text-accent-80 uppercase tracking-wider">
                                                Duration
                                            </span>
                                        </div>
                                        <p className="text-base text-secondary-000">
                                            {totalDuration}
                                        </p>
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 mb-2">
                                            <CreditCard className="h-4 w-4 text-accent-60" />
                                            <span className="text-xs font-semibold text-accent-80 uppercase tracking-wider">
                                                Payment
                                            </span>
                                        </div>
                                        <p className="text-base text-secondary-000">
                                            {getPaymentMethodLabel()}
                                        </p>
                                    </div>
                                </div>

                                {/* Total */}
                                <div className="flex items-center justify-between">
                                    <span className="text-lg font-semibold text-secondary-000">
                                        Total Amount
                                    </span>
                                    <span className="font-unbounded text-2xl leading-8 font-semibold text-primary-100">
                                        ${total.toFixed(2)}
                                    </span>
                                </div>

                                {/* Customer Notes */}
                                {customerInfo.notes && (
                                    <div className="mt-6 pt-6 border-t border-accent-20">
                                        <h4 className="mb-2 text-sm font-semibold text-accent-80 uppercase tracking-wider">
                                            Your Notes
                                        </h4>
                                        <p className="text-sm text-secondary-000">
                                            {customerInfo.notes}
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Actions */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={showAnimation ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                        transition={{ duration: 0.3, delay: 0.4 }}
                        className="flex flex-col sm:flex-row items-center gap-4 mt-8 justify-between"
                    >
                        <Button
                            className="bg-primary-100 text-white hover:bg-primary-100/90 h-12 px-8 text-base font-semibold rounded-xl cursor-pointer flex-1 "
                            onClick={() => {
                                // TODO: Navigate to dashboard/appointments
                                router.push('/dashboard?tab=appointments');
                            }}
                        >
                            View Appointment Details
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => {
                                router.push(`/categories/${vendor.id}`);
                            }}
                            className="bg-transparent text-base font-semibold text-secondary-000 hover:text-primary-100 transition-colors border border-accent-20 rounded-xl px-8 h-12 flex-1 cursor-pointer "
                        >
                            Book Another Service
                        </Button>
                    </motion.div>

                    {paymentMethod === 'wallet' && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={showAnimation ? { opacity: 1 } : { opacity: 0 }}
                            transition={{ duration: 0.3, delay: 0.5 }}
                            className="text-center mt-4"
                        >
                            <Button
                                variant="ghost"
                                onClick={() => {
                                    router.push('/dashboard?tab=wallet');
                                }}
                            >
                                Go to Wallet
                            </Button>
                        </motion.div>
                    )}
                </div>
            </section>
        </motion.div>
    );
}

