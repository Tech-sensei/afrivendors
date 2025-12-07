"use client";

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Star, MapPin, Clock, Phone, Mail, Heart, Share2, ChevronLeft, Check, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { vendors } from '@/data/vendorsData';
import { toast } from 'sonner';
import { ReviewForm } from '@/components/views/ReviewForm';
import { ReviewsList } from '@/components/views/ReviewsList';
import { getVendorReviews, getUserReview, saveReview, updateReview, deleteReview } from '@/lib/reviewStorage';

const VendorDetailPage = () => {
    const params = useParams();
    const router = useRouter();
    const vendorId = params?.id as string;

    const [selectedServices, setSelectedServices] = useState<string[]>([]);
    const [isFavorited, setIsFavorited] = useState(false);
    const [reviews, setReviews] = useState<any[]>([]);
    const [userReview, setUserReview] = useState<any>(null);
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [editingReview, setEditingReview] = useState<any>(null);

    // Find the vendor by ID
    const vendor = vendors.find((v) => v.id === vendorId);

    // Convert vendor ID (string) to number for review storage
    // Using a simple hash function to convert string ID to number
    const getVendorIdAsNumber = (id: string): number => {
        let hash = 0;
        for (let i = 0; i < id.length; i++) {
            const char = id.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        return Math.abs(hash);
    };

    const vendorIdNumber = vendor ? getVendorIdAsNumber(vendor.id) : 0;

    // Default reviews for display
    const defaultReviews = [
        {
            id: 'default-1',
            author: 'Chioma Okafor',
            rating: 5,
            date: 'October 28, 2025',
            comment: 'Amazing service! The team really knows their craft. Everything exceeded my expectations.',
            avatar: 'CO',
        },
        {
            id: 'default-2',
            author: 'Ngozi Adebayo',
            rating: 5,
            date: 'October 15, 2025',
            comment: 'Professional, clean, and friendly environment. The results came out exactly how I wanted. Highly recommend!',
            avatar: 'NA',
        },
        {
            id: 'default-3',
            author: 'Fatima Hassan',
            rating: 4,
            date: 'October 2, 2025',
            comment: 'Great experience overall. Had to wait a bit longer than expected, but the final result was worth it.',
            avatar: 'FH',
        },
    ];

    // Load reviews on component mount
    useEffect(() => {
        if (vendor) {
            loadReviews();
        }
    }, [vendor?.id]);

    const loadReviews = () => {
        if (!vendor) return;

        const vendorReviews = getVendorReviews(vendorIdNumber);
        const userReviewData = getUserReview(vendorIdNumber);

        // Combine default reviews with user reviews
        const allReviews = [...defaultReviews, ...vendorReviews].map(review => ({
            ...review,
            isUserReview: userReviewData?.id === review.id,
        }));

        setReviews(allReviews);
        setUserReview(userReviewData);
    };

    const handleSaveReview = (reviewData: { rating: number; comment: string; author: string }) => {
        if (!vendor) return;

        if (editingReview) {
            // Update existing review
            const updated = updateReview(editingReview.id, reviewData.rating, reviewData.comment);
            if (updated) {
                toast.success('Review updated successfully!');
                loadReviews();
                setEditingReview(null);
                setShowReviewForm(false);
            }
        } else {
            // Save new review
            saveReview(vendorIdNumber, reviewData.author, reviewData.rating, reviewData.comment);
            toast.success('Review submitted successfully!');
            loadReviews();
            setShowReviewForm(false);
        }
    };

    const handleEditReview = (review: any) => {
        setEditingReview(review);
        setShowReviewForm(true);
    };

    const handleDeleteReview = (reviewId: string) => {
        const success = deleteReview(reviewId);
        if (success) {
            toast.success('Review deleted successfully!');
            loadReviews();
        }
    };

    const handleCancelReview = () => {
        setShowReviewForm(false);
        setEditingReview(null);
    };

    // If vendor not found, show 404 message
    if (!vendor) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-white px-6">
                <h1 className="font-unbounded text-4xl font-semibold text-secondary-000 mb-4">
                    404
                </h1>
                <p className=" text-lg text-accent-80 mb-8">
                    Vendor not found.
                </p>
                <Button
                    onClick={() => router.push('/categories')}
                    className="bg-primary-100 text-white hover:bg-primary-100/90"
                >
                    Go back to Categories
                </Button>
            </div>
        );
    }

    const services = vendor.services || [];

    // Gallery images - using vendor.jpeg for all vendors
    const galleryImages = Array(4).fill('/assets/images/vendor.jpeg');

    const handleBooking = () => {
        if (selectedServices.length === 0) {
            toast.error('Please select at least one service');
            return;
        }
        // TODO: Navigate to booking page
        toast.success('Redirecting to booking...');
    };

    const totalPrice = selectedServices.reduce((sum, serviceId) => {
        const service = services.find((s) => s.id === serviceId);
        return sum + (service?.price || 0);
    }, 0);

    const toggleService = (serviceId: string) => {
        if (selectedServices.includes(serviceId)) {
            setSelectedServices(selectedServices.filter(id => id !== serviceId));
        } else {
            setSelectedServices([...selectedServices, serviceId]);
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-white">
            {/* Back Button */}
            <div className="mx-auto py-4 px-4 md:px-6 lg:px-24 max-w-[1440px] w-full">
                <Button
                    variant="ghost"
                    onClick={() => router.push('/categories')}
                    className="gap-2  text-sm font-semibold text-secondary-000 hover:bg-accent-10"
                >
                    <ChevronLeft className="h-4 w-4" />
                    Back to Browse
                </Button>
            </div>

            {/* Hero Image */}
            <section className="relative h-64 lg:h-96 overflow-hidden bg-accent-10 container">
                <Image
                    src={vendor.image}
                    alt={vendor.name}
                    fill
                    sizes="100vw"
                    className="object-cover"
                    priority
                />
            </section>

            {/* Vendor Info */}
            <section className="py-8 lg:py-12 px-4 md:px-6 lg:px-24">
                <div className="mx-auto max-w-[1440px]">
                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Main Content */}
                        <div className="flex-1">
                            <div className="mb-6">
                                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                                    <div className="flex-1">
                                        <h2 className="mb-2 font-unbounded text-3xl lg:text-4xl font-semibold text-secondary-000 leading-tight">
                                            {vendor.name}
                                        </h2>
                                        <p className="mb-4  text-base text-accent-80">
                                            {vendor.category}
                                        </p>
                                        <div className="flex flex-wrap gap-4 items-center">
                                            <div className="flex items-center gap-2">
                                                <div className="flex items-center gap-1">
                                                    <Star className="h-5 w-5 text-primary-100 fill-primary-100" />
                                                    <span className=" text-base font-semibold text-secondary-000">
                                                        {vendor.rating.toFixed(1)}
                                                    </span>
                                                </div>
                                                <span className=" text-sm text-accent-80">
                                                    ({vendor.reviewCount} reviews)
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <MapPin className="h-4 w-4 text-accent-80" />
                                                <span className=" text-sm text-secondary-000">
                                                    {vendor.location}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() => {
                                                setIsFavorited(!isFavorited);
                                                toast.success(isFavorited ? 'Removed from favorites' : 'Added to favorites');
                                            }}
                                            className="rounded-[18px] w-11 h-11 border-accent-30 hover:bg-accent-10"
                                        >
                                            <Heart
                                                className={`h-5 w-5 ${isFavorited ? 'text-primary-100 fill-primary-100' : 'text-secondary-000'}`}
                                            />
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() => {
                                                navigator.clipboard.writeText(window.location.href);
                                                toast.success('Link copied to clipboard!');
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
                                    <TabsTrigger
                                        value="services"
                                        className=" text-sm font-semibold rounded-lg data-[state=active]:bg-white data-[state=active]:text-secondary-000"
                                    >
                                        Services
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="about"
                                        className=" text-sm font-semibold rounded-lg data-[state=active]:bg-white data-[state=active]:text-secondary-000"
                                    >
                                        About
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="reviews"
                                        className=" text-sm font-semibold rounded-lg data-[state=active]:bg-white data-[state=active]:text-secondary-000"
                                    >
                                        Reviews
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="gallery"
                                        className=" text-sm font-semibold rounded-lg data-[state=active]:bg-white data-[state=active]:text-secondary-000"
                                    >
                                        Gallery
                                    </TabsTrigger>
                                </TabsList>

                                <TabsContent value="services" className="space-y-4">
                                    {services.map((service) => {
                                        const isSelected = selectedServices.includes(service.id);
                                        return (
                                            <Card
                                                key={service.id}
                                                className={`cursor-pointer transition-all duration-300 rounded-2xl border-2 py-0 ${isSelected
                                                    ? 'border-primary-100 shadow-md bg-primary-100/5'
                                                    : 'border-accent-20 hover:shadow-md bg-white'
                                                    }`}
                                                onClick={() => toggleService(service.id)}
                                            >
                                                <CardContent className="p-5">
                                                    <div className="flex items-start justify-between gap-4">
                                                        <div className="flex items-start gap-3 flex-1">
                                                            <div
                                                                className={`h-5 w-5 rounded border-2 flex items-center justify-center transition-all mt-1 shrink-0 ${isSelected
                                                                    ? 'border-primary-100 bg-primary-100'
                                                                    : 'border-accent-30 bg-transparent'
                                                                    }`}
                                                            >
                                                                {isSelected && (
                                                                    <Check className="h-3 w-3 text-white" />
                                                                )}
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <h4 className="mb-1  text-base font-semibold text-secondary-000">
                                                                    {service.name}
                                                                </h4>
                                                                <p className="mb-2  text-sm text-accent-80 leading-relaxed">
                                                                    {service.description}
                                                                </p>
                                                                <div className="flex items-center gap-2">
                                                                    <Clock className="h-3.5 w-3.5 text-accent-80" />
                                                                    <span className=" text-xs text-accent-80">
                                                                        {service.duration}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="text-right shrink-0">
                                                            <p className=" text-lg font-semibold text-primary-100">
                                                                ${service.price}
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
                                            <p className=" text-base text-secondary-000 leading-relaxed">
                                                {vendor.about || `Welcome to ${vendor.name}! We are committed to providing exceptional service and quality craftsmanship.`}
                                            </p>
                                            <div className="space-y-3">
                                                <div className="flex items-center gap-3">
                                                    <MapPin className="h-5 w-5 text-accent-80" />
                                                    <span className=" text-sm text-secondary-000">
                                                        {vendor.location}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <Phone className="h-5 w-5 text-accent-80" />
                                                    <span className=" text-sm text-secondary-000">
                                                        +234 123 456 7890
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <Mail className="h-5 w-5 text-accent-80" />
                                                    <span className=" text-sm text-secondary-000">
                                                        contact@{vendor.id}.com
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="pt-4 border-t border-accent-20">
                                                <h4 className="mb-4  text-base font-semibold text-secondary-000">
                                                    Opening Hours
                                                </h4>
                                                <div className="space-y-2">
                                                    <div className="flex justify-between">
                                                        <span className=" text-sm text-accent-80">
                                                            {vendor.openingHours || 'Mon-Sat: 9:00 AM - 6:00 PM'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </TabsContent>

                                <TabsContent value="reviews" className="space-y-6">
                                    {/* Review Summary */}
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="mb-2  text-xl font-semibold text-secondary-000">
                                                Customer Reviews
                                            </h3>
                                            <div className="flex items-center gap-2">
                                                <div className="flex items-center gap-1">
                                                    <Star className="h-5 w-5 text-primary-100 fill-primary-100" />
                                                    <span className=" text-base font-semibold text-secondary-000">
                                                        {vendor.rating.toFixed(1)}
                                                    </span>
                                                </div>
                                                <span className=" text-sm text-accent-80">
                                                    ({reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})
                                                </span>
                                            </div>
                                        </div>
                                        {!userReview && !showReviewForm && (
                                            <Button
                                                onClick={() => setShowReviewForm(true)}
                                                className="gap-2 bg-primary-100 text-white hover:bg-primary-100/90 rounded-[18px] h-11  text-sm font-semibold"
                                            >
                                                <Plus className="h-4 w-4" />
                                                Write Review
                                            </Button>
                                        )}
                                    </div>

                                    {/* Review Form */}
                                    {showReviewForm && (
                                        <ReviewForm
                                            vendorId={vendorIdNumber}
                                            existingReview={editingReview}
                                            onSave={handleSaveReview}
                                            onCancel={handleCancelReview}
                                        />
                                    )}

                                    {/* Reviews List */}
                                    <ReviewsList
                                        reviews={reviews}
                                        onEdit={handleEditReview}
                                        onDelete={handleDeleteReview}
                                    />
                                </TabsContent>

                                <TabsContent value="gallery">
                                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                        {galleryImages.map((image, index) => (
                                            <div
                                                key={index}
                                                className="aspect-square overflow-hidden rounded-2xl"
                                            >
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

                        {/* Sidebar - Booking Card */}
                        <aside className="lg:w-96 shrink-0">
                            <Card
                                className="sticky top-24 rounded-3xl border border-accent-20 shadow-lg"
                            >
                                <CardContent className="p-6">
                                    <h4 className="mb-4 font-unbounded text-xl font-semibold text-secondary-000">
                                        Book an Appointment
                                    </h4>
                                    {selectedServices.length > 0 ? (
                                        <div className="space-y-4 mb-6">
                                            <div className="space-y-2">
                                                {selectedServices.map((serviceId) => {
                                                    const service = services.find((s) => s.id === serviceId);
                                                    if (!service) return null;
                                                    return (
                                                        <div
                                                            key={serviceId}
                                                            className="flex items-center justify-between py-2 border-b border-accent-20"
                                                        >
                                                            <span className=" text-sm text-secondary-000">
                                                                {service.name}
                                                            </span>
                                                            <span className=" text-sm font-semibold text-primary-100">
                                                                ${service.price}
                                                            </span>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                            <div className="flex items-center justify-between pt-2 border-t-2 border-accent-20">
                                                <span className=" text-base font-semibold text-secondary-000">
                                                    Total
                                                </span>
                                                <span className=" text-xl font-semibold text-primary-100">
                                                    ${totalPrice}
                                                </span>
                                            </div>
                                        </div>
                                    ) : (
                                        <p className="mb-6 text-center py-8  text-sm text-accent-80 bg-secondary-800 rounded-xl">
                                            Select services to book
                                        </p>
                                    )}

                                    <Button
                                        onClick={handleBooking}
                                        disabled={selectedServices.length === 0}
                                        className="w-full bg-primary-100 text-white hover:bg-primary-100/90 disabled:bg-accent-30 disabled:text-accent-60 rounded-[18px] h-12  text-base font-semibold disabled:cursor-not-allowed"
                                    >
                                        Continue to Booking
                                    </Button>
                                    <div className="mt-4 text-center  text-xs text-accent-80">
                                        Free cancellation up to 24 hours before
                                    </div>
                                </CardContent>
                            </Card>
                        </aside>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default VendorDetailPage;
