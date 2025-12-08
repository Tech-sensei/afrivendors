"use client";

import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Clock } from "lucide-react";

const contactMethods = [
    {
        icon: Mail,
        title: "Email Us",
        description: "Send us an email and we'll get back to you within 24 hours",
        contact: "support@afrivendor.co.uk",
        action: "mailto:support@afrivendor.co.uk",
    },
    {
        icon: Phone,
        title: "Call Us",
        description: "Speak directly with our support team",
        contact: "+44 20 1234 5678",
        action: "tel:+442012345678",
    },
    {
        icon: MapPin,
        title: "Visit Us",
        description: "Come see us at our office",
        contact: "Afrivendors Ltd (Company No 15993741), 34-35 Hatton Garden, London EC1N 8DX, United Kingdom.",
        action: "#",
    },

];

const NeedAssistanceSection = () => {
    return (
        <motion.section
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="py-16 md:py-20 lg:py-24 px-4 sm:px-6 lg:px-24 bg-white"
        >
            <div className="max-w-[1200px] mx-auto">
                <div className="text-center mb-12">
                    <h2 className="font-unbounded text-3xl md:text-4xl font-semibold text-secondary-000 mb-4">
                        Need Assistance?
                    </h2>
                    <p className="font-unageo text-base md:text-lg text-accent-80 max-w-2xl mx-auto">
                        You are important to us. Kindly share your thoughts, ideas, and feedback
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {contactMethods.map((method, index) => {
                        const Icon = method.icon;
                        return (
                            <motion.a
                                key={index}
                                href={method.action}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.4, delay: index * 0.1 }}
                                className="flex flex-col items-center text-center p-6 rounded-2xl border border-accent-20 bg-white hover:border-primary-100 hover:shadow-md transition-all duration-300 group"
                            >
                                <div className="mb-4 p-3 rounded-full bg-primary-100/10 group-hover:bg-primary-100/20 transition-colors">
                                    <Icon className="h-6 w-6 text-primary-100" />
                                </div>
                                <h3 className="font-unageo text-lg font-semibold text-secondary-000 mb-2">
                                    {method.title}
                                </h3>
                                <p className="font-unageo text-sm text-accent-80 mb-3">
                                    {method.description}
                                </p>
                                <p className="font-unageo text-sm font-medium text-primary-100">
                                    {method.contact}
                                </p>
                            </motion.a>
                        );
                    })}
                </div>
            </div>
        </motion.section>
    );
};

export default NeedAssistanceSection;

