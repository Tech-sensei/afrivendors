"use client";

import { useParams, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import {
    Star,
    MapPin,
    Clock,
    Phone,
    Mail,
    Heart,
    Loader2,
    Share2,
    ChevronLeft,
    Check,
    FileText,
    Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Drawer } from "@/app/(dashboard)/Drawer";
import { formatVendorPrice, getPublicVendorById } from "@/services/vendor";
import { createVendorReview } from "@/services/vendorReviews";
import { useFavoritesAPI } from "@/services/useFavoritesAPI";
import { useAppSelector } from "@/store/hooks";
import type { User } from "@/types/auth";
import type { VendorDetailReview } from "@/types/vendor";
import { ReviewForm } from "@/components/views/ReviewForm";
import { ReviewsList } from "@/components/views/ReviewsList";
import { VendorOpeningHours } from "@/components/views/VendorOpeningHours";

function profileDisplayName(user: User | null | undefined) {
    if (!user) return "";
    return `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim();
}

function isReviewFromCurrentUser(
    review: VendorDetailReview,
    user: User | null | undefined
): boolean {
    if (!user) return false;
    if (review.reviewerUserId != null && user.id != null) {
        return review.reviewerUserId === user.id;
    }
    const name = profileDisplayName(user);
    if (!name) return false;
    return review.author.trim().toLowerCase() === name.toLowerCase();
}

const VendorDetailPage = () => {
    const params = useParams();
    const router = useRouter();
    const vendorId = params?.id as string;

    const [selectedServices, setSelectedServices] = useState<string[]>([]);
    const [isCustomRequestDrawerOpen, setIsCustomRequestDrawerOpen] = useState(false);
    const [showReviewForm, setShowReviewForm] = useState(false);
    const { addToFavorites, isFavorite, isAddingFavoriteFor } = useFavoritesAPI();
    const { isAuthenticated, isLoadingUser, user } = useAppSelector((state) => state.auth);
    const queryClient = useQueryClient();

    const { data: vendor, isLoading, isError } = useQuery({
        queryKey: ["public-vendor", vendorId],
        queryFn: () => getPublicVendorById(vendorId),
        enabled: !!vendorId,
    });

    const submitReviewMutation = useMutation({
        mutationFn: (payload: { rating: number; comment: string }) => {
            if (!vendor?.numericId) throw new Error("Missing vendor");
            return createVendorReview(vendor.numericId, payload);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["public-vendor", vendorId] });
            toast.success("Review submitted successfully!");
            setShowReviewForm(false);
        },
        onError: (error: unknown) => {
            const err = error as { response?: { data?: { message?: string | string[]; responseMessage?: string } } };
            const msg = err?.response?.data?.message;
            const text = Array.isArray(msg) ? msg.join(", ") : msg || err?.response?.data?.responseMessage;
            toast.error(text || "Could not submit review. Please try again.");
        },
    });

    const services = vendor?.services || [];
    const galleryImages = vendor?.gallery?.length ? vendor.gallery : vendor?.bannerImage ? [vendor.bannerImage] : [];
    const vendorIdNumber = vendor?.numericId;

    const mergedReviews = useMemo(() => {
        return (vendor?.reviews || []).map((review) => ({
            ...review,
            avatar: review.author
                .split(" ")
                .map((word) => word.charAt(0))
                .join("")
                .toUpperCase()
                .slice(0, 2),
            isUserReview: isReviewFromCurrentUser(review, user),
        }));
    }, [vendor?.reviews, user]);

    const hasUserReview = useMemo(
        () => mergedReviews.some((r) => r.isUserReview),
        [mergedReviews]
    );

    const handleSaveReview = async (reviewData: { rating: number; comment: string }) => {
        await submitReviewMutation.mutateAsync(reviewData);
    };

    const posterName = profileDisplayName(user);

    const handleBooking = () => {
        if (selectedServices.length === 0) {
            toast.error("Please select at least one service");
            return;
        }

        if (!isAuthenticated) {
            const destination = `/booking?vendorId=${vendorId}&serviceIds=${selectedServices.join(",")}`;
            router.push(`/sign-in?redirect=${encodeURIComponent(destination)}`);
            return;
        }

        const serviceIds = selectedServices.join(",");
        router.push(`/booking?vendorId=${vendorId}&serviceIds=${serviceIds}`);
    };

    const totalPrice = selectedServices.reduce((sum, serviceId) => {
        const service = services.find((item) => item.id === serviceId);
        return sum + (service?.price || 0);
    }, 0);

    const toggleService = (serviceId: string) => {
        if (selectedServices.includes(serviceId)) {
            setSelectedServices(selectedServices.filter((id) => id !== serviceId));
            return;
        }

        setSelectedServices([...selectedServices, serviceId]);
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-white px-6">
                <h1 className="font-unbounded text-2xl font-semibold text-secondary-000 mb-4">
                    Loading vendor...
                </h1>
            </div>
        );
    }

    if (!vendor || isError) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-white px-6">
                <h1 className="font-unbounded text-4xl font-semibold text-secondary-000 mb-4">
                    404
                </h1>
                <p className=" text-lg text-accent-80 mb-8">
                    Vendor not found.
                </p>
                <Button
                    onClick={() => router.push("/categories")}
                    className="bg-primary-100 text-white hover:bg-primary-100/90"
                >
                    Go back to Categories
                </Button>
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen bg-white">
            <div className="mx-auto py-4 px-4 md:px-6 lg:px-24 max-w-[1440px] w-full">
                <Button
                    variant="ghost"
                    onClick={() => router.push("/categories")}
                    className="gap-2 text-sm font-semibold text-secondary-000 hover:bg-accent-10"
                >
                    <ChevronLeft className="h-4 w-4" />
                    Back to Browse
                </Button>
            </div>

            <section className="relative h-64 lg:h-96 overflow-hidden bg-accent-10 container">
                <Image
                    src={vendor.bannerImage}
                    alt={vendor.name}
                    fill
                    sizes="100vw"
                    className="object-cover"
                    priority
                />
            </section>

            <section className="py-8 lg:py-12 px-4 md:px-6 lg:px-24">
                <div className="mx-auto max-w-[1440px]">
                    <div className="flex flex-col lg:flex-row gap-8">
                        <div className="flex-1">
                            <div className="mb-6">
                                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                                    <div className="flex-1">
                                        <h2 className="mb-2 font-unbounded text-3xl lg:text-4xl font-semibold text-secondary-000 leading-tight">
                                            {vendor.name}
                                        </h2>
                                        <p className="mb-4 text-base text-accent-80">
                                            {vendor.category}
                                        </p>
                                        <div className="flex flex-wrap gap-4 items-center">
                                            <div className="flex items-center gap-2">
                                                <div className="flex items-center gap-1">
                                                    <Star className="h-5 w-5 text-primary-100 fill-primary-100" />
                                                    <span className="text-base font-semibold text-secondary-000">
                                                        {vendor.rating.toFixed(1)}
                                                    </span>
                                                </div>
                                                <span className="text-sm text-accent-80">
                                                    ({vendor.reviewCount} reviews)
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <MapPin className="h-4 w-4 text-accent-80" />
                                                <span className="text-sm text-secondary-000">
                                                    {vendor.location}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        {!isLoadingUser && (
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                disabled={isAddingFavoriteFor(vendor.id)}
                                                aria-busy={isAddingFavoriteFor(vendor.id)}
                                                onClick={() => addToFavorites(vendor)}
                                                className="rounded-[18px] w-11 h-11 border-accent-30 hover:bg-accent-10 disabled:opacity-80 disabled:cursor-wait"
                                            >
                                                {isAddingFavoriteFor(vendor.id) ? (
                                                    <Loader2
                                                        className="h-5 w-5 animate-spin text-secondary-000"
                                                        aria-hidden
                                                    />
                                                ) : (
                                                    <Heart
                                                        className={`h-5 w-5 ${
                                                            isAuthenticated && isFavorite(vendor.id)
                                                                ? "text-primary-100 fill-primary-100"
                                                                : "text-secondary-000"
                                                        }`}
                                                    />
                                                )}
                                            </Button>
                                        )}
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() => {
                                                navigator.clipboard.writeText(window.location.href);
                                                toast.success("Link copied to clipboard!");
                                            }}
                                            className="rounded-[18px] w-11 h-11 border-accent-30 hover:bg-accent-10"
                                        >
                                            <Share2 className="h-5 w-5 text-secondary-000" />
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            <Tabs defaultValue="services" className="w-full">
                                <TabsList className="w-full justify-start mb-6 overflow-x-auto bg-[#fbf7f4] rounded-xl p-1">
                                    <TabsTrigger value="services" className="text-sm font-semibold rounded-lg data-[state=active]:bg-white data-[state=active]:text-secondary-000">
                                        Services
                                    </TabsTrigger>
                                    <TabsTrigger value="about" className="text-sm font-semibold rounded-lg data-[state=active]:bg-white data-[state=active]:text-secondary-000">
                                        About
                                    </TabsTrigger>
                                    <TabsTrigger value="reviews" className="text-sm font-semibold rounded-lg data-[state=active]:bg-white data-[state=active]:text-secondary-000">
                                        Reviews
                                    </TabsTrigger>
                                    <TabsTrigger value="gallery" className="text-sm font-semibold rounded-lg data-[state=active]:bg-white data-[state=active]:text-secondary-000">
                                        Gallery
                                    </TabsTrigger>
                                </TabsList>

                                <TabsContent value="services" className="space-y-4">
                                    {services.map((service) => {
                                        const isSelected = selectedServices.includes(service.id);

                                        return (
                                            <Card
                                                key={service.id}
                                                className={`cursor-pointer transition-all duration-300 rounded-2xl border-2 py-0 ${
                                                    isSelected ? "border-primary-100 shadow-md bg-primary-100/5" : "border-accent-20 hover:shadow-md bg-white"
                                                }`}
                                                onClick={() => toggleService(service.id)}
                                            >
                                                <CardContent className="p-5">
                                                    <div className="flex items-start justify-between gap-4">
                                                        <div className="flex items-start gap-3 flex-1">
                                                            <div
                                                                className={`h-5 w-5 rounded border-2 flex items-center justify-center transition-all mt-1 shrink-0 ${
                                                                    isSelected ? "border-primary-100 bg-primary-100" : "border-accent-30 bg-transparent"
                                                                }`}
                                                            >
                                                                {isSelected && <Check className="h-3 w-3 text-white" />}
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <h4 className="mb-1 text-base font-semibold text-secondary-000">
                                                                    {service.name}
                                                                </h4>
                                                                <p className="mb-2 text-sm text-accent-80 leading-relaxed">
                                                                    {service.description}
                                                                </p>
                                                                <div className="flex items-center gap-2">
                                                                    <Clock className="h-3.5 w-3.5 text-accent-80" />
                                                                    <span className="text-xs text-accent-80">
                                                                        {service.duration}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="text-right shrink-0">
                                                            <p className="text-lg font-semibold text-primary-100">
                                                                {formatVendorPrice(service.price)}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        );
                                    })}
                                </TabsContent>

                                <TabsContent value="about">
                                    <Card className="rounded-2xl border border-accent-20 py-0">
                                        <CardContent className="p-6 space-y-6">
                                            <p className="text-base text-secondary-000 leading-relaxed">
                                                {vendor.about}
                                            </p>
                                            <div className="space-y-3">
                                                <div className="flex items-center gap-3">
                                                    <MapPin className="h-5 w-5 text-accent-80" />
                                                    <span className="text-sm text-secondary-000">
                                                        {vendor.location}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <Phone className="h-5 w-5 text-accent-80" />
                                                    <span className="text-sm text-secondary-000">
                                                        {vendor.phoneNumber}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <Mail className="h-5 w-5 text-accent-80" />
                                                    <span className="text-sm text-secondary-000">
                                                        {vendor.email}
                                                    </span>
                                                </div>
                                                {vendor.website && (
                                                    <div className="flex items-center gap-3">
                                                        <Globe className="h-5 w-5 text-accent-80" />
                                                        <a
                                                            href={vendor.website}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            className="text-sm text-primary-100 underline-offset-2 hover:underline"
                                                        >
                                                            {vendor.website}
                                                        </a>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="pt-4 border-t border-accent-20">
                                                <h4 className="mb-4 text-base font-semibold text-secondary-000">
                                                    Opening hours
                                                </h4>
                                                <VendorOpeningHours
                                                    schedule={vendor.openingHoursSchedule}
                                                    fallbackText={vendor.openingHours}
                                                />
                                            </div>
                                        </CardContent>
                                    </Card>
                                </TabsContent>

                                <TabsContent value="reviews" className="space-y-6">
                                    <div className="flex items-center justify-between gap-4">
                                        <div>
                                            <h3 className="mb-2 text-xl font-semibold text-secondary-000">
                                                Customer Reviews
                                            </h3>
                                            <div className="flex items-center gap-2">
                                                <div className="flex items-center gap-1">
                                                    <Star className="h-5 w-5 text-primary-100 fill-primary-100" />
                                                    <span className="text-base font-semibold text-secondary-000">
                                                        {vendor.rating.toFixed(1)}
                                                    </span>
                                                </div>
                                                <span className="text-sm text-accent-80">
                                                    ({mergedReviews.length} {mergedReviews.length === 1 ? "review" : "reviews"})
                                                </span>
                                            </div>
                                        </div>

                                        {isAuthenticated &&
                                            !hasUserReview &&
                                            !showReviewForm && (
                                                <Button
                                                    onClick={() => setShowReviewForm(true)}
                                                    className="gap-2 bg-primary-100 text-white hover:bg-primary-100/90 rounded-[18px] h-11 text-sm font-semibold"
                                                >
                                                    Write Review
                                                </Button>
                                            )}
                                    </div>

                                    {showReviewForm && vendorIdNumber && (
                                        <ReviewForm
                                            vendorId={vendorIdNumber}
                                            posterDisplayName={posterName || undefined}
                                            onSave={handleSaveReview}
                                            isSubmitting={submitReviewMutation.isPending}
                                            onCancel={() => {
                                                setShowReviewForm(false);
                                            }}
                                        />
                                    )}

                                    <ReviewsList reviews={mergedReviews} />
                                </TabsContent>

                                <TabsContent value="gallery">
                                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                        {galleryImages.map((image, index) => (
                                            <div key={`${image}-${index}`} className="aspect-square overflow-hidden rounded-2xl">
                                                <Image
                                                    src={image}
                                                    alt={`Gallery ${index + 1}`}
                                                    width={300}
                                                    height={300}
                                                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300 cursor-pointer"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </TabsContent>
                            </Tabs>
                        </div>

                        <aside className="lg:w-96 shrink-0">
                            <Card className="sticky top-24 rounded-3xl border border-accent-20 shadow-lg">
                                <CardContent className="p-6">
                                    <h4 className="mb-4 font-unbounded text-xl font-semibold text-secondary-000">
                                        Book an Appointment
                                    </h4>
                                    {selectedServices.length > 0 ? (
                                        <div className="space-y-4 mb-6">
                                            <div className="space-y-2">
                                                {selectedServices.map((serviceId) => {
                                                    const service = services.find((item) => item.id === serviceId);
                                                    if (!service) return null;

                                                    return (
                                                        <div
                                                            key={serviceId}
                                                            className="flex items-center justify-between py-2 border-b border-accent-20"
                                                        >
                                                            <span className="text-sm text-secondary-000">
                                                                {service.name}
                                                            </span>
                                                            <span className="text-sm font-semibold text-primary-100">
                                                                {formatVendorPrice(service.price)}
                                                            </span>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                            <div className="flex items-center justify-between pt-2 border-t-2 border-accent-20">
                                                <span className="text-base font-semibold text-secondary-000">
                                                    Total
                                                </span>
                                                <span className="text-xl font-semibold text-primary-100">
                                                    {formatVendorPrice(totalPrice)}
                                                </span>
                                            </div>
                                        </div>
                                    ) : (
                                        <p className="mb-6 text-center py-8 text-sm text-accent-80 bg-secondary-800 rounded-xl">
                                            Select services to book
                                        </p>
                                    )}

                                    <Button
                                        onClick={handleBooking}
                                        disabled={selectedServices.length === 0}
                                        className="w-full rounded-[18px] h-12 bg-primary-100 text-base font-semibold text-white hover:bg-primary-100/90 disabled:cursor-not-allowed disabled:opacity-100 disabled:bg-[#E9C3A7] disabled:text-white"
                                    >
                                        Continue to Booking
                                    </Button>
                                    <div className="mt-4 text-center text-xs text-accent-80">
                                        Free cancellation up to 24 hours before
                                    </div>

                                    <div className="mt-6 pt-6 border-t border-accent-20">
                                        <Button
                                            onClick={() => setIsCustomRequestDrawerOpen(true)}
                                            className="w-full bg-accent-10 text-secondary-000 hover:bg-accent-20 rounded-xl h-12 text-base font-semibold gap-2"
                                        >
                                            <FileText className="h-5 w-5" />
                                            Custom Request
                                        </Button>
                                        <div className="mt-3 text-center text-xs text-accent-80">
                                            Need something specific? Request a custom service
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </aside>
                    </div>
                </div>
            </section>

            <Drawer
                open={isCustomRequestDrawerOpen}
                onOpenChange={setIsCustomRequestDrawerOpen}
                title="Custom Request"
                description="Tell us about your specific needs"
                size="md"
            >
                <div className="space-y-4">
                    <p className="text-sm text-accent-80">
                        This is where the custom request form will be displayed.
                    </p>
                </div>
            </Drawer>
        </div>
    );
};

export default VendorDetailPage;
