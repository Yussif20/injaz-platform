/**
 * Support Page - Customer Service
 */

"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { authContent } from "@/content";

export default function SupportPage() {
  const router = useRouter();
  const { support } = authContent;

  return (
    <div className="min-h-screen h-full flex items-stretch p-0">
      <div className="w-full h-full min-h-screen max-w-none bg-white rounded-tl-[30px] rounded-tr-[30px] lg:rounded-tr-none lg:rounded-bl-[100px] p-4 sm:p-6 lg:p-12 shadow-sm flex flex-col justify-center gap-4">
        {/* Logo and Back Button Row */}
        <div className="flex justify-between items-center pb-2 sm:pb-3">
          {/* Back Button */}
          <button
            onClick={() => router.back()}
            className="w-fit hover:opacity-80 transition-opacity"
            aria-label={support.backAlt}
          >
            <Image
              src="/icons/ui/right-arrow.svg"
              alt={support.backAlt}
              width={24}
              height={24}
            />
          </button>

          {/* Logo */}
          <Link href="/">
            <Image
              src="/logo/logo-cyan.svg"
              alt={support.logoAlt}
              width={70}
              height={80}
              className="h-16 sm:h-20 w-auto"
              priority
            />
          </Link>
        </div>

        {/* Support Illustration */}
        <div className="flex justify-start">
          <Image
            src="/images/auth/support-illustration.svg"
            alt={support.title}
            width={292}
            height={245}
          />
        </div>

        {/* Title */}
        <h1 className="mb-3 text-[28px] font-normal text-[#333] text-right">
          {support.title}
        </h1>

        {/* Subtitle */}
        <h2 className="text-[24px] font-normal text-[#333] text-right">
          {support.subtitle}
        </h2>

        {/* Description */}
        <p className="text-[18px] font-light text-[#4D4D4D] text-right">
          {support.description}
        </p>

        {/* WhatsApp Link */}
        <a
          href="https://wa.me/966548635554"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 flex flex-row-reverse items-center justify-end gap-2 text-primary-500 hover:opacity-80 transition-opacity text-right"
        >
          <span className="text-[18px] font-normal" dir="ltr">
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
    </div>
  );
}
