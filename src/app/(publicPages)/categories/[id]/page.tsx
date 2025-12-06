"use client";

import { useParams, useRouter } from 'next/navigation';
import { vendors } from '@/data/vendorsData';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'motion/react';
import Image from 'next/image';

const VendorDetailPage = () => {
    const params = useParams();
    const router = useRouter();
    const vendorId = params?.id as string;

    // Find the vendor by ID
    const vendor = vendors.find((v) => v.id === vendorId);

    // If vendor not found, show 404 message
    if (!vendor) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-white px-6">
                <h1 className="font-unbounded text-4xl font-semibold text-secondary-000 mb-4">
                    Vendor Not Found
                </h1>
                <p className="font-unageo text-lg text-accent-80 mb-8">
                    The vendor you're looking for doesn't exist.
                </p>
                <Button
                    onClick={() => router.push('/categories')}
                    className="bg-primary-100 text-white hover:bg-primary-100/90"
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Categories
                </Button>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="flex flex-col min-h-screen bg-white"
        >
            {/* Header with Back Button */}
            <section className="py-6 sm:py-8 px-6 sm:px-8 lg:px-24 bg-accent-10">
                <div className="mx-auto max-w-[1440px]">
                    <Button
                        variant="ghost"
                        onClick={() => router.back()}
                        className="mb-4 p-2 hover:bg-accent-20 rounded-lg transition-colors"
                    >
                        <ArrowLeft className="h-5 w-5 mr-2 text-secondary-000" />
                        <span className="font-unageo text-base text-secondary-000">Back</span>
                    </Button>
                </div>
            </section>

            {/* Main Content */}
            <section className="py-8 px-6 sm:px-8 lg:px-24 bg-white flex-1">
                <div className="mx-auto max-w-[1440px]">
                    {/* Placeholder content - will be replaced with your design */}
                    <div className="text-center py-16">
                        <h1 className="font-unbounded text-4xl font-semibold text-secondary-000 mb-4">
                            {vendor.name}
                        </h1>
                        <p className="font-unageo text-lg text-secondary-200 mb-8">
                            {vendor.description}
                        </p>
                        <p className="font-unageo text-sm text-accent-80">
                            Vendor ID: {vendor.id}
                        </p>
                        <p className="font-unageo text-sm text-accent-80 mt-2">
                            Category: {vendor.category} | Location: {vendor.location}
                        </p>
                        <p className="font-unageo text-sm text-accent-80 mt-2">
                            Rating: {vendor.rating} ({vendor.reviewCount} reviews) | Price: {vendor.priceRange}
                        </p>
                    </div>

                    {/* Image Preview */}
                    <div className="relative w-full h-96 rounded-2xl overflow-hidden mb-8">
                        <Image
                            src={vendor.image}
                            alt={vendor.name}
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>

                    {/* Services Section */}
                    {vendor.services && vendor.services.length > 0 && (
                        <div className="mt-8">
                            <h2 className="font-unbounded text-2xl font-semibold text-secondary-000 mb-4">
                                Services
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {vendor.services.map((service) => (
                                    <div
                                        key={service.id}
                                        className="p-4 border border-accent-30 rounded-xl bg-accent-10"
                                    >
                                        <h3 className="font-unbounded text-lg font-semibold text-secondary-000 mb-2">
                                            {service.name}
                                        </h3>
                                        <p className="font-unageo text-sm text-accent-80 mb-2">
                                            {service.description}
                                        </p>
                                        <div className="flex items-center justify-between mt-4">
                                            <span className="font-unageo text-base font-semibold text-primary-100">
                                                ${service.price}
                                            </span>
                                            <span className="font-unageo text-sm text-accent-80">
                                                {service.duration}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* About Section */}
                    {vendor.about && (
                        <div className="mt-8">
                            <h2 className="font-unbounded text-2xl font-semibold text-secondary-000 mb-4">
                                About
                            </h2>
                            <p className="font-unageo text-base text-accent-80 leading-relaxed">
                                {vendor.about}
                            </p>
                        </div>
                    )}

                    {/* Opening Hours */}
                    {vendor.openingHours && (
                        <div className="mt-8">
                            <h2 className="font-unbounded text-2xl font-semibold text-secondary-000 mb-4">
                                Opening Hours
                            </h2>
                            <p className="font-unageo text-base text-accent-80">
                                {vendor.openingHours}
                            </p>
                        </div>
                    )}
                </div>
            </section>
        </motion.div>
    );
};

export default VendorDetailPage;

