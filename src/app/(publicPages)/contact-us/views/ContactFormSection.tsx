"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
    publicContactFormSchema,
    zodFieldErrors,
} from "@/lib/validations";

const ContactFormSection = () => {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
    });

    const [focusedField, setFocusedField] = useState<string | null>(null);
    const [errors, setErrors] = useState<
        Partial<Record<keyof typeof formData, string>>
    >({});

    const updateField = (field: keyof typeof formData, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors((prev) => {
                const next = { ...prev };
                delete next[field];
                return next;
            });
        }
    };

    const fieldClass = (field: keyof typeof formData) =>
        `h-14 px-4 font-unageo text-base text-secondary-000 bg-white border rounded-xl outline-none transition-colors duration-200 ${
            errors[field]
                ? "border-red-500"
                : focusedField === field
                  ? "border-primary-100"
                  : "border-accent-20"
        }`;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const result = publicContactFormSchema.safeParse(formData);
        if (!result.success) {
            setErrors(zodFieldErrors(result.error));
            return;
        }
        setErrors({});
        console.log("Contact form submitted:", result.data);
        toast.success("Message sent successfully! We'll get back to you soon.");
        // Reset form
        setFormData({
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
            subject: "",
            message: "",
        });
    };

    const isValid = publicContactFormSchema.safeParse(formData).success;

    return (
        <section className="py-16 md:py-20 px-4 sm:px-6 lg:px-24 bg-white">
            <div className="max-w-[1200px] mx-auto">
                <h2 className="font-unbounded text-2xl md:text-3xl font-semibold text-secondary-000 mb-6">
                    Send us a message
                </h2>

                <form onSubmit={handleSubmit}>
                    <div className="bg-white rounded-2xl border border-accent-20 p-6 md:p-8">
                        <div className="flex flex-col gap-6">
                            {/* First Name & Last Name Row */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="flex flex-col gap-2">
                                    <label
                                        htmlFor="firstName"
                                        className="font-unageo text-base font-semibold text-secondary-000"
                                    >
                                        First Name *
                                    </label>
                                    <input
                                        id="firstName"
                                        type="text"
                                        placeholder="John"
                                        value={formData.firstName}
                                        onChange={(e) => updateField("firstName", e.target.value)}
                                        onFocus={() => setFocusedField("firstName")}
                                        onBlur={() => setFocusedField(null)}
                                        required
                                        className={fieldClass("firstName")}
                                    />
                                    {errors.firstName && (
                                        <p className="font-unageo text-sm text-red-600">{errors.firstName}</p>
                                    )}
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label
                                        htmlFor="lastName"
                                        className="font-unageo text-base font-semibold text-secondary-000"
                                    >
                                        Last Name *
                                    </label>
                                    <input
                                        id="lastName"
                                        type="text"
                                        placeholder="Doe"
                                        value={formData.lastName}
                                        onChange={(e) => updateField("lastName", e.target.value)}
                                        onFocus={() => setFocusedField("lastName")}
                                        onBlur={() => setFocusedField(null)}
                                        required
                                        className={fieldClass("lastName")}
                                    />
                                    {errors.lastName && (
                                        <p className="font-unageo text-sm text-red-600">{errors.lastName}</p>
                                    )}
                                </div>
                            </div>

                            {/* Email & Phone Row */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="flex flex-col gap-2">
                                    <label
                                        htmlFor="email"
                                        className="font-unageo text-base font-semibold text-secondary-000"
                                    >
                                        Email Address *
                                    </label>
                                    <input
                                        id="email"
                                        type="email"
                                        placeholder="john@example.com"
                                        value={formData.email}
                                        onChange={(e) => updateField("email", e.target.value)}
                                        onFocus={() => setFocusedField("email")}
                                        onBlur={() => setFocusedField(null)}
                                        required
                                        className={fieldClass("email")}
                                    />
                                    {errors.email && (
                                        <p className="font-unageo text-sm text-red-600">{errors.email}</p>
                                    )}
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label
                                        htmlFor="phone"
                                        className="font-unageo text-base font-semibold text-secondary-000"
                                    >
                                        Phone Number{" "}
                                        <span className="text-accent-80 font-normal">
                                            (Optional)
                                        </span>
                                    </label>
                                    <input
                                        id="phone"
                                        type="tel"
                                        placeholder="+44 20 1234 5678"
                                        value={formData.phone}
                                        onChange={(e) => updateField("phone", e.target.value)}
                                        onFocus={() => setFocusedField("phone")}
                                        onBlur={() => setFocusedField(null)}
                                        className={fieldClass("phone")}
                                    />
                                    {errors.phone && (
                                        <p className="font-unageo text-sm text-red-600">{errors.phone}</p>
                                    )}
                                </div>
                            </div>

                            {/* Subject */}
                            <div className="flex flex-col gap-2">
                                <label
                                    htmlFor="subject"
                                    className="font-unageo text-base font-semibold text-secondary-000"
                                >
                                    Subject *
                                </label>
                                <input
                                    id="subject"
                                    type="text"
                                    placeholder="How can we help you?"
                                    value={formData.subject}
                                    onChange={(e) => updateField("subject", e.target.value)}
                                    onFocus={() => setFocusedField("subject")}
                                    onBlur={() => setFocusedField(null)}
                                    required
                                    className={fieldClass("subject")}
                                />
                                {errors.subject && (
                                    <p className="font-unageo text-sm text-red-600">{errors.subject}</p>
                                )}
                            </div>

                            {/* Message */}
                            <div className="flex flex-col gap-2">
                                <label
                                    htmlFor="message"
                                    className="font-unageo text-base font-semibold text-secondary-000"
                                >
                                    Message *
                                </label>
                                <textarea
                                    id="message"
                                    placeholder="Tell us more about your inquiry..."
                                    value={formData.message}
                                    onChange={(e) => updateField("message", e.target.value)}
                                    onFocus={() => setFocusedField("message")}
                                    onBlur={() => setFocusedField(null)}
                                    required
                                    rows={6}
                                    className={`px-4 py-4 font-unageo text-base text-secondary-000 bg-white border rounded-xl outline-none transition-colors duration-200 resize-y min-h-[120px] ${
                                        errors.message
                                            ? "border-red-500"
                                            : focusedField === "message"
                                              ? "border-primary-100"
                                              : "border-accent-20"
                                    }`}
                                />
                                {errors.message && (
                                    <p className="font-unageo text-sm text-red-600">{errors.message}</p>
                                )}
                            </div>

                            {/* Submit Button */}
                            <Button
                                type="submit"
                                disabled={!isValid}
                                className="h-14 w-full md:w-auto md:min-w-[200px] flex items-center justify-center gap-2 bg-primary-100 text-white hover:bg-primary-100/90 disabled:bg-accent-80 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-all duration-200 active:scale-[0.98] font-unageo text-base font-semibold"
                            >
                                <Send className="h-5 w-5" />
                                Send Message
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        </section>
    );
};

export default ContactFormSection;

