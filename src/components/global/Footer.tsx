import Link from "next/link";
import Image from "next/image";
import FooterLogo from "../../../public/assets/images/footerLogo.svg";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerSections = {
    forCustomers: [
      { label: "About Us", href: "/about-us" },
      { label: "Help & Support", href: "/help-and-support" },
      { label: "FAQs", href: "/help-and-support" },
      { label: "Blog", href: "/blog" },
    ],
    forVendors: [
      { label: "Become a vendor", href: "/vendor/register" },
      { label: "Pricing", href: "/pricing" },
      { label: "Support", href: "/vendor/support" },
    ],
    legal: [
      { label: "Privacy Policy", href: "/privacy-policy" },
      { label: "Terms Of Use", href: "/terms-of-use" },
      { label: "Terms Of Service", href: "/terms-of-service" },
    ],
    social: [
      { label: "Instagram", href: "https://instagram.com" },
      { label: "Facebook", href: "https://facebook.com" },
      { label: "Twitter (X)", href: "https://twitter.com" },
      { label: "LinkedIn", href: "https://linkedin.com" },
    ],
  };

  return (
    <footer className="bg-[#562A03] rounded-t-[40px] lg:rounded-t-[56px] container overflow-hidden">
      {/* main footer content */}
      <div className="mx-auto w-full max-w-[1440px] px-6 sm:px-8 lg:px-24 py-12 sm:py-16 md:py-20 lg:py-24">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 xl:gap-20">
          {/* Logo and App Store Badge */}
          <div className="flex flex-col gap-6 lg:min-w-[200px]">
            {/* Logo */}
            <Link href="/" className="w-fit">
              <Image src={FooterLogo} alt="Afrivendors Logo" width={102} height={50} className="w-20 sm:w-[90px] md:w-[102px] h-auto" />
            </Link>

            {/* App Store Badge */}
            <div className="flex items-center gap-2 flex-wrap">
              <p className="text-white text-base sm:text-lg font-semibold leading-normal tracking-[-0.01em]">Available soon on</p>
              <div className="flex items-center gap-2">
                <Image src="/assets/icons/appstore.svg" alt="App Store" width={24} height={24} className="w-5 h-5 sm:w-6 sm:h-6" />
                <Image src="/assets/icons/playstore.svg" alt="Play Store" width={24} height={24} className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
            </div>
          </div>

          {/* Footer Links Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 md:gap-12 flex-1">
            {/* For Customers */}
            <div>
              <h3 className="text-[#EEEDEC] text-xl font-semibold leading-[160%] tracking-[-0.01em] mb-4 sm:mb-6">For Customers</h3>
              <ul className="space-y-3 sm:space-y-4">
                {footerSections.forCustomers.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-white text-base border-b border-b-transparent hover:border-b-white hover:text-[#C17A4A] transition-all duration-300 inline-block"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* For Vendors */}
            <div>
              <h3 className="text-[#EEEDEC] text-xl font-semibold leading-[160%] tracking-[-0.01em] mb-4 sm:mb-6">For Vendors</h3>
              <ul className="space-y-3 sm:space-y-4">
                {footerSections.forVendors.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-white text-base border-b border-b-transparent hover:border-b-white hover:text-[#C17A4A] transition-all duration-300 inline-block"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h3 className="text-[#EEEDEC] text-xl font-semibold leading-[160%] tracking-[-0.01em] mb-4 sm:mb-6">Legal</h3>
              <ul className="space-y-3 sm:space-y-4">
                {footerSections.legal.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-white text-base border-b border-b-transparent hover:border-b-white hover:text-[#C17A4A] transition-all duration-300 inline-block"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Find us on social */}
            <div>
              <h3 className="text-[#EEEDEC] text-xl font-semibold leading-[160%] tracking-[-0.01em] mb-4 sm:mb-6">Find us on social</h3>
              <ul className="space-y-3 sm:space-y-4">
                {footerSections.social.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white text-base border-b border-b-transparent hover:border-b-white hover:text-[#C17A4A] transition-all duration-300 inline-block"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom section with email and copyright */}
      <div className="border-t border-white/10 bg-white">
        <div className="mx-auto max-w-7xl px-6 sm:px-0 py-3 sm:py-4 flex flex-row items-center justify-between gap-2 sm:gap-4">
          <Link
            href="mailto:info@afrivendor.co.uk"
            className="text-accent-80 hover:text-primary-100 transition-colors text-xs sm:text-sm md:text-base font-normal order-2 sm:order-1"
          >
            info@afrivendor.co.uk
          </Link>
          <p className="text-accent-80 text-xs sm:text-sm md:text-base font-normal order-1 sm:order-2">
            © {currentYear} Afrivendors.co.uk ltd
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
