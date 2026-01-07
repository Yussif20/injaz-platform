"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui";
import { content } from "@/lib/content";

export default function SignInPage() {
  const { signIn } = content;

  const handlePhoneInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow numbers, +, and common phone separators
    const sanitized = value.replace(/[^\d+]/g, "");
    e.target.value = sanitized;
  };

  return (
    <div className="flex-1 flex items-stretch p-0">
      <div className="w-full h-full max-w-none bg-white rounded-tl-[100px] rounded-bl-[100px] p-8 lg:p-12 shadow-sm flex flex-col justify-center gap-6">
        {/* Logo */}
        <div className="flex justify-end">
          <Link href="/">
            <Image
              src="/logo/logo-cyan.svg"
              alt={signIn.logoAlt}
              width={70}
              height={80}
              className="h-20 w-auto"
              priority
            />
          </Link>
        </div>

        {/* Heading */}
        <div className="text-right">
          <h1 className="text-[28px] font-normal text-text-dark">
            {signIn.title}
          </h1>
          <p className="text-[18px] font-light text-[#D4D4D4] mt-2">
            {signIn.subtitle}
          </p>
        </div>

        {/* Form */}
        <form className="flex flex-col gap-10 text-right">
          <div className="flex flex-col gap-3">
            <label
              className="text-[16px] font-normal text-text-dark"
              htmlFor="phone"
            >
              {signIn.phoneLabel}
            </label>
            <input
              id="phone"
              type="tel"
              placeholder={signIn.phonePlaceholder}
              onChange={handlePhoneInput}
              className="bg-[#EBEBEB] text-text-dark placeholder-[#B3B3B3] text-[14px] px-3 py-2 rounded-2xl outline-none text-right"
            />
          </div>

          <div className="flex flex-col gap-3">
            <label
              className="text-[16px] font-normal text-text-dark"
              htmlFor="password"
            >
              {signIn.passwordLabel}
            </label>
            <input
              id="password"
              type="password"
              placeholder={signIn.passwordPlaceholder}
              className="bg-[#EBEBEB] text-text-dark placeholder-[#B3B3B3] text-[14px] px-3 py-2 rounded-2xl outline-none"
            />
            <div className="text-right">
              <a href="#" className="text-[18px] font-light text-primary-500">
                {signIn.forgotPassword}
              </a>
            </div>
          </div>
        </form>

        {/* Submit Button */}
        <div className="w-full flex justify-center mt-2">
          <Button
            type="button"
            className="w-full bg-primary-500 text-white text-[18px] font-light py-3 rounded-2xl"
          >
            {signIn.submitButton}
          </Button>
        </div>

        {/* Sign Up Link */}
        <div className="text-right text-primary-500 text-[18px] font-light">
          <Link href="/sign/up">{signIn.signUpLink}</Link>
        </div>

        {/* Customer Service Icon */}
        <div className="flex justify-end mt-2">
          <Link
            href="https://wa.me/123456789"
            target="_blank"
            rel="noopener noreferrer"
            className="h-20 w-20 rounded-full bg-primary-500 hover:bg-primary-800 transition-colors duration-200 flex items-center justify-center"
          >
            <Image
              src="/pages/sign/customer-service.svg"
              alt={signIn.customerServiceAlt}
              width={40}
              height={40}
            />
          </Link>
        </div>
      </div>
    </div>
  );
}
