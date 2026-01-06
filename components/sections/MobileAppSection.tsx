import Image from "next/image";
import { content } from "@/lib/content";

export function MobileAppSection() {
  const { mobileAppSection } = content;

  return (
    <section className="py-20 px-4 lg:px-0">
      <div className="max-w-[90%] mx-auto">
        {/* Title */}
        <h2 className="text-4xl font-normal text-text-dark text-center mb-16">
          {mobileAppSection.title}
        </h2>

        {/* Two Halves */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Right Half - Features */}
          <div className="flex flex-col gap-8">
            {/* Features List */}
            <ul className="flex flex-col gap-6">
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
            <p className="text-2xl font-normal text-primary-500 mt-4">
              {mobileAppSection.downloadText}
            </p>

            {/* App Store Buttons */}
            <div className="flex gap-4 items-center">
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
                  height={54}
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
                  height={54}
                />
              </a>
            </div>
          </div>

          {/* Left Half - Image */}
          <div className="relative h-125 w-full">
            <Image
              src="/sections/mobile-app/mobile-app-preview.svg"
              alt={mobileAppSection.imageAlt}
              fill
              className="object-contain"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
