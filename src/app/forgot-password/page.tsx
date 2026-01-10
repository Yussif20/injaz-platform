"use client";

import Link from "next/link";
import Image from "next/image";
import { authContent } from "@/content";
import { ForgotPasswordForm } from "@/features/auth";

export default function ForgotPasswordPage() {
  const { forgotPassword } = authContent;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-shade-100 to-shade-200 p-4">
      <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-lg">
        {/* Logo */}
        <div className="flex justify-center pb-4 sm:pb-6">
          <Link href="/">
            <Image
              src="/logo/logo-cyan.svg"
              alt={forgotPassword.title}
              width={70}
              height={80}
              className="h-16 sm:h-20 w-auto"
              priority
            />
          </Link>
        </div>

        {/* Forgot Password Form */}
        <ForgotPasswordForm />

        {/* Customer Service */}
        <div className="flex justify-center mt-6">
          <Link
            href="https://wa.me/123456789"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-grey-500 hover:text-primary-500 transition-colors"
          >
            هل تحتاج مساعدة؟ تواصل معنا
          </Link>
        </div>
      </div>
    </div>
  );
}
