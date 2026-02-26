"use client";

import { useTranslation } from "@/i18n/TranslationContext";
import { useRouter } from "@/i18n/navigation";
import { AlignJustify, ChevronLeft } from "lucide-react";
import { RanksManagementContent } from "@/features/profile-types";

export default function RanksPage() {
  const { t } = useTranslation();
  const sidebarT = t("dashboard").sidebar;
  const commonT = t("common");
  const router = useRouter();

  return (
    <div>
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center text-text-dark">
          <AlignJustify className="ml-2 inline-block h-6 w-6" />
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

      <div className="mt-6">
        <RanksManagementContent />
      </div>
    </div>
  );
}
