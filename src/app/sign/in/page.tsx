"use client";

import Link from "next/link";
import Image from "next/image";
import { authContent } from "@/content";
import { LoginForm } from "@/features/auth";

export default function SignInPage() {
  const { signIn } = authContent;

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

        {/* Login Form */}
        <LoginForm />

        {/* Customer Service Icon */}
        <div className="flex justify-end mt-1 sm:mt-2">
          <Link
            href="/sign/support"
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
