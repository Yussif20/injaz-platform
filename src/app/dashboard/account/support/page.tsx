"use client";

import Image from "next/image";
import { authContent } from "@/content";

export default function CustomerSupportPage() {
  const { support } = authContent;

  return (
    <div className="bg-white rounded-xl lg:rounded-2xl p-4 sm:p-6 lg:p-8">
      {/* Support Illustration */}
      <div className="flex justify-center mb-6">
        <Image
          src="/pages/sign/support-illustration.svg"
          alt={support.title}
          width={292}
          height={245}
          className="w-auto h-auto max-w-[250px] sm:max-w-[292px]"
        />
      </div>

      {/* Title */}
      <h1 className="mb-3 text-xl sm:text-2xl font-normal text-[#333] text-right">
        {support.title}
      </h1>

      {/* Subtitle */}
      <h2 className="text-lg sm:text-xl font-normal text-[#333] text-right mb-2">
        {support.subtitle}
      </h2>

      {/* Description */}
      <p className="text-base sm:text-lg font-light text-[#4D4D4D] text-right mb-4">
        {support.description}
      </p>

      {/* WhatsApp Link */}
      <a
        href="https://wa.me/966548635554"
        target="_blank"
        rel="noopener noreferrer"
        className="flex flex-row-reverse items-center justify-end gap-2 text-primary-500 hover:opacity-80 transition-opacity text-right"
      >
        <span className="text-base sm:text-lg font-normal" dir="ltr">
          966548635554
        </span>
        <Image
          src="/pages/sign/whatsapp.svg"
          alt={support.whatsappAlt}
          width={24}
          height={24}
        />
      </a>
    </div>
  );
}
