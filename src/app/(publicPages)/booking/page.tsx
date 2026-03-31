"use client";

import { Suspense, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "motion/react";
import { toast } from "sonner";
import { EmptyState } from "@/components/booking/EmptyState";
import { SelectedServicesCard } from "@/components/booking/SelectedServicesCard";
import { DateTimeSelection } from "@/components/booking/DateTimeSelection";
import { ContactInformationForm } from "@/components/booking/ContactInformationForm";
import { PaymentMethodSection } from "@/components/booking/PaymentMethodSection";
import { BookingSummary } from "@/components/booking/BookingSummary";
import { FundWalletDrawer } from "@/components/booking/FundWalletDrawer";
import { getPublicVendorById } from "@/services/vendor";

const WALLET_BALANCE = 430.00;

function BookingPageContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const vendorId = searchParams.get('vendorId');
    const serviceIdsParam = searchParams.get('serviceIds');

    const [date, setDate] = useState<Date | undefined>(undefined);
    const [selectedTime, setSelectedTime] = useState<string>("");
    const [paymentMethod, setPaymentMethod] = useState<"venue" | "online" | "wallet">("venue");
    const [fundWalletOpen, setFundWalletOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [contactFormData, setContactFormData] = useState({
        name: "",
        email: "",
        phone: "",
        notes: "",
    });

    const [cardFormData, setCardFormData] = useState({
        cardNumber: "",
        cardExpiry: "",
        cardCvc: "",
        cardName: "",
    });

    const { data: vendor, isLoading, isError } = useQuery({
        queryKey: ["booking-vendor", vendorId],
        queryFn: () => getPublicVendorById(vendorId as string),
        enabled: !!vendorId,
    });

    const selectedServices = useMemo(() => {
        if (!vendor || !serviceIdsParam) return [];

        const serviceIds = serviceIdsParam.split(",");
        return vendor.services.filter((service) => serviceIds.includes(service.id));
    }, [vendor, serviceIdsParam]);

    const totalPrice = selectedServices.reduce((sum, service) => sum + (service.price || 0), 0);
    const hasInsufficientFunds = paymentMethod === "wallet" && totalPrice > WALLET_BALANCE;

    const handleRemoveService = (serviceId: string) => {
        const serviceIds = selectedServices
            .filter((service) => service.id !== serviceId)
            .map((service) => service.id);

        if (serviceIds.length === 0) {
            router.push(`/booking?vendorId=${vendorId}`);
            return;
        }

        router.push(`/booking?vendorId=${vendorId}&serviceIds=${serviceIds.join(",")}`);
    };

    const isFormValid = () => {
        if (selectedServices.length === 0) return false;
        if (!date || !selectedTime) return false;
        if (!contactFormData.name || !contactFormData.email || !contactFormData.phone) return false;

        if (paymentMethod === "online") {
            if (!cardFormData.cardNumber || !cardFormData.cardExpiry || !cardFormData.cardCvc || !cardFormData.cardName) {
                return false;
            }
        }

        if (paymentMethod === "wallet" && hasInsufficientFunds) {
            return false;
        }

        return true;
    };

    const handleSubmit = async () => {
        if (!isFormValid()) {
            toast.error('Please fill in all required fields');
            return;
        }

        if (!vendor) {
            toast.error('Vendor details are unavailable. Please try again.');
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
                image: vendor.bannerImage,
            },
            services: selectedServices.map(service => ({
                id: service.id,
                name: service.name,
                price: Number(service.price) || 0,
                duration: service.duration,
            })),
            date: date ? date.toISOString() : null,
            time: selectedTime,
            total: Number(totalPrice) || 0,
            paymentMethod,
            customerInfo: {
                name: contactFormData.name,
                email: contactFormData.email,
                phone: contactFormData.phone,
                notes: contactFormData.notes
            }
        };

        toast.success(`Appointment confirmed with ${vendor.name} for ${date?.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })} at ${selectedTime}!`);

        try {
            sessionStorage.setItem('bookingConfirmationData', JSON.stringify(bookingData));
            setTimeout(() => {
                router.push('/booking/confirmation');
            }, 100);
        } catch (error) {
            console.error('Error storing booking data:', error);
            toast.error('Failed to save booking data. Please try again.');
            setIsSubmitting(false);
        }
    };

    if (!vendorId) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-white">
                <div className="text-center">
                    <h2 className="mb-2 font-unbounded text-2xl font-semibold text-secondary-000">
                        Vendor ID is required
                    </h2>
                    <Button onClick={() => router.push("/categories")}>Back to browse</Button>
                </div>
            </div>
        );
    }

    if (isLoading) {
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

    if (!vendor || isError) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-white">
                <div className="text-center">
                    <h2 className="mb-2 font-unbounded text-2xl font-semibold text-secondary-000">
                        Vendor not found
                    </h2>
                    <Button onClick={() => router.push("/categories")}>Back to browse</Button>
                </div>
            </div>
        );
    }

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
                    <Button
                        variant="ghost"
                        onClick={() => router.push(`/categories/${vendorId}`)}
                        className="gap-2 text-sm font-semibold text-secondary-000 hover:bg-accent-10 mb-6"
                    >
                        <ChevronLeft className="h-4 w-4" />
                        Back to Vendor
                    </Button>

                    <div className="mb-8">
                        <h1 className="mb-2 font-unbounded text-4xl leading-11 font-semibold text-secondary-000">
                            Book Your Appointment
                        </h1>
                        <p className="text-base text-accent-80">
                            Schedule your visit with {vendor.name}
                        </p>
                    </div>

                    <div className="grid lg:grid-cols-[1fr_384px] gap-6">
                        <div className="space-y-6">
                            <SelectedServicesCard
                                vendor={{
                                    id: vendor.id,
                                    name: vendor.name,
                                    location: vendor.location,
                                    image: vendor.bannerImage,
                                }}
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

export default function BookingPage() {
    return (
        <Suspense
            fallback={
                <div className="flex flex-col items-center justify-center min-h-screen bg-white">
                    <div className="text-center">
                        <h2 className="mb-2 font-unbounded text-2xl font-semibold text-secondary-000">
                            Loading...
                        </h2>
                    </div>
                </div>
            }
        >
            <BookingPageContent />
        </Suspense>
    );
}