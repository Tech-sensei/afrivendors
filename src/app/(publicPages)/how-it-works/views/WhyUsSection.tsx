"use client";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import Frame from "../../../../../public/assets/images/journeyImg.png";

// Reuse app store icon components from DownloadAppStore style (or similar)
function AppleAppStoreIcon({ color = "#1D0D04" }: { color?: string }) {
  return (
    <div className="relative shrink-0 size-6" data-name="ion:logo-apple-appstore">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="ion:logo-apple-appstore">
          <path
            d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.22-.24 2.4-.93 3.68-.84 1.53.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"
            fill={color}
          />
        </g>
      </svg>
    </div>
  );
}

function GooglePlayIcon({ color = "#1D0D04" }: { color?: string }) {
  return (
    <div className="relative shrink-0 size-6" data-name="streamline-logos:google-play-logo-block">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="streamline-logos:google-play-logo-block">
          <path
            clipRule="evenodd"
            d="M3.852 3.148a.5.5 0 0 0-.852.353v17a.5.5 0 0 0 .852.353l8.626-8.626-8.626-8.626zm9.541 9.187L5.432 21.394 18.603 12 13.393 12.335zm0-1.67L5.432 2.606 18.603 12 13.393 11.665z"
            fill={color}
            fillRule="evenodd"
          />
        </g>
      </svg>
    </div>
  );
}

const WhyUsSection = () => {
  return (
    <section className="bg-white py-1 px-6 md:px-24">
      <div className="max-w-[1440px] mx-auto">
        <div className="bg-[#f7f4f2] rounded-4xl pt-8 px-8 md:px-16 relative overflow-hidden min-h-[400px] flex items-center">
          {/* Content Container */}
          <div className="flex flex-col gap-8 max-w-2xl relative z-10">
            <div className="flex flex-col gap-4">
              <h2 className="font-unbounded text-3xl md:text-4xl font-semibold text-secondary-000">Ready to Get Started?</h2>
              <p className="font-unageo text-lg md:text-xl text-accent-100 opacity-80">
                Join thousands of users already connecting through Afrivendor.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-6">
              {/* App Store Badges */}
              <div className="flex items-center justify-center gap-4 px-6 py-4 rounded-full border border-accent-100 w-full md:w-auto">
                <span className="font-unageo font-semibold text-accent-100">Available soon on</span>
                <div className="flex gap-2">
                  <AppleAppStoreIcon />
                  <GooglePlayIcon />
                </div>
              </div>

              {/* Download Button */}
              <button
                className="bg-primary-100 hover:bg-[#b05f2a] text-secondary-800 font-unageo font-bold text-lg px-4 py-4 rounded-full flex items-center gap-3 transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg w-full md:w-auto justify-center"
                onClick={() => console.log("Download Clicked")}
              >
                <span>Download the Afrivendor App</span>
                <ArrowRight className="size-5" />
              </button>
            </div>
          </div>

          {/* Decorative Rotated App Images (Right Side) */}
          <div className="absolute right-0 bottom-0 hidden lg:flex items-center justify-center pointer-events-none opacity-40 xl:opacity-100 pr-12">
            <div className="relative group">
              <Image src={Frame} alt="Frame" className="w-[480px] h-ful" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyUsSection;
