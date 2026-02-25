"use client";

import Image from "next/image";
import { authContent } from "@/content";

export default function CustomerSupportPage() {
  const { support } = authContent;

  return (
    <div className="bg-[#FAFAFA] rounded-xl lg:rounded-2xl p-4 sm:p-6 lg:p-8">
      {/* Content aligned right: title, description, number + icon */}
      <div className="text-right mb-6">
        <h1 className="mb-3 text-xl sm:text-2xl font-normal text-[#333]">
          {support.subtitle}
        </h1>
        <p className="text-base sm:text-lg font-light text-[#4D4D4D] mb-4">
          {support.description}
        </p>
        <a
          href="https://wa.me/966548635554"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex flex-row-reverse items-center gap-2 text-primary-500 hover:opacity-80 transition-opacity"
        >
          <span className="text-base sm:text-lg font-normal" dir="ltr">
            966548635554
          </span>
          <Image
            src="/images/auth/whatsapp.svg"
            alt={support.whatsappAlt}
            width={24}
            height={24}
          />
        </a>
      </div>

      {/* Illustration aligned center */}
      <div className="flex justify-center">
        <Image
          src="/images/auth/support-illustration.svg"
          alt={support.title}
          width={292}
          height={245}
          className="w-auto h-auto max-w-62.5 sm:max-w-73"
        />
      </div>
    </div>
  );
}
