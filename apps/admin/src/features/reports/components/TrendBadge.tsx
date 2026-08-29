"use client";

import { TrendingUp, TrendingDown } from "lucide-react";
import { useTranslation } from "@/i18n/TranslationContext";

interface TrendBadgeProps {
  value: number;
  direction: "up" | "down";
}

export function TrendBadge({ value, direction }: TrendBadgeProps) {
  const { t } = useTranslation();
  const reportsT = t("reports");

  const isUp = direction === "up";

  return (
    <div className="flex items-center gap-1.5">
      <span className="text-xs text-grey-400">
        {isUp ? reportsT.trend.increase : reportsT.trend.decrease}
      </span>
      <span
        className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
          isUp
            ? "bg-success-50 text-success-500"
            : "bg-warning-50 text-warning-500"
        }`}
      >
        {isUp ? (
          <TrendingUp className="h-3 w-3" />
        ) : (
          <TrendingDown className="h-3 w-3" />
        )}
        +{value}
      </span>
    </div>
  );
}
