import Image from "next/image";
import { content } from "@/lib/content";

export function MobileAppSection() {
  const { mobileAppSection } = content;

  return (
    <section className=" ">
      <div className="max-w-[90%] lg:max-w-screen mx-auto lg:mx-0 bg-[#E3EFEF] rounded-[28px] lg:rounded-none py-6 lg:py-12 px-4 lg:px-0">
        {/* Title */}
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-normal text-text-dark text-center mb-16">
          {mobileAppSection.title}
        </h2>

        {/* Two Halves */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Half - Image (shown first) */}
          <div className="relative h-125 w-full order-1">
            <Image
              src="/sections/mobile-app/mobile-app-preview-tablet.svg"
              alt={mobileAppSection.imageAlt}
              fill
              className="object-contain lg:hidden"
            />
            <Image
              src="/sections/mobile-app/mobile-app-preview-tablet.svg"
              alt={mobileAppSection.imageAlt}
              fill
              className="object-contain hidden lg:block"
            />
          </div>

          {/* Right Half - Features */}
          <div className="flex flex-col order-2">
            {/* Features List */}
            <ul className="flex flex-col gap-6 items-center lg:items-start">
              {mobileAppSection.features.map((feature, index) => (
                <li key={index} className="flex items-start gap-4">
                  <div className="shrink-0 mt-1">
                    <Image
                      src="/sections/mobile-app/checkmark-badge.svg"
                      alt="checkmark"
                      width={24}
                      height={24}
                    />
                  </div>
                  <span className="text-lg font-normal text-text-dark">
                    {feature}
                  </span>
                </li>
              ))}
            </ul>

            {/* Download Text */}
            <p className="mx-auto lg:mx-0 text-lg sm:text-xl md:text-2xl font-normal text-primary-500 mt-8">
              {mobileAppSection.downloadText}
            </p>

            {/* App Store Buttons */}
            <div className="mx-auto lg:mx-0 flex gap-4  items-center">
              <a
                href="https://apps.apple.com"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-opacity hover:opacity-80"
              >
                <Image
                  src="/sections/mobile-app/app-store-button.svg"
                  alt="Download on App Store"
                  width={160}
                  height={32}
                />
              </a>
              <a
                href="https://play.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-opacity hover:opacity-80"
              >
                <Image
                  src="/sections/mobile-app/play-store-button.svg"
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
