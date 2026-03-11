"use client";

import { useTranslation } from "@/i18n/TranslationContext";
import { useRouter } from "@/i18n/navigation";
import { Scale, ChevronLeft } from "lucide-react";
import { TermsContent } from "@/features/terms";

export default function TermsPage() {
  const { t } = useTranslation();
  const sidebarT = t("dashboard").sidebar;
  const commonT = t("common");
  const router = useRouter();

  return (
    <div>
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center text-text-dark">
          <Scale className="me-2 inline-block h-6 w-6" />
          <h1 className="text-xl font-normal">{sidebarT.terms}</h1>
        </div>
        <button
          onClick={() => router.push("/dashboard/reports")}
          className="flex items-center text-primary-500"
        >
          <h1 className="text-lg font-light">{commonT.goBack}</h1>
          <ChevronLeft className="ms-2 inline-block h-6 w-6" />
        </button>
      </div>

      <div className="mt-6">
        <TermsContent />
      </div>
    </div>
  );
}
