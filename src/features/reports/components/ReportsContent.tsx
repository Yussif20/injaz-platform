"use client";

import {
  CircleDollarSign,
  Users,
  CreditCard,
  FileText,
} from "lucide-react";
import { useTranslation } from "@/i18n/TranslationContext";
import { StatCard } from "./StatCard";
import { ProfitChart } from "./ProfitChart";
import { FilesChart } from "./FilesChart";
import { LatestSubscriptions } from "./LatestSubscriptions";
import { LatestFiles } from "./LatestFiles";
import { statsData } from "../data/reports.mock";

const statConfig = [
  {
    id: "totalProfits",
    titleKey: "totalProfits" as const,
    unitKey: "rial" as const,
    icon: <CircleDollarSign className="h-4 w-4 text-primary-500" />,
    iconBgClass: "bg-primary-50",
  },
  {
    id: "newUsers",
    titleKey: "newUsers" as const,
    unitKey: "user" as const,
    icon: <Users className="h-4 w-4 text-warning-500" />,
    iconBgClass: "bg-warning-50",
  },
  {
    id: "subscribers",
    titleKey: "subscribers" as const,
    unitKey: "subscriber" as const,
    icon: <CreditCard className="h-4 w-4 text-success-500" />,
    iconBgClass: "bg-success-50",
  },
  {
    id: "publishedFiles",
    titleKey: "publishedFiles" as const,
    unitKey: "file" as const,
    icon: <FileText className="h-4 w-4 text-secondary-500" />,
    iconBgClass: "bg-secondary-50",
  },
];

export function ReportsContent() {
  const { t } = useTranslation();
  const reportsT = t("reports");

  return (
    <div className="space-y-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statConfig.map((config) => {
          const data = statsData.find((s) => s.id === config.id)!;
          return (
            <StatCard
              key={config.id}
              icon={config.icon}
              title={reportsT.stats[config.titleKey]}
              value={data.value}
              unit={reportsT.stats[config.unitKey]}
              trendValue={data.trendValue}
              trendDirection={data.trendDirection}
              iconBgClass={config.iconBgClass}
            />
          );
        })}
      </div>

      {/* Charts + Subscriptions Sidebar */}
      <div className="flex flex-col gap-4 xl:flex-row">
        <div className="min-w-0 flex-1 space-y-4">
          <ProfitChart />
          <FilesChart />
        </div>
        <div className="w-full shrink-0 xl:w-1/5">
          <LatestSubscriptions />
        </div>
      </div>

      {/* Latest Files */}
      <LatestFiles />
    </div>
  );
}
