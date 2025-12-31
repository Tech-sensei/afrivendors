"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface FormData {
    name: string;
    email: string;
    phone: string;
    notes: string;
}

interface ContactInformationFormProps {
    formData: FormData;
    onFormDataChange: (data: Partial<FormData>) => void;
}

export function ContactInformationForm({
    formData,
    onFormDataChange,
}: ContactInformationFormProps) {
    return (
        <Card className="rounded-2xl border border-accent-20">
            <CardHeader>
                <CardTitle className="text-lg font-semibold text-secondary-000">
                    Your Information
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="name" className="block mb-2 text-sm font-semibold text-secondary-000">
                            Full Name *
                        </Label>
                        <Input
                            id="name"
                            required
                            value={formData.name}
                            onChange={(e) => onFormDataChange({ name: e.target.value })}
                            placeholder="Enter your full name"
                            className="h-12 rounded-xl border-accent-20 text-sm"
                        />
                    </div>
                    <div>
                        <Label htmlFor="phone" className="block mb-2 text-sm font-semibold text-secondary-000">
                            Phone Number *
                        </Label>
                        <Input
                            id="phone"
                            type="tel"
                            required
                            value={formData.phone}
                            onChange={(e) => onFormDataChange({ phone: e.target.value })}
                            placeholder="+234 123 456 7890"
                            className="h-12 rounded-xl border-accent-20 text-sm"
                        />
                    </div>
                    <div className="md:col-span-2">
                        <Label htmlFor="email" className="block mb-2 text-sm font-semibold text-secondary-000">
                            Email Address *
                        </Label>
                        <Input
                            id="email"
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) => onFormDataChange({ email: e.target.value })}
                            placeholder="your.email@example.com"
                            className="h-12 rounded-xl border-accent-20 text-sm"
                        />
                    </div>
                    <div className="md:col-span-2">
                        <Label htmlFor="notes" className="block mb-2 text-sm font-semibold text-secondary-000">
                            Special Requests (Optional)
                        </Label>
                        <Textarea
                            id="notes"
                            value={formData.notes}
                            onChange={(e) => onFormDataChange({ notes: e.target.value })}
                            placeholder="Any special requests or notes..."
                            rows={3}
                            className="rounded-xl border-accent-20 text-sm"
                        />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

