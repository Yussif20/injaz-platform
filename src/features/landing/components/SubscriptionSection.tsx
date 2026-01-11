import Image from "next/image";
import Link from "next/link";
import { landingContent } from "@/content";
import { ROUTES } from "@/config";

export function SubscriptionSection() {
  const { subscriptionSection } = landingContent;

  return (
    <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="relative bg-primary-500 rounded-[28px] overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0">
            <Image
              src="/pages/landing/subscription/subscription-bg.svg"
              alt=""
              fill
              className="object-cover"
            />
          </div>

          {/* Background Pattern */}
          <div className="absolute">
            <Image
              src="/pages/landing/subscription/subscription-bg.svg"
              alt=""
              fill
              className="object-cover"
            />
          </div>

          {/* Content Container */}
          <div className="relative z-10 flex flex-col lg:flex-row items-center lg:items-center gap-8 lg:gap-12 py-8 lg:py-12 px-6 lg:px-16">
            {/* Right Side - Text Content */}
            <div className="flex flex-col items-center lg:items-start text-center lg:text-right flex-1">
              {/* Payment Methods */}
              <div className="flex items-center gap-3 mb-6">
                <Image
                  src="/pages/landing/subscription/mada.svg"
                  alt="Mada"
                  width={48}
                  height={30}
                  className="h-9 w-auto rounded-[3.5px]"
                />

                <Image
                  src="/pages/landing/subscription/visa.png"
                  alt="Visa"
                  width={48}
                  height={30}
                  className="h-9 w-auto rounded-[3.5px]"
                />

                <Image
                  src="/pages/landing/subscription/apple-pay.svg"
                  alt="Apple Pay"
                  width={48}
                  height={30}
                  className="h-9 w-auto rounded-[3.5px]"
                />
              </div>

              {/* Title */}
              <h2 className="text-base md:text-2xl lg:text-[28px] font-normal text-white mb-3 lg:mb-4">
                {subscriptionSection.title}
              </h2>

              {/* Subtitle */}
              <p className="text-sm md:text-lg lg:text-xl font-light text-white/90 mb-6 lg:mb-8">
                {subscriptionSection.subtitle}
              </p>

              {/* CTA Button */}
              <Link
                href={ROUTES.SIGN_UP}
                className="bg-white text-primary-500 px-8 sm:px-12 py-3 rounded-[20px] hover:bg-gray-100 transition-colors text-sm md:text-base font-light"
              >
                {subscriptionSection.ctaButton}
              </Link>
            </div>

            {/* Left Side - Avatar with Badge */}
            <div className="relative shrink-0">
              {/* Avatar Image */}
              <div className="relative w-48 h-48 sm:w-56 sm:h-56 lg:w-72 lg:h-72">
                <Image
                  src="/pages/landing/subscription/subscription-avatar.svg"
                  alt={subscriptionSection.imageAlt}
                  fill
                  className="object-contain"
                />
              </div>

              {/* Success Badge */}
              <div className="absolute -bottom-2 -left-4 sm:-left-8 lg:-left-12 bg-white rounded-full px-4 py-2 shadow-lg flex items-center gap-2">
                <span className="text-xs sm:text-sm text-gray-700 font-medium whitespace-nowrap">
                  {subscriptionSection.successBadge}
                </span>
                <div className="w-5 h-5 sm:w-6 sm:h-6 bg-primary-500 rounded-full flex items-center justify-center">
                  <svg
                    className="w-3 h-3 sm:w-4 sm:h-4 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
