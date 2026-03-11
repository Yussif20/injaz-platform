"use client";

import { useTranslation } from "@/i18n/TranslationContext";
import { BarChart3, CalendarDays, ChevronDown } from "lucide-react";
import { ReportsContent } from "@/features/reports";

function TodayDateDisplay() {
  const today = new Date();

  const gregorianDate = today.toLocaleDateString("ar", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const hijriDate = new Intl.DateTimeFormat("ar-u-ca-islamic-umalqura", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(today);

  return (
    <div className="flex items-center gap-2 text-sm font-medium text-grey-700">
      <ChevronDown className="h-4 w-4" />
      <CalendarDays className="h-4 w-4" />
      <span>{gregorianDate} / {hijriDate}</span>
    </div>
  );
}

export default function ReportsPage() {
  const { t } = useTranslation();
  const sidebarT = t("dashboard").sidebar;

  return (
    <div>
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center text-text-dark">
          <BarChart3 className="me-2 inline-block h-6 w-6" />
          <h1 className="text-xl font-normal">{sidebarT.reports}</h1>
        </div>
        <TodayDateDisplay />
      </div>

      <div className="mt-6">
        <ReportsContent />
      </div>
    </div>
  );
}
