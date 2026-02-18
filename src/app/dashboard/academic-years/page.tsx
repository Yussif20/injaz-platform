"use client";

import { useTranslation } from "@/i18n/TranslationContext";
import { useRouter } from "@/i18n/navigation";
import { GraduationCap, ChevronLeft } from "lucide-react";
import { AcademicYearsContent } from "@/features/academic-years";

export default function AcademicYearsPage() {
  const { t } = useTranslation();
  const sidebarT = t("dashboard").sidebar;
  const commonT = t("common");
  const router = useRouter();

  return (
    <div>
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center text-text-dark">
          <GraduationCap className="ml-2 inline-block h-6 w-6" />
          <h1 className="text-xl font-normal">{sidebarT.academicYears}</h1>
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
        <AcademicYearsContent />
      </div>
    </div>
  );
}
