import Image from "next/image";
import { landingContent } from "@/content";

export function MobileAppSection() {
  const { mobileAppSection } = landingContent;

  return (
    <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-0">
      <div className="max-w-[90%] lg:max-w-screen mx-auto lg:mx-0 bg-[#E3EFEF] rounded-[28px] lg:rounded-none py-6 lg:py-12 px-4 lg:px-0">
        {/* Title */}
        <h2 className="text-lg md:text-2xl lg:text-4xl font-normal text-center mb-5 md:mb-7 lg:mb-9 text-text-dark">
          {mobileAppSection.title}
        </h2>

        {/* Two Halves */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Half - Image (shown first) */}
          <div className="relative w-full aspect-video order-1">
            <Image
              src="/images/landing/mobile-app/mobile-app-preview-tablet.svg"
              alt={mobileAppSection.imageAlt}
              fill
              className="object-contain"
            />
          </div>

          {/* Right Half - Features */}
          <div className="flex flex-col order-2">
            {/* Features List */}
            <ul className="flex flex-col gap-6 items-start">
              {mobileAppSection.features.map((feature, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="shrink-0 mt-1 w-4.5 h-4.5 md:w-6 md:h-6 relative">
                    <Image
                      src="/images/landing/mobile-app/checkmark-badge.svg"
                      alt="checkmark"
                      fill
                      className="object-contain"
                    />
                  </div>
                  <span className="text-xs md:text-lg font-normal text-text-dark">
                    {feature}
                  </span>
                </li>
              ))}
            </ul>

            {/* Download Text */}
            <p className="lg:mx-0 text-lg sm:text-xl md:text-2xl font-normal text-primary-500 mt-8">
              {mobileAppSection.downloadText}
            </p>

            {/* App Store Buttons */}
            <div className="mx-auto lg:mx-0 flex gap-4  items-center">
              <a
                href="https://apps.apple.com"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-opacity hover:opacity-80 bg-white rounded-lg"
              >
                <Image
                  src="/images/landing/mobile-app/app-store-button.svg"
                  alt="Download on App Store"
                  width={160}
                  height={32}
                />
              </a>
              <a
                href="https://play.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-opacity hover:opacity-80 rounded-lg"
              >
                <Image
                  src="/images/landing/mobile-app/play-store-button.svg"
                  alt="Get it on Google Play"
                  width={160}
                  height={32}
                />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
