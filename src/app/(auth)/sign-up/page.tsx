"use client"
import { useState, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, Eye, EyeOff } from 'lucide-react';
import Image from 'next/image';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import imgHeroImage from "../../../../public/assets/images/signInHeroImg.png";
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useAuthAPI } from '@/services/useAuthAPI';
import { signUpSchema } from '@/lib/validations/authValidationSchema';

const phoneCodes = [
    { code: '+1', name: 'United States', flag: '🇺🇸' },
    { code: '+44', name: 'United Kingdom', flag: '🇬🇧' },
    { code: '+234', name: 'Nigeria', flag: '🇳🇬' },
    { code: '+27', name: 'South Africa', flag: '🇿🇦' },
    { code: '+254', name: 'Kenya', flag: '🇰🇪' },
    { code: '+233', name: 'Ghana', flag: '🇬🇭' }
];

const SignUpPageContent = () => {
    const router = useRouter();
    const { signUpAsync, isSigningUp } = useAuthAPI();

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        country: '',
        password: '',
        phoneCode: '+234',
        phoneNumber: ''
    });

    const [focused, setFocused] = useState({
        firstName: false,
        lastName: false,
        email: false,
        country: false,
        password: false,
        phoneNumber: false
    });

    const [errors, setErrors] = useState({
        firstName: '',
        lastName: '',
        email: '',
        country: '',
        password: '',
        phoneNumber: ''
    });

    const [showPassword, setShowPassword] = useState(false);
    const [agreedToTerms, setAgreedToTerms] = useState(false);
    const [agreedToMarketing, setAgreedToMarketing] = useState(false);

    const handleInputChange = (field: string, value: string) => {
        setFormData({ ...formData, [field]: value });
        if (errors[field as keyof typeof errors]) {
            setErrors({ ...errors, [field]: '' });
        }
    };

    const validateForm = () => {
        const result = signUpSchema.safeParse(formData);
        if (!result.success) {
            const fieldErrors = result.error.flatten().fieldErrors;
            setErrors({
                firstName: fieldErrors.firstName?.[0] ?? '',
                lastName: fieldErrors.lastName?.[0] ?? '',
                email: fieldErrors.email?.[0] ?? '',
                country: fieldErrors.country?.[0] ?? '',
                password: fieldErrors.password?.[0] ?? '',
                phoneNumber: fieldErrors.phoneNumber?.[0] ?? '',
            });
            return false;
        }
        setErrors({ firstName: '', lastName: '', email: '', country: '', password: '', phoneNumber: '' });
        return true;
    };

    const handleContinue = async () => {
        if (!validateForm() || !agreedToTerms) return;

        try {
            await signUpAsync({
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                country: formData.country,
                password: formData.password,
                phoneNumber: {
                    code: formData.phoneCode,
                    number: formData.phoneNumber,
                },
                accountType: "user",
            });
            router.push(`/verify-email?email=${encodeURIComponent(formData.email)}`);
        } catch {
            // error toast is handled inside useAuthAPI
        }
    };

    const isDisabled =
        !formData.firstName ||
        !formData.lastName ||
        !formData.email ||
        !formData.country ||
        !formData.password ||
        !formData.phoneNumber ||
        !agreedToTerms ||
        isSigningUp;

    const inputClass = (field: keyof typeof focused, errorField: keyof typeof errors) =>
        `w-full h-14 px-4 text-base leading-6 text-secondary-000 rounded-xl outline-none transition-all duration-200 ease-out ${formData[field as keyof typeof formData] ? 'bg-secondary-600' : 'bg-white'
        } ${errors[errorField]
            ? 'border border-red-600'
            : focused[field]
                ? 'border border-primary-100'
                : 'border border-secondary-200'
        }`;

    return (
        <div className="min-h-screen bg-white">
            <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
                {/* Left Column - Form */}
                <div className="flex flex-col p-6 md:p-8 lg:p-12 overflow-y-auto bg-white max-h-screen">
                    <div className="max-w-[528px] w-full mx-auto">
                        {/* Back Button */}
                        <button
                            onClick={() => router.push('/sign-in')}
                            aria-label="Go back"
                            className="inline-flex items-center gap-2 mb-8 bg-transparent border-none cursor-pointer p-2 rounded-xl transition-colors duration-200 ease-out hover:bg-secondary-600"
                        >
                            <ArrowLeft className="w-6 h-6 text-secondary-000" />
                        </button>

                        {/* Header */}
                        <div className="mb-10">
                            <h2 className="font-unbounded text-[clamp(20px,3vw,24px)] leading-tight font-semibold text-secondary-000 mb-2">
                                Create account
                            </h2>
                            <p className="text-base leading-6 text-accent-80">
                                Fill in the details below to set up your Afrivendor account.
                            </p>
                        </div>

                        {/* Form */}
                        <div className="flex flex-col gap-4 mb-10">
                            {/* First Name */}
                            <div className="flex flex-col gap-2">
                                <label htmlFor="firstName" className="text-base leading-6 font-normal text-secondary-000">
                                    First Name *
                                </label>
                                <input
                                    id="firstName"
                                    type="text"
                                    placeholder="e.g John"
                                    value={formData.firstName}
                                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                                    onFocus={() => setFocused({ ...focused, firstName: true })}
                                    onBlur={() => setFocused({ ...focused, firstName: false })}
                                    className={inputClass('firstName', 'firstName')}
                                />
                                {errors.firstName && <p className="text-sm text-red-600">{errors.firstName}</p>}
                            </div>

                            {/* Last Name */}
                            <div className="flex flex-col gap-2">
                                <label htmlFor="lastName" className="text-base leading-6 font-normal text-secondary-000">
                                    Last Name *
                                </label>
                                <input
                                    id="lastName"
                                    type="text"
                                    placeholder="e.g Doe"
                                    value={formData.lastName}
                                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                                    onFocus={() => setFocused({ ...focused, lastName: true })}
                                    onBlur={() => setFocused({ ...focused, lastName: false })}
                                    className={inputClass('lastName', 'lastName')}
                                />
                                {errors.lastName && <p className="text-sm text-red-600">{errors.lastName}</p>}
                            </div>

                            {/* Email */}
                            <div className="flex flex-col gap-2">
                                <label htmlFor="email" className="text-base leading-6 font-normal text-secondary-000">
                                    Email Address *
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    placeholder="e.g example@email.com"
                                    value={formData.email}
                                    onChange={(e) => handleInputChange('email', e.target.value)}
                                    onFocus={() => setFocused({ ...focused, email: true })}
                                    onBlur={() => setFocused({ ...focused, email: false })}
                                    className={inputClass('email', 'email')}
                                />
                                {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
                            </div>

                            {/* Country */}
                            <div className="flex flex-col gap-2">
                                <label htmlFor="country" className="text-base leading-6 font-normal text-secondary-000">
                                    Country *
                                </label>
                                <input
                                    id="country"
                                    type="text"
                                    placeholder="e.g Nigeria"
                                    value={formData.country}
                                    onChange={(e) => handleInputChange('country', e.target.value)}
                                    onFocus={() => setFocused({ ...focused, country: true })}
                                    onBlur={() => setFocused({ ...focused, country: false })}
                                    className={inputClass('country', 'country')}
                                />
                                {errors.country && <p className="text-sm text-red-600">{errors.country}</p>}
                            </div>

                            {/* Password */}
                            <div className="flex flex-col gap-2">
                                <label htmlFor="password" className="text-base leading-6 font-normal text-secondary-000">
                                    Password *
                                </label>
                                <div className="relative">
                                    <input
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="Min. 8 characters"
                                        value={formData.password}
                                        onChange={(e) => handleInputChange('password', e.target.value)}
                                        onFocus={() => setFocused({ ...focused, password: true })}
                                        onBlur={() => setFocused({ ...focused, password: false })}
                                        className={`w-full h-14 pl-4 pr-12 text-base leading-6 text-secondary-000 rounded-xl outline-none transition-all duration-200 ease-out ${formData.password ? 'bg-secondary-600' : 'bg-white'
                                            } ${errors.password
                                                ? 'border border-red-600'
                                                : focused.password
                                                    ? 'border border-primary-100'
                                                    : 'border border-secondary-200'
                                            }`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer p-1 flex items-center justify-center text-accent-80 hover:text-secondary-000 transition-colors duration-200"
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                                {errors.password && <p className="text-sm text-red-600">{errors.password}</p>}
                            </div>

                            {/* Phone Number */}
                            <div className="flex flex-col gap-2">
                                <label className="text-base leading-6 font-normal text-secondary-000">
                                    Phone Number *
                                </label>
                                <div className={cn(
                                    "flex items-center h-14 rounded-xl border transition-all duration-200 ease-out overflow-hidden",
                                    errors.phoneNumber
                                        ? "border-red-600"
                                        : focused.phoneNumber
                                            ? "border-primary-100"
                                            : "border-secondary-200",
                                    formData.phoneNumber ? "bg-secondary-600" : "bg-white"
                                )}>
                                    <Select
                                        value={formData.phoneCode}
                                        onValueChange={(value) => handleInputChange('phoneCode', value)}
                                    >
                                        <SelectTrigger
                                            className="w-[100px] h-full border-none shadow-none focus:ring-0 px-3 text-base font-normal text-secondary-000 bg-transparent shrink-0"
                                        >
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {phoneCodes.map((country) => (
                                                <SelectItem key={country.code} value={country.code}>
                                                    {country.flag} {country.code}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>

                                    <div className="w-px h-8 bg-secondary-200 shrink-0" />

                                    <input
                                        type="tel"
                                        placeholder="Phone number"
                                        value={formData.phoneNumber}
                                        onChange={(e) => handleInputChange('phoneNumber', e.target.value.replace(/\D/g, ''))}
                                        onFocus={() => setFocused({ ...focused, phoneNumber: true })}
                                        onBlur={() => setFocused({ ...focused, phoneNumber: false })}
                                        className="flex-1 h-full px-4 text-base leading-6 text-secondary-000 bg-transparent outline-none border-none placeholder:text-accent-80"
                                    />
                                </div>
                                {errors.phoneNumber && <p className="text-sm text-red-600">{errors.phoneNumber}</p>}
                            </div>

                            {/* Terms Checkbox */}
                            <div className="flex items-start gap-2">
                                <Checkbox
                                    id="terms"
                                    checked={agreedToTerms}
                                    onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
                                    className="mt-1"
                                />
                                <label htmlFor="terms" className="text-base leading-5 text-accent-80 flex-1 cursor-pointer">
                                    I agree to the{' '}
                                    <Link href="/terms-of-use" className="text-secondary-000 font-bold underline hover:opacity-70 transition-opacity duration-200">
                                        Terms & Conditions
                                    </Link>{' '}
                                    and{' '}
                                    <Link href="/privacy-policy" className="text-secondary-000 font-bold underline hover:opacity-70 transition-opacity duration-200">
                                        Privacy Policy
                                    </Link>{' '}
                                    of <strong>Afrivendor.</strong>
                                </label>
                            </div>

                            {/* Marketing Checkbox */}
                            <div className="flex items-start gap-2">
                                <Checkbox
                                    id="marketing"
                                    checked={agreedToMarketing}
                                    onCheckedChange={(checked) => setAgreedToMarketing(checked as boolean)}
                                    className="mt-1"
                                />
                                <label htmlFor="marketing" className="text-base leading-5 text-accent-80 flex-1 cursor-pointer">
                                    I agree to receive marketing notifications with offers and news
                                </label>
                            </div>

                            {/* Create Account Button */}
                            <button
                                onClick={handleContinue}
                                disabled={isDisabled}
                                className={`w-full h-14 flex items-center justify-center gap-2 bg-primary-100 border-none rounded-xl cursor-pointer transition-all duration-200 ease-out ${isDisabled
                                    ? 'opacity-50 cursor-not-allowed'
                                    : 'hover:opacity-90 active:scale-[0.98]'
                                    }`}
                            >
                                {isSigningUp ? (
                                    <span className="text-base leading-5 font-semibold text-white">Creating account...</span>
                                ) : (
                                    <>
                                        <span className="text-base leading-5 font-semibold text-white">Create Account</span>
                                        <ArrowRight className="w-[18px] h-[18px] text-white" />
                                    </>
                                )}
                            </button>

                            {/* Sign In Link */}
                            <div className="text-center pt-1">
                                <p className="text-base leading-6 text-accent-80">
                                    Already have an account?{' '}
                                    <Link
                                        href="/sign-in"
                                        className="font-semibold text-primary-100 underline transition-opacity duration-200 ease-out hover:opacity-70"
                                    >
                                        Sign in
                                    </Link>
                                </p>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="max-w-[528px] w-full mx-auto flex items-center justify-between flex-wrap gap-4">
                            <p className="text-base leading-6 text-accent-80">© {new Date().getFullYear()} Afrivendors.co.uk ltd</p>
                            <Link
                                href="/help-and-support"
                                className="text-base leading-5 font-semibold text-secondary-000 underline transition-opacity duration-200 ease-out hover:opacity-70"
                            >
                                Help & Support
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Right Column - Hero Image (Desktop only) */}
                <div className="hidden lg:block relative bg-secondary-000 overflow-hidden h-screen">
                    <Image
                        src={imgHeroImage}
                        alt="Customer Portal"
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
}

const SignUpPage = () => {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-accent-10 flex items-center justify-center">
                <p className="font-unageo text-base text-accent-80">Loading...</p>
            </div>
        }>
            <SignUpPageContent />
        </Suspense>
    );
}

export default SignUpPage;
