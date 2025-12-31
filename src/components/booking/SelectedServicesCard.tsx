"use client";

import { Clock, MapPin, Plus, X } from 'lucide-react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface Service {
    id: string;
    name: string;
    price: number;
    duration: string;
}

interface Vendor {
    id: string;
    name: string;
    location: string;
    image: string;
}

interface SelectedServicesCardProps {
    vendor: Vendor;
    selectedServices: Service[];
    onRemoveService: (serviceId: string) => void;
    onAddService: () => void;
}

export function SelectedServicesCard({
    vendor,
    selectedServices,
    onRemoveService,
    onAddService,
}: SelectedServicesCardProps) {
    return (
        <Card className="rounded-2xl border border-accent-20 shadow-[0_8px_24px_rgba(35,19,5,0.06)]">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold text-secondary-000">
                        Selected Services ({selectedServices.length})
                    </CardTitle>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Vendor Info */}
                <div className="flex items-center gap-3 pb-4 border-b border-accent-20">
                    <Image
                        src={vendor.image}
                        alt={vendor.name}
                        width={48}
                        height={48}
                        className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div className="flex-1 min-w-0">
                        <p className="truncate text-base font-semibold text-secondary-000">
                            {vendor.name}
                        </p>
                        <div className="flex items-center gap-1.5">
                            <MapPin className="h-3 w-3 text-accent-60" />
                            <span className="truncate text-xs text-accent-80">
                                {vendor.location}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Service List */}
                <div className="space-y-3">
                    {selectedServices.map((service) => (
                        <div
                            key={service.id}
                            className="flex items-start justify-between gap-4 p-3 rounded-xl bg-[#F8F5F2]"
                        >
                            <div className="flex-1 min-w-0">
                                <h4 className="mb-1 text-base font-semibold text-secondary-000">
                                    {service.name}
                                </h4>
                                <div className="flex items-center gap-2">
                                    <Clock className="h-3 w-3 text-accent-60" />
                                    <span className="text-xs text-accent-80">
                                        {service.duration}
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <p className="text-base font-semibold text-primary-100">
                                    ${service.price.toFixed(2)}
                                </p>
                                {selectedServices.length > 1 && (
                                    <button
                                        onClick={() => onRemoveService(service.id)}
                                        className="w-8 h-8 flex items-center justify-center rounded-lg border-none bg-transparent cursor-pointer text-accent-60 hover:bg-red-50 hover:text-red-600 transition-colors"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Add Service */}
                <Button
                    variant="ghost"
                    onClick={onAddService}
                    className="w-full gap-2"
                >
                    <Plus className="h-4 w-4" />
                    Add service
                </Button>
            </CardContent>
        </Card>
    );
}

