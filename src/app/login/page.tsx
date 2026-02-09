"use client";

import { useTranslation } from "@/i18n/TranslationContext";
import { LoginForm } from "@/features/auth/components";

export default function LoginPage() {
  const { t } = useTranslation();
  const authT = t("auth");
  const loginT = authT.login;
  const commonT = t("common");

  return (
    <div className="flex min-h-screen items-center justify-center bg-grey-50 px-4">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-grey-200 bg-white p-8 shadow-sm">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold text-primary-500">
              {commonT.appName}
            </h1>
            <p className="mt-2 text-grey-500">{loginT.title}</p>
          </div>

          <LoginForm />
        </div>
      </div>
    </div>
  );
}
