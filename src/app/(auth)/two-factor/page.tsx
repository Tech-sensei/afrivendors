"use client"
import { useState, useRef, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Shield } from 'lucide-react';
import Image from 'next/image';
import imgHeroImage from "../../../../public/assets/images/signInHeroImg.png";
import Link from 'next/link';
import { useAuthAPI } from '@/services/useAuthAPI';

const TwoFactorContent = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const challengeId = Number(searchParams.get('challengeId'));
    const redirectTo = searchParams.get('redirect') || '/';

    const { verifyTwoFactorAsync, isVerifyingTwoFactor, resendTwoFactorAsync, isResendingTwoFactor } = useAuthAPI();
    const [code, setCode] = useState<string[]>(Array(6).fill(''));
    const [error, setError] = useState('');
    const [canResend, setCanResend] = useState(false);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    const STORAGE_KEY = `2fa_sent_at_${challengeId}`;
    const RESEND_DELAY = 60;

    const getRemainingSeconds = () => {
        const sentAt = sessionStorage.getItem(STORAGE_KEY);
        if (!sentAt) return 0;
        const elapsed = Math.floor((Date.now() - Number(sentAt)) / 1000);
        return Math.max(RESEND_DELAY - elapsed, 0);
    };

    const [countdown, setCountdown] = useState(() => {
        if (typeof window === 'undefined') return RESEND_DELAY;
        const remaining = getRemainingSeconds();
        if (remaining === 0) return 0;
        return remaining;
    });

    useEffect(() => {
        // Stamp the send time when first landing on the page (initial code was sent by login)
        if (!sessionStorage.getItem(STORAGE_KEY)) {
            sessionStorage.setItem(STORAGE_KEY, String(Date.now()));
            setCountdown(RESEND_DELAY);
        }
        inputRefs.current[0]?.focus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (countdown <= 0) {
            setCanResend(true);
            return;
        }
        setCanResend(false);
        const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
        return () => clearTimeout(timer);
    }, [countdown]);

    const handleResend = async () => {
        if (!challengeId || isNaN(challengeId)) return;
        try {
            await resendTwoFactorAsync({ challengeId });
            sessionStorage.setItem(STORAGE_KEY, String(Date.now()));
            setCanResend(false);
            setCountdown(RESEND_DELAY);
            setCode(Array(6).fill(''));
            inputRefs.current[0]?.focus();
        } catch {
            // error toast handled inside useAuthAPI
        }
    };

    const handleChange = (index: number, value: string) => {
        const digit = value.replace(/\D/g, '').slice(-1);
        const next = [...code];
        next[index] = digit;
        setCode(next);
        setError('');

        if (digit && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }

        if (digit && index === 5) {
            const full = [...next].join('');
            if (full.length === 6) handleVerify(full);
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && !code[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
        if (!pasted) return;
        const next = Array(6).fill('');
        pasted.split('').forEach((char, i) => { next[i] = char; });
        setCode(next);
        const focusIndex = Math.min(pasted.length, 5);
        inputRefs.current[focusIndex]?.focus();
        if (pasted.length === 6) handleVerify(pasted);
    };

    const handleVerify = async (codeString?: string) => {
        const fullCode = codeString ?? code.join('');
        if (fullCode.length < 6) {
            setError('Please enter the 6-digit code.');
            return;
        }
        if (!challengeId || isNaN(challengeId)) {
            setError('Invalid session. Please sign in again.');
            return;
        }
        try {
            await verifyTwoFactorAsync({ challengeId, code: fullCode });
            router.replace(redirectTo);
        } catch {
            setError('Invalid or expired code. Please try again.');
            setCode(Array(6).fill(''));
            inputRefs.current[0]?.focus();
        }
    };

    const isDisabled = code.join('').length < 6 || isVerifyingTwoFactor;

    return (
        <div className="min-h-screen bg-white">
            <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen max-h-screen overflow-hidden">
                {/* Left Column */}
                <div className="flex flex-col justify-between p-6 md:p-8 overflow-y-auto">
                    <div className="max-w-[560px] w-full mx-auto">
                        <button
                            onClick={() => router.push('/sign-in')}
                            aria-label="Go back"
                            className="inline-flex items-center gap-2 mb-8 bg-transparent border-none cursor-pointer p-2 min-w-11 min-h-11 rounded-xl transition-colors duration-200 ease-out hover:bg-secondary-700"
                        >
                            <ArrowLeft className="w-5 h-5 text-secondary-000" />
                        </button>

                        <div className="flex flex-col items-center text-center py-4">
                            <div className="w-20 h-20 rounded-2xl bg-primary-100/10 flex items-center justify-center mb-6">
                                <Shield className="w-10 h-10 text-primary-100" />
                            </div>

                            <h1 className="font-unbounded text-[clamp(24px,2.6vw,32px)] leading-[110%] font-semibold text-secondary-000 mb-4">
                                Two-factor verification
                            </h1>
                            <p className="text-base leading-6 text-accent-80 mb-10 max-w-[400px]">
                                Enter the 6-digit code from your authenticator app to complete sign in.
                            </p>

                            {/* OTP Inputs */}
                            <div className="flex gap-3 mb-4" onPaste={handlePaste}>
                                {code.map((digit, i) => (
                                    <input
                                        key={i}
                                        ref={(el) => { inputRefs.current[i] = el; }}
                                        type="text"
                                        inputMode="numeric"
                                        maxLength={1}
                                        value={digit}
                                        onChange={(e) => handleChange(i, e.target.value)}
                                        onKeyDown={(e) => handleKeyDown(i, e)}
                                        className={`w-12 h-14 text-center text-xl font-semibold text-secondary-000 rounded-xl border outline-none transition-colors duration-200 ${
                                            error
                                                ? 'border-red-500 bg-red-50'
                                                : digit
                                                    ? 'border-primary-100 bg-secondary-600'
                                                    : 'border-accent-20 bg-white focus:border-primary-100'
                                        }`}
                                        disabled={isVerifyingTwoFactor}
                                    />
                                ))}
                            </div>

                            {error && (
                                <p className="text-sm text-red-600 mb-4">{error}</p>
                            )}

                            <button
                                onClick={() => handleVerify()}
                                disabled={isDisabled}
                                className={`w-full max-w-[360px] h-14 flex items-center justify-center bg-primary-100 border-none rounded-xl cursor-pointer transition-all duration-200 ease-out mt-4 ${
                                    isDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90 active:scale-[0.98]'
                                }`}
                            >
                                <span className="text-base leading-5 font-semibold text-white">
                                    {isVerifyingTwoFactor ? 'Verifying...' : 'Verify'}
                                </span>
                            </button>

                            <div className="mt-6 flex flex-col items-center gap-2">
                                <p className="text-sm text-accent-80">Didn&apos;t receive a code?</p>
                                <button
                                    onClick={handleResend}
                                    disabled={!canResend || isResendingTwoFactor}
                                    className={`text-sm font-semibold bg-transparent border-none transition-all duration-200 ease-out ${
                                        canResend && !isResendingTwoFactor
                                            ? 'text-primary-100 cursor-pointer hover:underline'
                                            : 'text-accent-80 cursor-not-allowed'
                                    }`}
                                >
                                    {isResendingTwoFactor
                                        ? 'Sending...'
                                        : canResend
                                            ? 'Resend code'
                                            : `Resend in ${countdown}s`}
                                </button>
                            </div>

                            <p className="mt-4 text-sm text-accent-80">
                                Having trouble?{' '}
                                <Link
                                    href="/sign-in"
                                    className="font-semibold text-primary-100 underline hover:opacity-70 transition-opacity"
                                >
                                    Back to sign in
                                </Link>
                            </p>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="max-w-[560px] w-full mt-12 mx-auto flex items-center justify-between flex-wrap gap-4">
                        <p className="text-sm leading-5 text-accent-80">© {new Date().getFullYear()} Afrivendors.co.uk ltd</p>
                        <Link
                            href="/help-and-support"
                            className="text-base leading-5 font-semibold text-secondary-000 underline transition-opacity duration-200 ease-out hover:opacity-70"
                        >
                            Help & Support
                        </Link>
                    </div>
                </div>

                {/* Right Column - Hero Image (Desktop only) */}
                <div className="hidden lg:block relative bg-secondary-000 overflow-hidden h-screen">
                    <Image
                        src={imgHeroImage}
                        alt="Two-factor verification"
                        fill
                        sizes="50vw"
                        className="object-cover object-center"
                        priority
                    />
                    <div className="absolute inset-0 bg-[rgba(29,13,4,0.2)]" />
                </div>
            </div>
        </div>
    );
};

const TwoFactorPage = () => (
    <Suspense fallback={
        <div className="min-h-screen bg-accent-10 flex items-center justify-center">
            <p className="font-unageo text-base text-accent-80">Loading...</p>
        </div>
    }>
        <TwoFactorContent />
    </Suspense>
);

export default TwoFactorPage;
