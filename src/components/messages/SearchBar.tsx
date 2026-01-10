"use client";

import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface SearchBarProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

export function SearchBar({
    value,
    onChange,
    placeholder = "Search conversations...",
}: SearchBarProps) {
    return (
        <div className="relative max-w-[480px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-accent-80 pointer-events-none" />
            <Input
                type="text"
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className={cn(
                    "w-full h-12 pl-10 pr-10 rounded-xl border-accent-20 bg-white",
                    "focus-visible:border-primary-100 focus-visible:ring-primary-100/10"
                )}
            />
            {value && (
                <button
                    onClick={() => onChange("")}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded text-accent-80 hover:bg-accent-10 hover:text-secondary-000 transition-colors"
                >
                    <X className="h-4 w-4" />
                </button>
            )}
        </div>
    );
}
