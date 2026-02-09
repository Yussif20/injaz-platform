"use client";

import { useTranslation } from "@/i18n/TranslationContext";
import { useRouter } from "@/i18n/navigation";
import { CreditCard, ChevronLeft } from "lucide-react";

export default function SubscriptionsPage() {
  const { t } = useTranslation();
  const sidebarT = t("dashboard").sidebar;
  const commonT = t("common");
  const router = useRouter();

  return (
    <div>
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center text-text-dark">
          <CreditCard className="ml-2 inline-block h-6 w-6" />
          <h1 className="text-xl font-normal">{sidebarT.subscriptions}</h1>
        </div>
        <button
          onClick={() => router.back()}
          className="flex items-center text-primary-500"
        >
          <h1 className="text-lg font-light">{commonT.goBack}</h1>
          <ChevronLeft className="mr-2 inline-block h-6 w-6" />
        </button>
      </div>

      <div className="mt-8 flex items-center justify-center rounded-2xl border border-grey-200 bg-white p-16">
        <p className="text-xl text-grey-400">{commonT.comingSoon}</p>
      </div>
    </div>
  );
}
