"use client";

import { useTranslation } from "@/i18n/TranslationContext";
import { useRouter } from "@/i18n/navigation";
import { Award, ChevronLeft } from "lucide-react";
import { RanksContent } from "@/features/ranks";

export default function RanksPage() {
  const { t } = useTranslation();
  const sidebarT = t("dashboard").sidebar;
  const commonT = t("common");
  const router = useRouter();

  return (
    <div>
      <div className="mb-6 flex w-full items-center justify-between">
        <div className="flex items-center text-text-dark">
          <Award className="ml-2 inline-block h-6 w-6" />
          <h1 className="text-xl font-normal">{sidebarT.ranks}</h1>
        </div>
        <button
          onClick={() => router.push("/dashboard/reports")}
          className="flex items-center text-primary-500"
        >
          <h1 className="text-lg font-light">{commonT.goBack}</h1>
          <ChevronLeft className="mr-2 inline-block h-6 w-6" />
        </button>
      </div>

      <RanksContent />
    </div>
  );
}
