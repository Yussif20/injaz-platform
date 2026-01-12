"use client";

import Link from "next/link";
import Image from "next/image";
import { authContent } from "@/content";
import { LoginForm } from "@/features/auth";

export default function SignInPage() {
  const { signIn } = authContent;

  return (
    <div className="min-h-screen h-full flex items-stretch">
      <div className="w-full h-full min-h-screen bg-white rounded-t-[60px] sm:rounded-t-[80px] lg:rounded-tr-none lg:rounded-bl-[100px] px-6 sm:px-10 lg:px-16 py-8 sm:py-10 lg:py-12 shadow-sm flex flex-col justify-center">
        {/* Logo */}
        <div className="flex justify-center lg:justify-end mb-6 sm:mb-8 lg:mb-10">
          <Link href="/">
            <Image
              src="/logo/logo-cyan.svg"
              alt={signIn.logoAlt}
              width={70}
              height={80}
              className="h-14 sm:h-16 lg:h-20 w-auto"
              priority
            />
          </Link>
        </div>

        {/* Heading */}
        <div className="text-center lg:text-right mb-6 sm:mb-8 lg:mb-10">
          <h1 className="text-xl sm:text-2xl lg:text-[28px] font-medium text-text-dark">
            {signIn.title}
          </h1>
          <p className="text-sm sm:text-base lg:text-lg font-light text-grey-400 mt-2">
            {signIn.subtitle}
          </p>
        </div>

        {/* Login Form */}
        <div className="w-full max-w-md mx-auto lg:mx-0 lg:max-w-none">
          <LoginForm />
        </div>

        {/* Customer Service Icon */}
        <div className="flex justify-center lg:justify-end mt-8 sm:mt-10">
          <Link
            href="/sign/support"
            className="h-14 w-14 sm:h-16 sm:w-16 lg:h-18 lg:w-18 rounded-full bg-primary-500 hover:bg-primary-600 transition-colors duration-200 flex items-center justify-center shadow-lg"
          >
            <Image
              src="/pages/sign/customer-service.svg"
              alt={signIn.customerServiceAlt}
              width={32}
              height={32}
              className="w-7 h-7 sm:w-8 sm:h-8 lg:w-9 lg:h-9"
            />
          </Link>
        </div>
      </div>
    </div>
  );
}
