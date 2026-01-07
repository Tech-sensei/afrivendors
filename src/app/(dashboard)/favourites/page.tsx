"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { vendors } from '@/data/vendorsData';
import VendorCard from '@/components/views/VendorCard';

// Sample favourites - using vendors from vendorsData
const favouriteVendorIds = [
    'zuriglow-beauty-hub',
    'chef-aisha-kitchen',
    'fade-district',
    'zuri-events',
    'primeedge-solutions'
];

export default function FavouritesPage() {
    const router = useRouter();
    const [favouriteIds, setFavouriteIds] = useState<string[]>(favouriteVendorIds);

    // Load favourites from localStorage on mount
    useEffect(() => {
        const storedFavourites = localStorage.getItem('favouriteVendors');
        if (storedFavourites) {
            try {
                const parsed = JSON.parse(storedFavourites);
                if (Array.isArray(parsed)) {
                    setFavouriteIds(parsed);
                }
            } catch (error) {
                console.error('Error parsing favourites from localStorage:', error);
            }
        }
    }, []);

    // Save favourites to localStorage whenever they change
    useEffect(() => {
        localStorage.setItem('favouriteVendors', JSON.stringify(favouriteIds));
    }, [favouriteIds]);

    const favourites = vendors.filter(v => favouriteIds.includes(v.id));

    const handleFavouriteToggle = (vendorId: string, isFavourite: boolean) => {
        if (isFavourite) {
            setFavouriteIds(prev => [...prev, vendorId]);
            const vendor = vendors.find(v => v.id === vendorId);
            toast.success('Added to Favourites', {
                description: `${vendor?.name || 'Vendor'} has been added to your favourites.`
            });
        } else {
            setFavouriteIds(prev => prev.filter(id => id !== vendorId));
            const vendor = vendors.find(v => v.id === vendorId);
            toast.success('Removed from Favourites', {
                description: `${vendor?.name || 'Vendor'} has been removed from your favourites.`
            });
        }
    };

    return (
        <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h1 className="font-unbounded text-[28px] leading-8 font-semibold text-secondary-200">
                    Favourites
                </h1>
                <p className="text-sm text-secondary-100 opacity-70">
                    {favourites.length} saved vendor{favourites.length !== 1 ? 's' : ''}
                </p>
            </div>

            {/* Vendor Grid */}
            {favourites.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {favourites.map((vendor, index) => (
                        <VendorCard
                            key={vendor.id}
                            vendor={vendor}
                            index={index}
                            isFavourite={favouriteIds.includes(vendor.id)}
                            onFavouriteToggle={handleFavouriteToggle}
                            onClick={() => router.push(`/categories/${vendor.id}`)}
                        />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-16 rounded-3xl bg-accent-10">
                    <Heart className="h-16 w-16 mb-4 text-accent-60" />
                    <h3 className="mb-2 font-unbounded text-xl font-semibold text-secondary-000">
                        No favourites yet
                    </h3>
                    <p className="mb-6 text-sm text-secondary-100 opacity-70 text-center max-w-[320px]">
                        Start adding vendors to your favourites to see them here
                    </p>
                    <Button
                        onClick={() => router.push('/categories')}
                        className="bg-secondary-000 text-white hover:bg-secondary-000/90 rounded-[18px] h-11 px-6 text-sm font-semibold"
                    >
                        Browse Vendors
                    </Button>
                </div>
            )}
        </div>
    );
}
