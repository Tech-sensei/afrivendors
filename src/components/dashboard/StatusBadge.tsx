"use client";

import { cn } from '@/lib/utils';

interface StatusBadgeProps {
    status: 'completed' | 'pending' | 'refunded';
    size?: 'sm' | 'md';
}

export function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
    const statusConfig = {
        completed: {
            label: 'Completed',
            className: 'bg-green-50 text-green-700 border-green-200',
        },
        pending: {
            label: 'Pending',
            className: 'bg-yellow-50 text-yellow-700 border-yellow-200',
        },
        refunded: {
            label: 'Refunded',
            className: 'bg-blue-50 text-blue-700 border-blue-200',
        },
    };

    const config = statusConfig[status];
    const sizeClasses = size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-xs px-3 py-1';

    return (
        <span
            className={cn(
                'inline-flex items-center rounded-full border font-semibold',
                config.className,
                sizeClasses
            )}
        >
            {config.label}
        </span>
    );
}

