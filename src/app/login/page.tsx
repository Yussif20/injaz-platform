"use client";

import Image from "next/image";
import { useTranslation } from "@/i18n/TranslationContext";
import { LoginForm } from "@/features/auth/components";

export default function LoginPage() {
  const { t } = useTranslation();
  const authT = t("auth");
  const loginT = authT.login;
  const commonT = t("common");

  return (
    <div className="flex h-screen bg-white lg:flex-row-reverse p-8">
      <div className="hidden items-center justify-center bg-primary-500 px-10 lg:flex lg:w-3/5 rounded-[28px]">
        <Image
          src="/sign.svg"
          alt={loginT.title}
          width={760}
          height={760}
          className="h-auto w-full max-w-190 mr-auto"
          priority
        />
      </div>

      <div className="flex w-full items-center justify-center lg:w-2/5">
        <div className="relative w-full px-6 py-8 sm:px-10 sm:py-10 lg:flex lg:min-h-screen lg:flex-col lg:justify-center lg:rounded-tr-none lg:rounded-bl-[100px] lg:px-16 lg:py-12">
          <div className="mb-8 flex justify-end lg:absolute lg:top-12 lg:right-16 lg:mb-0">
            <Image
              src="/logos/logo-cyan.svg"
              alt={commonT.appName}
              width={70}
              height={80}
              className="h-14 w-auto sm:h-16 lg:h-20"
              priority
            />
          </div>

          <div className="mb-8 text-right">
            <h1 className="text-[28px] font-normal text-text-dark">
              {loginT.title}
            </h1>
            <p className="mt-2 text-[18px] font-light text-[#4D4D4D]">
              {loginT.description}
            </p>
          </div>

          <div className="mx-auto w-full max-w-md lg:mx-0 lg:max-w-none">
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
}
