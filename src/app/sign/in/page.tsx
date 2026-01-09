"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/shared/components/ui";
import { authContent } from "@/content";

export default function SignInPage() {
  const { signIn } = authContent;

  const handlePhoneInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow numbers, +, and common phone separators
    const sanitized = value.replace(/[^\d+]/g, "");
    e.target.value = sanitized;
  };

  return (
    <div className="lg:min-h-screen h-full flex items-stretch p-0">
      <div className="w-full h-full min-h-screen max-w-none bg-white rounded-tl-[100px] rounded-tr-[100px] lg:rounded-tr-none lg:rounded-bl-[100px] p-4 sm:p-6 lg:p-12 shadow-sm flex flex-col justify-center gap-4 sm:gap-5 lg:gap-6">
        {/* Logo */}
        <div className="flex justify-center lg:justify-end pb-2 sm:pb-3">
          <Link href="/">
            <Image
              src="/logo/logo-cyan.svg"
              alt={signIn.logoAlt}
              width={70}
              height={80}
              className="h-16 sm:h-20 w-auto"
              priority
            />
          </Link>
        </div>

        {/* Heading */}
        <div className="text-center lg:text-right pb-2 sm:pb-3">
          <h1 className="text-xl sm:text-2xl lg:text-[28px] font-normal text-text-dark">
            {signIn.title}
          </h1>
          <p className="text-sm sm:text-base lg:text-[18px] font-light text-[#D4D4D4] mt-1 sm:mt-2">
            {signIn.subtitle}
          </p>
        </div>

        {/* Form */}
        <form className="flex flex-col gap-4 sm:gap-5 lg:gap-10 text-right">
          <div className="flex flex-col gap-2 sm:gap-3">
            <label
              className="text-xs sm:text-sm lg:text-[16px] font-normal text-text-dark"
              htmlFor="phone"
            >
              {signIn.phoneLabel}
            </label>
            <input
              id="phone"
              type="tel"
              placeholder={signIn.phonePlaceholder}
              onChange={handlePhoneInput}
              className="bg-[#EBEBEB] text-text-dark placeholder-[#B3B3B3] text-xs sm:text-sm lg:text-[14px] px-2 sm:px-3 py-1.5 sm:py-2 rounded-xl sm:rounded-2xl outline-none text-right"
            />
          </div>

          <div className="flex flex-col gap-2 sm:gap-3">
            <label
              className="text-xs sm:text-sm lg:text-[16px] font-normal text-text-dark"
              htmlFor="password"
            >
              {signIn.passwordLabel}
            </label>
            <input
              id="password"
              type="password"
              placeholder={signIn.passwordPlaceholder}
              className="bg-[#EBEBEB] text-text-dark placeholder-[#B3B3B3] text-xs sm:text-sm lg:text-[14px] pr-2 sm:pr-3 pl-7 sm:pl-10 py-1.5 sm:py-2 rounded-xl sm:rounded-2xl outline-none"
              style={{
                backgroundImage: "url('/pages/sign/lock.svg')",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "left 0.5rem center",
                backgroundSize: "16px 16px",
              }}
            />
            <div className="text-right">
              <a
                href="#"
                className="text-xs sm:text-base lg:text-[18px] font-light text-primary-500"
              >
                {signIn.forgotPassword}
              </a>
            </div>
          </div>
        </form>

        {/* Submit Button */}
        <div className="w-full flex justify-center mt-1 sm:mt-2">
          <Button
            type="button"
            className="w-full bg-primary-500 text-white text-xs sm:text-base lg:text-[18px] font-light py-2 sm:py-3 rounded-xl sm:rounded-2xl"
          >
            {signIn.submitButton}
          </Button>
        </div>

        {/* Sign Up Link */}
        <div className="text-right text-primary-500 text-xs sm:text-base lg:text-[18px] font-light">
          <Link href="/sign/up">{signIn.signUpLink}</Link>
        </div>

        {/* Customer Service Icon */}
        <div className="flex justify-end mt-1 sm:mt-2">
          <Link
            href="https://wa.me/123456789"
            target="_blank"
            rel="noopener noreferrer"
            className="h-16 sm:h-20 w-16 sm:w-20 rounded-full bg-primary-500 hover:bg-primary-800 transition-colors duration-200 flex items-center justify-center"
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
