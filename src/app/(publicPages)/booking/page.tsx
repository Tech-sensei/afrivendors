"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { useAppSelector } from "@/store/hooks";
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
import { useWallet } from "@/services/useTransactions";
import http from "@/lib/http";

function BookingPageContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const user = useAppSelector((state) => state.auth.user);
    const queryClient = useQueryClient();

    const vendorId = searchParams.get('vendorId');
    const serviceIdsParam = searchParams.get('serviceIds');

    const [date, setDate] = useState<Date | undefined>(undefined);
    const [selectedTime, setSelectedTime] = useState<string>("");
    const [paymentMethod, setPaymentMethod] = useState<"online" | "wallet">("online");
    const [fundWalletOpen, setFundWalletOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [contactFormData, setContactFormData] = useState({
        name: "",
        email: "",
        phone: "",
        notes: "",
    });

    // Pre-fill contact form from user profile
    useEffect(() => {
        if (!user) return;
        const fullName = `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim();
        setContactFormData((prev) => ({
            ...prev,
            name: fullName || prev.name,
            email: user.email || prev.email,
            phone: user.phoneNumber || prev.phone,
        }));
    }, [user]);

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

    const { data: wallet, isLoading: walletLoading } = useWallet();
    const walletBalance = wallet?.balance ?? 0;

    const totalPrice = selectedServices.reduce((sum, service) => sum + (service.price || 0), 0);
    const hasInsufficientFunds = paymentMethod === "wallet" && totalPrice > walletBalance;

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
        if (paymentMethod === "wallet" && hasInsufficientFunds) return false;
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

        try {
            const payload = {
                vendorId: Number(vendorId),
                serviceIds: serviceIdsParam!.split(',').map(Number),
                date: date!.toISOString().split('T')[0],   // "2026-04-20"
                time: selectedTime,                          // "14:30"
                paymentMethod,
                specificRequest: contactFormData.notes,
            };

            const { data } = await http.post('/appointments', payload);
            const { appointment, checkoutUrl } = data;

            // Online → redirect to Stripe checkout
            if (paymentMethod === 'online' && checkoutUrl) {
                window.location.href = checkoutUrl;
                return;
            }

            // Wallet → store data and go to confirmation page
            const bookingData = {
                vendor: {
                    id: vendor.id,
                    name: vendor.name,
                    location: vendor.location,
                    image: vendor.bannerImage,
                },
                services: (appointment.services as any[]).map((s) => ({
                    id: s.id,
                    name: s.serviceName,
                    price: Number(s.price) || 0,
                    duration: s.duration,
                })),
                date: date!.toISOString(),
                time: selectedTime,
                total: appointment.totalAmount,
                paymentMethod,
                customerInfo: {
                    name: contactFormData.name,
                    email: contactFormData.email,
                    phone: contactFormData.phone,
                    notes: contactFormData.notes,
                },
            };

            // Wallet balance and transactions are now stale — invalidate before navigating
            queryClient.invalidateQueries({ queryKey: ["wallet"] });
            queryClient.invalidateQueries({ queryKey: ["transactions"] });
            queryClient.invalidateQueries({ queryKey: ["user-appointments"] });

            sessionStorage.setItem('bookingConfirmationData', JSON.stringify(bookingData));
            router.push('/booking/confirmation');
        } catch (error: any) {
            toast.error(
                error?.response?.data?.message ||
                'Failed to create appointment. Please try again.'
            );
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
                                walletBalance={walletBalance}
                                walletLoading={walletLoading}
                                hasInsufficientFunds={hasInsufficientFunds}
                                onPaymentMethodChange={setPaymentMethod}
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