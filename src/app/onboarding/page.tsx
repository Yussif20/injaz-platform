"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { authContent } from "@/content";
import { OnboardingFlow } from "@/features/auth";
import type { OnboardingFlowHandle } from "@/features/auth";

export default function OnboardingPage() {
  const { onboarding, signIn } = authContent;
  const onboardingRef = useRef<OnboardingFlowHandle>(null);

  const handleBackClick = () => {
    onboardingRef.current?.handleBack();
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-2 lg:px-12 py-6">
        {/* Back Button (Right in RTL) */}
        <button
          type="button"
          onClick={handleBackClick}
          className="text-grey-500 hover:text-grey-700 transition-colors"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>

        {/* Title (Center) */}
        <div className="text-center flex-1">
          <h1 className="text-xl lg:text-2xl font-medium text-text-dark">
            {onboarding.title}
          </h1>
          <p className="text-sm lg:text-base font-light text-grey-400 mt-1">
            {onboarding.subtitle}
          </p>
        </div>

        {/* Logo (Left in RTL) */}
        <Link href="/">
          <Image
            src="/logo/logo-cyan.svg"
            alt={signIn.logoAlt}
            width={50}
            height={60}
            className="h-12 lg:h-14 w-auto"
            priority
          />
        </Link>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-2 lg:px-12 pb-8">
        <OnboardingFlow ref={onboardingRef} />
      </main>
    </div>
  );
}
