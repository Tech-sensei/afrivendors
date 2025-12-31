"use client";

import { Calendar as CalendarIcon, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';

const timeSlots = [
    '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
    '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM',
    '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM', '5:00 PM', '5:30 PM',
    '6:00 PM', '6:30 PM', '7:00 PM'
];

interface DateTimeSelectionProps {
    date: Date | undefined;
    selectedTime: string;
    onDateChange: (date: Date | undefined) => void;
    onTimeChange: (time: string) => void;
}

export function DateTimeSelection({
    date,
    selectedTime,
    onDateChange,
    onTimeChange,
}: DateTimeSelectionProps) {
    return (
        <div className="grid md:grid-cols-2 gap-6">
            {/* Date Selection */}
            <Card className="rounded-2xl border border-accent-20">
                <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-lg font-semibold text-secondary-000">
                        <CalendarIcon className="h-5 w-5" />
                        Select Date
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Calendar
                        mode="single"
                        selected={date}
                        onSelect={onDateChange}
                        disabled={(date) => date < new Date()}
                        className="rounded-md border border-accent-20 w-full"
                    />
                </CardContent>
            </Card>

            {/* Time Selection */}
            <Card className="rounded-2xl border border-accent-20">
                <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-lg font-semibold text-secondary-000">
                        <Clock className="h-5 w-5" />
                        Select Time
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {!date ? (
                        <div className="text-center py-8 rounded-xl bg-[#F8F5F2]">
                            <p className="text-sm text-accent-80">
                                Please select a date first
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 gap-2 max-h-[320px] overflow-y-auto pr-2">
                            {timeSlots.map((time) => (
                                <button
                                    key={time}
                                    onClick={() => onTimeChange(time)}
                                    className={cn(
                                        "h-11 rounded-xl text-sm font-semibold cursor-pointer transition-all duration-150",
                                        selectedTime === time
                                            ? "border-2 border-primary-100 bg-primary-300 text-primary-100"
                                            : "border border-accent-20 bg-white text-secondary-000 hover:border-primary-100"
                                    )}
                                >
                                    {time}
                                </button>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

