"use client";

import { motion } from "framer-motion";
import { MessageSquare, Heart, Star, Users } from "lucide-react";

const features = [
    {
        icon: MessageSquare,
        title: "Share Your Feedback",
        description: "Your opinions help us improve and serve you better.",
    },
    {
        icon: Heart,
        title: "We Value Your Input",
        description: "Every suggestion matters in making Afrivendor better.",
    },
    {
        icon: Star,
        title: "Rate Your Experience",
        description: "Help others by sharing your experience with our platform.",
    },
    {
        icon: Users,
        title: "Join Our Community",
        description: "Be part of a growing community of vendors and customers.",
    },
];

const YourVoiceMattersSection = () => {
    return (
        <motion.section
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="py-16 md:py-20 lg:py-24 px-4 sm:px-6 lg:px-24 bg-primary-300"
        >
            <div className="max-w-[1200px] mx-auto">
                <div className="text-center mb-12">
                    <h2 className="font-unbounded text-3xl md:text-4xl font-semibold text-secondary-000 mb-4">
                        Your Voice Matters
                    </h2>
                    <p className="font-unageo text-base md:text-lg text-accent-80 max-w-2xl mx-auto">
                        We're committed to listening and responding to your needs. Your feedback shapes our platform.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map((feature, index) => {
                        const Icon = feature.icon;
                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.4, delay: index * 0.1 }}
                                className="flex flex-col items-center text-center p-6 rounded-2xl bg-white border border-accent-20 hover:shadow-lg transition-all duration-300"
                            >
                                <div className="mb-4 p-3 rounded-full bg-primary-100/10">
                                    <Icon className="h-6 w-6 text-primary-100" />
                                </div>
                                <h3 className="font-unageo text-lg font-semibold text-secondary-000 mb-2">
                                    {feature.title}
                                </h3>
                                <p className="font-unageo text-sm text-accent-80">
                                    {feature.description}
                                </p>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </motion.section>
    );
};

export default YourVoiceMattersSection;

