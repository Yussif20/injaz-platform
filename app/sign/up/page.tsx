"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui";
import { content } from "@/lib/content";

export default function SignUpPage() {
  const { signUp } = content;
  return (
    <div className="flex-1 flex items-stretch p-0">
      <div className="w-full h-full max-w-none bg-white rounded-tl-[100px] rounded-bl-[100px] p-8 lg:p-12 shadow-sm flex flex-col justify-center gap-6">
        {/* Logo */}
        <div className="flex justify-end">
          <Link href="/">
            <Image
              src="/logo/logo-cyan.svg"
              alt={signUp.logoAlt}
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
            {signUp.title}
          </h1>
          <p className="text-[18px] font-light text-[#D4D4D4] mt-2">
            {signUp.subtitle}
          </p>
        </div>

        {/* Form */}
        <form className="flex flex-col gap-10 text-right">
          {/* Full Name */}
          <div className="flex flex-col gap-3">
            <label
              className="text-[16px] font-normal text-text-dark"
              htmlFor="fullName"
            >
              {signUp.fullNameLabel}
              <span className="text-warning-500 text-[16px]">
                {" "}
                {signUp.fullNameNote}
              </span>
            </label>
            <input
              id="fullName"
              type="text"
              placeholder={signUp.fullNamePlaceholder}
              className="bg-[#EBEBEB] text-text-dark placeholder-[#B3B3B3] text-[14px] px-3 py-2 rounded-2xl outline-none text-right"
            />
          </div>

          {/* Gender */}
          <div className="flex flex-col gap-3">
            <label
              className="text-[16px] font-normal text-text-dark"
              htmlFor="gender"
            >
              {signUp.genderLabel}{" "}
              <span className="text-warning-500 text-[16px]">
                {signUp.genderRequired}
              </span>
            </label>
            <select
              id="gender"
              className="bg-[#EBEBEB] text-text-dark text-[14px] px-3 py-2 rounded-2xl outline-none text-right"
              defaultValue=""
            >
              <option value="" disabled>
                {signUp.genderPlaceholder}
              </option>
              <option value="male">{signUp.genderMale}</option>
              <option value="female">{signUp.genderFemale}</option>
            </select>
          </div>

          {/* Phone */}
          <div className="flex flex-col gap-3">
            <label
              className="text-[16px] font-normal text-text-dark"
              htmlFor="phone"
            >
              {signUp.phoneLabel}
              <span className="text-warning-500 text-[16px]">
                {" "}
                {signUp.phoneNote}
              </span>
            </label>
            <input
              id="phone"
              type="tel"
              placeholder={signUp.phonePlaceholder}
              className="bg-[#EBEBEB] text-text-dark placeholder-[#B3B3B3] text-[14px] px-3 py-2 rounded-2xl outline-none text-right"
            />
          </div>

          {/* Password */}
          <div className="flex flex-col gap-3">
            <label
              className="text-[16px] font-normal text-text-dark"
              htmlFor="password"
            >
              {signUp.passwordLabel}{" "}
              <span className="text-warning-500 text-[16px]">
                {signUp.passwordRequired}
              </span>
            </label>
            <input
              id="password"
              type="password"
              placeholder={signUp.passwordPlaceholder}
              className="bg-[#EBEBEB] text-text-dark placeholder-[#B3B3B3] text-[14px] px-3 py-2 rounded-2xl outline-none"
            />
          </div>

          {/* Email */}
          <div className="flex flex-col gap-3">
            <label
              className="text-[16px] font-normal text-text-dark"
              htmlFor="email"
            >
              {signUp.emailLabel}
            </label>
            <input
              id="email"
              type="email"
              placeholder={signUp.emailPlaceholder}
              className="bg-[#EBEBEB] text-text-dark placeholder-[#B3B3B3] text-[14px] px-3 py-2 rounded-2xl outline-none text-right"
            />
          </div>

          {/* Confirm Password */}
          <div className="flex flex-col gap-3">
            <label
              className="text-[16px] font-normal text-text-dark"
              htmlFor="confirmPassword"
            >
              {signUp.confirmPasswordLabel}{" "}
              <span className="text-warning-500 text-[16px]">
                {signUp.confirmPasswordRequired}
              </span>
            </label>
            <input
              id="confirmPassword"
              type="password"
              placeholder={signUp.confirmPasswordPlaceholder}
              className="bg-[#EBEBEB] text-text-dark placeholder-[#B3B3B3] text-[14px] px-3 py-2 rounded-2xl outline-none"
            />
          </div>

          {/* Terms Checkbox */}
          <div className="flex flex-row-reverse items-center justify-end gap-3">
            <label
              htmlFor="terms"
              className="text-[18px] text-primary-500 cursor-pointer"
            >
              {signUp.termsLabel}
            </label>
            <input id="terms" type="checkbox" className="h-5 w-5" />
          </div>
        </form>

        {/* Submit Button */}
        <div className="w-full flex justify-center mt-2">
          <Button
            type="button"
            className="w-full bg-primary-500 text-white text-[18px] font-light py-3 rounded-2xl"
          >
            {signUp.submitButton}
          </Button>
        </div>

        {/* Sign In Link */}
        <div className="text-right text-primary-500 text-[18px] font-light">
          <Link href="/sign/in">{signUp.signInLink}</Link>
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
