"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui";

export default function SignInPage() {
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
              alt="شعار إنجاز معلم"
              width={70}
              height={80}
              className="h-20 w-auto"
              priority
            />
          </Link>
        </div>

        {/* Heading */}
        <div className="text-right">
          <h1 className="text-[28px] font-normal text-text-dark">تسجيل دخول</h1>
          <p className="text-[18px] font-light text-[#D4D4D4] mt-2">
            مرحبا بك مرة ثانية، سجل بياناتك للدخول
          </p>
        </div>

        {/* Form */}
        <form className="flex flex-col gap-10 text-right">
          <div className="flex flex-col gap-3">
            <label
              className="text-[16px] font-normal text-text-dark"
              htmlFor="phone"
            >
              رقم الجوال*
            </label>
            <input
              id="phone"
              type="tel"
              placeholder="مثال: 96587432"
              onChange={handlePhoneInput}
              className="bg-[#EBEBEB] text-text-dark placeholder-[#B3B3B3] text-[14px] px-3 py-2 rounded-2xl outline-none text-right"
            />
          </div>

          <div className="flex flex-col gap-3">
            <label
              className="text-[16px] font-normal text-text-dark"
              htmlFor="password"
            >
              كلمة المرور*
            </label>
            <input
              id="password"
              type="password"
              placeholder="*********"
              className="bg-[#EBEBEB] text-text-dark placeholder-[#B3B3B3] text-[14px] px-3 py-2 rounded-2xl outline-none"
            />
            <div className="text-right">
              <a href="#" className="text-[18px] font-light text-primary-500">
                نسيت كلمة المرور؟
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
            تسجيل دخول
          </Button>
        </div>

        {/* Sign Up Link */}
        <div className="text-right text-primary-500 text-[18px] font-light">
          <Link href="/sign/up">ليس لديك حساب؟ إنشاء حساب جديد</Link>
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
