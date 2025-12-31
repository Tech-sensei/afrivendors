"use client";

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'motion/react';
import { toast } from 'sonner';
import { vendors } from '@/data/vendorsData';
import { EmptyState } from '@/components/booking/EmptyState';
import { SelectedServicesCard } from '@/components/booking/SelectedServicesCard';
import { DateTimeSelection } from '@/components/booking/DateTimeSelection';
import { ContactInformationForm } from '@/components/booking/ContactInformationForm';
import { PaymentMethodSection } from '@/components/booking/PaymentMethodSection';
import { BookingSummary } from '@/components/booking/BookingSummary';
import { FundWalletDrawer } from '@/components/booking/FundWalletDrawer';

// Mock wallet balance
const WALLET_BALANCE = 430.00;

export default function BookingPage() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const vendorId = searchParams.get('vendorId');
    const serviceIdsParam = searchParams.get('serviceIds');

    const [vendor, setVendor] = useState<any>(null);
    const [selectedServices, setSelectedServices] = useState<any[]>([]);
    const [date, setDate] = useState<Date | undefined>(undefined);
    const [selectedTime, setSelectedTime] = useState<string>('');
    const [paymentMethod, setPaymentMethod] = useState<'venue' | 'online' | 'wallet'>('venue');
    const [fundWalletOpen, setFundWalletOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [contactFormData, setContactFormData] = useState({
        name: '',
        email: '',
        phone: '',
        notes: '',
    });

    const [cardFormData, setCardFormData] = useState({
        cardNumber: '',
        cardExpiry: '',
        cardCvc: '',
        cardName: '',
    });

    // Load vendor and services from URL params
    useEffect(() => {
        if (!vendorId) {
            toast.error('Vendor ID is required');
            router.push('/categories');
            return;
        }

        const foundVendor = vendors.find((v) => v.id === vendorId);
        if (!foundVendor) {
            toast.error('Vendor not found');
            router.push('/categories');
            return;
        }

        setVendor(foundVendor);

        // Parse selected service IDs from URL
        if (serviceIdsParam) {
            const serviceIds = serviceIdsParam.split(',');
            const services = foundVendor.services?.filter((service) =>
                serviceIds.includes(service.id)
            ) || [];
            setSelectedServices(services);
        }
    }, [vendorId, serviceIdsParam, router]);

    // Calculate total
    const totalPrice = selectedServices.reduce((sum, service) => sum + (service.price || 0), 0);
    const hasInsufficientFunds = paymentMethod === 'wallet' && totalPrice > WALLET_BALANCE;

    const handleRemoveService = (serviceId: string) => {
        setSelectedServices(selectedServices.filter(s => s.id !== serviceId));
    };

    const isFormValid = () => {
        if (selectedServices.length === 0) return false;
        if (!date || !selectedTime) return false;
        if (!contactFormData.name || !contactFormData.email || !contactFormData.phone) return false;

        if (paymentMethod === 'online') {
            if (!cardFormData.cardNumber || !cardFormData.cardExpiry || !cardFormData.cardCvc || !cardFormData.cardName) {
                return false;
            }
        }

        if (paymentMethod === 'wallet' && hasInsufficientFunds) {
            return false;
        }

        return true;
    };

    const handleSubmit = async () => {
        if (!isFormValid()) {
            toast.error('Please fill in all required fields');
            return;
        }

        setIsSubmitting(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));

        const bookingData = {
            vendor: {
                id: vendor.id,
                name: vendor.name,
                location: vendor.location,
                image: vendor.image,
            },
            services: selectedServices.map(service => ({
                id: service.id,
                name: service.name,
                price: Number(service.price) || 0, // Ensure price is a number
                duration: service.duration,
            })),
            date: date ? date.toISOString() : null, // Convert Date to ISO string for serialization
            time: selectedTime,
            total: Number(totalPrice) || 0, // Ensure total is a number
            paymentMethod,
            customerInfo: {
                name: contactFormData.name,
                email: contactFormData.email,
                phone: contactFormData.phone,
                notes: contactFormData.notes
            }
        };

        // Console log booking data for debugging
        console.log('📋 Booking Data (Formatted):', JSON.stringify(bookingData, null, 2));

        toast.success(`Appointment confirmed with ${vendor.name} for ${date?.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })} at ${selectedTime}!`);

        // Store booking data in sessionStorage for confirmation page
        try {
            sessionStorage.setItem('bookingConfirmationData', JSON.stringify(bookingData));
            // Small delay to ensure sessionStorage is written before navigation
            setTimeout(() => {
                router.push('/booking/confirmation');
            }, 100);
        } catch (error) {
            console.error('Error storing booking data:', error);
            toast.error('Failed to save booking data. Please try again.');
            setIsSubmitting(false);
        }
    };

    // Loading state
    if (!vendor) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-white">
                <div className="text-center">
                    <h2 className="mb-2 font-unbounded text-2xl font-semibold text-secondary-000">
                        Loading...
                    </h2>
                </div>
            </div>
        );
    }

    // Empty state
    if (selectedServices.length === 0) {
        return (
            <EmptyState
                vendorId={vendorId}
                onBack={() => router.push(`/categories/${vendorId}`)}
            />
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="flex flex-col min-h-screen bg-white"
        >


            {/* Main Content */}
            <section className="py-12 sm:py-16 px-6 sm:px-8 lg:px-24">
                <div className="max-w-[1440px] mx-auto">
                    {/* Header */}
                    <Button
                        variant="ghost"
                        onClick={() => router.push(`/categories/${vendorId}`)}
                        className="gap-2 text-sm font-semibold text-secondary-000 hover:bg-accent-10 mb-6"
                    >
                        <ChevronLeft className="h-4 w-4" />
                        Back to Vendor
                    </Button>

                    {/* Page Title */}
                    <div className="mb-8">
                        <h1 className="mb-2 font-unbounded text-4xl leading-[44px] font-semibold text-secondary-000">
                            Book Your Appointment
                        </h1>
                        <p className="text-base text-accent-80">
                            Schedule your visit with {vendor.name}
                        </p>
                    </div>

                    <div className="grid lg:grid-cols-[1fr_384px] gap-6">
                        {/* Left Column - Main Form */}
                        <div className="space-y-6">
                            <SelectedServicesCard
                                vendor={vendor}
                                selectedServices={selectedServices}
                                onRemoveService={handleRemoveService}
                                onAddService={() => router.push(`/categories/${vendorId}`)}
                            />

                            <DateTimeSelection
                                date={date}
                                selectedTime={selectedTime}
                                onDateChange={setDate}
                                onTimeChange={setSelectedTime}
                            />

                            <ContactInformationForm
                                formData={contactFormData}
                                onFormDataChange={(data) => setContactFormData({ ...contactFormData, ...data })}
                            />

                            <PaymentMethodSection
                                paymentMethod={paymentMethod}
                                totalPrice={totalPrice}
                                cardFormData={cardFormData}
                                hasInsufficientFunds={hasInsufficientFunds}
                                onPaymentMethodChange={setPaymentMethod}
                                onCardFormDataChange={(data) => setCardFormData({ ...cardFormData, ...data })}
                                onFundWallet={() => setFundWalletOpen(true)}
                            />
                        </div>

                        {/* Right Column - Sticky Summary */}
                        <BookingSummary
                            selectedServices={selectedServices}
                            date={date}
                            selectedTime={selectedTime}
                            paymentMethod={paymentMethod}
                            totalPrice={totalPrice}
                            isSubmitting={isSubmitting}
                            isFormValid={isFormValid()}
                            onSubmit={handleSubmit}
                        />
                    </div>
                </div>
            </section>

            <FundWalletDrawer
                isOpen={fundWalletOpen}
                onClose={() => setFundWalletOpen(false)}
            />
        </motion.div>
    );
}