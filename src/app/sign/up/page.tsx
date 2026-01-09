"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/shared/components/ui";
import { authContent } from "@/content";

export default function SignUpPage() {
  const { signUp } = authContent;
  return (
    <div className="min-h-screen h-full flex items-stretch p-0">
      <div className="w-full h-full min-h-screen max-w-none bg-white rounded-tl-[100px] rounded-tr-[100px] lg:rounded-tr-none lg:rounded-bl-[100px] p-4 sm:p-6 lg:p-12 shadow-sm flex flex-col justify-center gap-4 sm:gap-5 lg:gap-6">
        {/* Logo */}
        <div className="flex justify-center lg:justify-end pb-2 sm:pb-3">
          <Link href="/">
            <Image
              src="/logo/logo-cyan.svg"
              alt={signUp.logoAlt}
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
            {signUp.title}
          </h1>
          <p className="text-sm sm:text-base lg:text-[18px] font-light text-[#D4D4D4] mt-1 sm:mt-2">
            {signUp.subtitle}
          </p>
        </div>

        {/* Form */}
        <form className="grid grid-cols-1 lg:grid-cols-2 gap-x-6 sm:gap-x-8 gap-y-4 sm:gap-y-5 lg:gap-y-10 text-right">
          {/* Full Name */}
          <div className="flex flex-col gap-2 sm:gap-3">
            <label
              className="text-xs sm:text-sm lg:text-[16px] font-normal text-text-dark"
              htmlFor="fullName"
            >
              {signUp.fullNameLabel}
              <span className="text-warning-500 text-xs sm:text-sm lg:text-[16px]">
                {" "}
                {signUp.fullNameNote}
              </span>
            </label>
            <input
              id="fullName"
              type="text"
              placeholder={signUp.fullNamePlaceholder}
              className="bg-[#EBEBEB] text-text-dark placeholder-[#B3B3B3] text-xs sm:text-sm lg:text-[14px] px-2 sm:px-3 py-1.5 sm:py-2 rounded-xl sm:rounded-2xl outline-none text-right"
            />
          </div>

          {/* Gender */}
          <div className="flex flex-col gap-2 sm:gap-3">
            <label
              className="text-xs sm:text-sm lg:text-[16px] font-normal text-text-dark"
              htmlFor="gender"
            >
              {signUp.genderLabel}{" "}
              <span className="text-warning-500 text-xs sm:text-sm lg:text-[16px]">
                {signUp.genderRequired}
              </span>
            </label>
            <select
              id="gender"
              className="bg-[#EBEBEB] text-text-dark text-xs sm:text-sm lg:text-[14px] pr-2 sm:pr-3 pl-7 sm:pl-10 py-1.5 sm:py-2 rounded-xl sm:rounded-2xl outline-none text-right appearance-none"
              defaultValue=""
              style={{
                backgroundImage: "url('/pages/sign/arrow-down.svg')",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "left 0.5rem center",
                backgroundSize: "14px 14px",
              }}
            >
              <option value="" disabled>
                {signUp.genderPlaceholder}
              </option>
              <option value="male">{signUp.genderMale}</option>
              <option value="female">{signUp.genderFemale}</option>
            </select>
          </div>

          {/* Phone */}
          <div className="flex flex-col gap-2 sm:gap-3">
            <label
              className="text-xs sm:text-sm lg:text-[16px] font-normal text-text-dark"
              htmlFor="phone"
            >
              {signUp.phoneLabel}
              <span className="text-warning-500 text-xs sm:text-sm lg:text-[16px]">
                {" "}
                {signUp.phoneNote}
              </span>
            </label>
            <input
              id="phone"
              type="tel"
              placeholder={signUp.phonePlaceholder}
              className="bg-[#EBEBEB] text-text-dark placeholder-[#B3B3B3] text-xs sm:text-sm lg:text-[14px] px-2 sm:px-3 py-1.5 sm:py-2 rounded-xl sm:rounded-2xl outline-none text-right"
            />
          </div>

          {/* Email */}
          <div className="flex flex-col gap-2 sm:gap-3">
            <label
              className="text-xs sm:text-sm lg:text-[16px] font-normal text-text-dark"
              htmlFor="email"
            >
              {signUp.emailLabel}
            </label>
            <input
              id="email"
              type="email"
              placeholder={signUp.emailPlaceholder}
              className="bg-[#EBEBEB] text-text-dark placeholder-[#B3B3B3] text-xs sm:text-sm lg:text-[14px] px-2 sm:px-3 py-1.5 sm:py-2 rounded-xl sm:rounded-2xl outline-none text-right"
            />
          </div>
          {/* Password */}
          <div className="flex flex-col gap-2 sm:gap-3">
            <label
              className="text-xs sm:text-sm lg:text-[16px] font-normal text-text-dark"
              htmlFor="password"
            >
              {signUp.passwordLabel}{" "}
              <span className="text-warning-500 text-xs sm:text-sm lg:text-[16px]">
                {signUp.passwordRequired}
              </span>
            </label>
            <input
              id="password"
              type="password"
              placeholder={signUp.passwordPlaceholder}
              className="bg-[#EBEBEB] text-text-dark placeholder-[#B3B3B3] text-xs sm:text-sm lg:text-[14px] pr-2 sm:pr-3 pl-7 sm:pl-10 py-1.5 sm:py-2 rounded-xl sm:rounded-2xl outline-none"
              style={{
                backgroundImage: "url('/pages/sign/lock.svg')",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "left 0.5rem center",
                backgroundSize: "16px 16px",
              }}
            />
          </div>

          {/* Confirm Password */}
          <div className="flex flex-col gap-2 sm:gap-3">
            <label
              className="text-xs sm:text-sm lg:text-[16px] font-normal text-text-dark"
              htmlFor="confirmPassword"
            >
              {signUp.confirmPasswordLabel}{" "}
              <span className="text-warning-500 text-xs sm:text-sm lg:text-[16px]">
                {signUp.confirmPasswordRequired}
              </span>
            </label>
            <input
              id="confirmPassword"
              type="password"
              placeholder={signUp.confirmPasswordPlaceholder}
              className="bg-[#EBEBEB] text-text-dark placeholder-[#B3B3B3] text-xs sm:text-sm lg:text-[14px] pr-2 sm:pr-3 pl-7 sm:pl-10 py-1.5 sm:py-2 rounded-xl sm:rounded-2xl outline-none"
              style={{
                backgroundImage: "url('/pages/sign/lock.svg')",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "left 0.5rem center",
                backgroundSize: "16px 16px",
              }}
            />
          </div>

          {/* Terms Checkbox */}
          <div className="flex flex-row-reverse items-center justify-end gap-2 sm:gap-3 lg:col-span-2">
            <label
              htmlFor="terms"
              className="text-xs sm:text-base lg:text-[18px] text-primary-500 cursor-pointer"
            >
              {signUp.termsLabel}
            </label>
            <input
              id="terms"
              type="checkbox"
              className="cursor-pointer h-4 sm:h-5 w-4 sm:w-5 rounded-sm border border-primary-500 accent-primary-500"
            />
          </div>
        </form>

        {/* Submit Button */}
        <div className="w-full flex justify-center mt-1 sm:mt-2">
          <Button
            type="button"
            className="w-full bg-primary-500 text-white text-xs sm:text-base lg:text-[18px] font-light py-2 sm:py-3 rounded-xl sm:rounded-2xl"
          >
            {signUp.submitButton}
          </Button>
        </div>

        {/* Sign In Link */}
        <div className="text-right text-primary-500 text-xs sm:text-base lg:text-[18px] font-light">
          <Link href="/sign/in">{signUp.signInLink}</Link>
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
              alt="خدمة العملاء"
              width={40}
              height={40}
            />
          </Link>
        </div>
      </div>
    </div>
  );
}
