"use client";

import { useTranslation } from "@/i18n/TranslationContext";

export default function DashboardPage() {
  const { t } = useTranslation();
  const dashboard = t("dashboard");

  return (
    <div>
      <h1 className="text-2xl font-bold text-grey-900">{dashboard.welcome}</h1>
      <p className="mt-2 text-grey-500">{dashboard.title}</p>

      {/* Placeholder stats */}
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="rounded-xl border border-grey-200 bg-white p-6"
          >
            <div className="h-4 w-24 rounded bg-grey-200" />
            <div className="mt-3 h-8 w-16 rounded bg-grey-100" />
          </div>
        ))}
      </div>
    </div>
  );
}
