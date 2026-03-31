"use client";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import QRcode from "../../../public/assets/images/qr-code.svg";
import type { MobilePhoneProps } from "@/types/misc";

// Simple icon components - can be replaced with actual SVG paths later
function AppleAppStoreIcon() {
    return (
        <div className="relative shrink-0 size-6">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
                <g>
                    <path
                        d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.22-.24 2.4-.93 3.68-.84 1.53.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"
                        fill="#F4F3F2"
                    />
                </g>
            </svg>
        </div>
    );
}

function GooglePlayIcon() {
    return (
        <div className="relative shrink-0 size-6">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
                <g>
                    <path
                        clipRule="evenodd"
                        d="M3.852 3.148a.5.5 0 0 0-.852.353v17a.5.5 0 0 0 .852.353l8.626-8.626-8.626-8.626zm9.541 9.187L5.432 21.394 18.603 12 13.393 12.335zm0-1.67L5.432 2.606 18.603 12 13.393 11.665z"
                        fill="#F4F3F2"
                        fillRule="evenodd"
                    />
                </g>
            </svg>
        </div>
    );
}

function MobilePhone({ rotation = 0, zIndex = 1 }: MobilePhoneProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30, rotate: rotation - 10 }}
            whileInView={{ opacity: 1, y: 0, rotate: rotation }}
            transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
            viewport={{ once: true }}
            whileHover={{
                y: -8,
                rotate: rotation + 2,
                transition: { duration: 0.3, ease: "easeOut" },
            }}
            style={{
                zIndex,
                filter: "drop-shadow(0 20px 40px rgba(0, 0, 0, 0.25))",
            }}
        >
            <div
                className="bg-white rounded-4xl border-[3px] border-secondary-000 relative overflow-hidden"
                style={{
                    width: "211.527px",
                    height: "457.765px",
                }}
            >
                {/* Camera/Notch */}
                <div className="absolute flex gap-2 items-center left-1/2 top-4 -translate-x-1/2">
                    <div className="bg-black h-2 rounded-full w-[30px]" />
                    <div className="bg-black rounded-full size-2" />
                </div>

                {/* Bottom Bar */}
                <div className="absolute bg-black h-[3px] left-1/2 rounded-full top-[434px] -translate-x-1/2 w-[82px]" />
            </div>
        </motion.div>
    );
}

const DownloadAppSection = () => {
    return (
        <section className="bg-secondary-000 relative w-full">
            <div className="container mx-auto px-4 sm:px-6 lg:px-24">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center py-12 sm:py-16 md:py-20 lg:py-24">
                    {/* Left Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                        viewport={{ once: true }}
                        className="flex flex-col gap-6"
                    >
                        {/* Heading */}
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1, ease: [0.4, 0, 0.2, 1] }}
                            viewport={{ once: true }}
                            className="font-unbounded text-[clamp(32px,5vw,40px)] font-semibold text-secondary-800 leading-tight"
                        >
                            Download the Afrivendors app
                        </motion.h2>

                        {/* Description */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
                            viewport={{ once: true }}
                            className="flex flex-col gap-2"
                        >
                            <p className="text-[clamp(16px,2.5vw,20px)] text-secondary-800 leading-[1.6] tracking-[-0.2px]">
                                Discover trusted African artisans and service providers right at your fingertips. Book, chat, and pay securely all in one place.
                            </p>
                            <p className="text-[clamp(16px,2.5vw,20px)] italic text-secondary-800 leading-[1.6] tracking-[-0.2px]">
                                Connect. Create. Thrive with Afrivendor.
                            </p>
                        </motion.div>

                        {/* Available Soon Badge */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.3, ease: [0.4, 0, 0.2, 1] }}
                            viewport={{ once: true }}
                            className="flex gap-2 items-center flex-wrap mt-4"
                        >
                            <p className="text-[clamp(16px,2.5vw,20px)] font-semibold text-secondary-800 tracking-[-0.2px]">
                                Available soon on
                            </p>
                            <AppleAppStoreIcon />
                            <GooglePlayIcon />
                        </motion.div>

                        {/* QR Code - Placeholder */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: 0.4, ease: [0.4, 0, 0.2, 1] }}
                            viewport={{ once: true }}
                            whileHover={{
                                scale: 1.05,
                                transition: { duration: 0.3, ease: "easeOut" },
                            }}
                            className="inline-block mt-2"
                        >
                            <div
                                className={cn(
                                    "bg-white flex items-center justify-center cursor-pointer transition-all duration-300 hover:shadow-2xl",
                                    "p-5 rounded-[20px] border border-secondary-000",
                                    "w-fit"
                                )}
                                style={{
                                    width: "fit-content",
                                }}
                            >

                                <Image
                                    src={QRcode}
                                    alt="QR Code to download Afrivendor app"
                                    width={180}
                                    height={180}
                                    className="block"
                                />

                            </div>
                        </motion.div>
                    </motion.div>

                    {/* Right - Phone Mockups */}
                    <div className="relative flex items-center justify-center lg:justify-end">
                        {/* Desktop & Tablet - Two Phones Side by Side */}
                        <div
                            className="relative hidden sm:flex items-center justify-center"
                            style={{
                                width: "fit-content",
                                height: "500px",
                            }}
                        >
                            {/* Container for both phones */}
                            <div className="relative" style={{ width: "380px", height: "500px" }}>
                                {/* Left Phone (Rotated Left) */}
                                <div
                                    className="absolute"
                                    style={{
                                        left: "0",
                                        top: "50%",
                                        transform: "translateY(-50%)",
                                        zIndex: 2,
                                    }}
                                >
                                    <MobilePhone rotation={-8} zIndex={2} />
                                </div>

                                {/* Right Phone (Rotated Right) */}
                                <div
                                    className="absolute"
                                    style={{
                                        right: "0",
                                        top: "50%",
                                        transform: "translateY(-50%)",
                                        zIndex: 3,
                                    }}
                                >
                                    <MobilePhone rotation={8} zIndex={3} />
                                </div>
                            </div>
                        </div>

                        {/* Mobile - Single Phone Centered */}
                        <div className="sm:hidden flex items-center justify-center py-6">
                            <MobilePhone rotation={0} zIndex={1} />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default DownloadAppSection;