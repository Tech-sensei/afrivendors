"use client"
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import signUpChoiceImg from "../../../../public/assets/images/signUpChoiceImg.png"

interface OptionCardProps {
    title: string;
    description: string;
    onClick: () => void;
}

const OptionCard = ({ title, description, onClick }: OptionCardProps) => {
    const [isFocused, setIsFocused] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    return (
        <button
            onClick={onClick}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={`w-full max-w-[520px] p-6 flex items-center justify-between gap-6 bg-white border border-accent-20 rounded-2xl cursor-pointer transition-all duration-200 ease-out outline-offset-2 ${(isHovered || isFocused) ? 'shadow-[0_8px_24px_rgba(35,19,5,0.06)]' : ''
                } ${isFocused ? 'outline-2 outline-primary-100' : 'outline-none'
                } ${isHovered ? '-translate-y-0.5' : 'translate-y-0'
                }`}
        >
            <div className="flex-1 text-left">
                <h2
                    className="font-unbounded text-[clamp(22px,2.0vw,28px)] leading-[120%] font-semibold text-secondary-000 mb-2"
                >
                    {title}
                </h2>
                <p
                    className="text-base leading-6 text-accent-80"
                >
                    {description}
                </p>
            </div>
            <ChevronRight
                className={`w-6 h-6 text-secondary-000 shrink-0 transition-transform duration-200 ease-out ${isHovered ? 'translate-x-1' : 'translate-x-0'
                    }`}
            />
        </button>
    );
}

const SignUpChoice = () => {
    const router = useRouter();
    const [backHovered, setBackHovered] = useState(false);

    return (
        <div className="min-h-screen bg-white">
            <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen max-h-screen overflow-hidden">
                {/* Left Column - Form (50%) */}
                <div className="flex flex-col justify-between p-6 md:p-8 overflow-y-auto">
                    <div className="max-w-[520px] w-full mx-auto">
                        {/* Back Button */}
                        <button
                            onClick={() => router.push('/')}
                            onMouseEnter={() => setBackHovered(true)}
                            onMouseLeave={() => setBackHovered(false)}
                            aria-label="Go back to home"
                            className={`inline-flex items-center gap-2 mb-8 bg-none border-none cursor-pointer p-2 min-w-11 min-h-11 rounded-xl transition-colors duration-200 ease-out ${backHovered ? 'bg-[#f8f5f]' : 'bg-transparent'
                                }`}
                        >
                            <ArrowLeft className="w-5 h-5 text-secondary-000" />
                        </button>

                        {/* Title */}
                        <h1 className="font-unbounded text-[clamp(28px,2.6vw,36px)] leading-[110%] font-semibold text-secondary-000 mb-12">
                            Sign up/log in
                        </h1>

                        {/* Option Cards */}
                        <div className="flex flex-col gap-6">
                            <OptionCard
                                title="For Customers"
                                description="Search, book services as a customer, sign up here"
                                onClick={() => router.push('/sign-in')}
                            />
                            <OptionCard
                                title="For Vendors"
                                description="View and manage bookings, earnings and chats"
                                onClick={() => router.push('/sign-up')}
                            />
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="max-w-[520px] w-full mt-12 mx-auto flex items-center justify-between flex-wrap gap-4">
                        <p className="font-normal text-base leading-5 text-accent-80 hover:text-primary-100 transition-colors duration-300">
                            © 2025 Afrivendors.co.uk ltd
                        </p>
                        <button
                            onClick={() => router.push('/support')}
                            className="text-base leading-5 font-semibold text-secondary-000 bg-none border-none cursor-pointer underline min-w-11 min-h-11 p-3 transition-opacity duration-200 ease-out hover:opacity-70"
                        >
                            Help & Support
                        </button>
                    </div>
                </div>

                {/* Right Column - Hero Image (50%, Desktop only) */}
                <div className="hidden lg:block relative bg-secondary-000 overflow-hidden h-screen">
                    <Image
                        src={signUpChoiceImg}
                        alt="Sign Up Choice"
                        fill
                        sizes="50vw"
                        className="object-cover object-top"
                        priority

                    />

                    <div className="absolute inset-0 bg-[rgba(29,13,4,0.2)]" />
                </div>
            </div>
        </div>
    );
}

export default SignUpChoice;