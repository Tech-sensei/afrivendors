"use client";

import { Calendar as CalendarIcon, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'motion/react';

interface EmptyStateProps {
    vendorId: string | null;
    onBack: () => void;
}

export function EmptyState({ vendorId, onBack }: EmptyStateProps) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="flex flex-col min-h-screen bg-white"
        >

            <section className="py-16 flex-1 flex items-center justify-center">
                <div className="text-center max-w-md">
                    <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center bg-[#F8F5F2]">
                        <CalendarIcon className="h-8 w-8 text-accent-60" />
                    </div>
                    <h2 className="mb-2 font-unbounded text-2xl font-semibold text-secondary-000">
                        No services selected
                    </h2>
                    <p className="mb-6 text-base text-accent-80">
                        Select services from the vendor page to continue booking
                    </p>
                    <Button
                        variant="ghost"
                        onClick={onBack}
                    >
                        Back to Vendor
                    </Button>
                </div>
            </section>
        </motion.div>
    );
}

