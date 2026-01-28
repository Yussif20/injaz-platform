"use client";

import Image from "next/image";

export function OnboardingImageCollage() {
  return (
    <div className="relative w-full h-full min-h-33 md:min-h-64 lg:min-h-full bg-primary-500 rounded-3xl overflow-hidden">
      <Image
        src="/images/auth/register-cover-desktop.svg"
        alt="register app preview"
        fill
        className="object-contain hidden lg:block"
      />
      <Image
        src="/images/auth/register-cover-mobile.svg"
        alt="register app preview"
        fill
        className="object-contain block lg:hidden"
      />
    </div>
  );
}
