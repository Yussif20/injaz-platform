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
import { useDashboardStats } from "../hooks";

export function ReportsContent() {
  const { t } = useTranslation();
  const reportsT = t("reports");

  const { data: stats, isLoading, isError } = useDashboardStats();

  // Stats configuration
  const statCards = [
    {
      id: "totalProfits",
      titleKey: "totalProfits" as const,
      unitKey: "rial" as const,
      icon: <CircleDollarSign className="h-4 w-4 text-primary-500" />,
      iconBgClass: "bg-primary-50",
      value: stats?.totalProfits ?? 0,
      trendValue: Math.abs(stats?.totalProfitsChange ?? 0),
      trendDirection: (stats?.totalProfitsChange ?? 0) >= 0 ? "up" : "down",
    },
    {
      id: "newUsers",
      titleKey: "newUsers" as const,
      unitKey: "user" as const,
      icon: <Users className="h-4 w-4 text-warning-500" />,
      iconBgClass: "bg-warning-50",
      value: stats?.newUsersCount ?? 0,
      trendValue: Math.abs(stats?.newUsersChange ?? 0),
      trendDirection: (stats?.newUsersChange ?? 0) >= 0 ? "up" : "down",
    },
    {
      id: "subscribers",
      titleKey: "subscribers" as const,
      unitKey: "subscriber" as const,
      icon: <CreditCard className="h-4 w-4 text-success-500" />,
      iconBgClass: "bg-success-50",
      value: stats?.activeSubscribersCount ?? 0,
      trendValue: Math.abs(stats?.subscribersChange ?? 0),
      trendDirection: (stats?.subscribersChange ?? 0) >= 0 ? "up" : "down",
    },
    {
      id: "publishedFiles",
      titleKey: "publishedFiles" as const,
      unitKey: "file" as const,
      icon: <FileText className="h-4 w-4 text-secondary-500" />,
      iconBgClass: "bg-secondary-50",
      value: stats?.publishedFilesCount ?? 0,
      trendValue: Math.abs(stats?.filesChange ?? 0),
      trendDirection: (stats?.filesChange ?? 0) >= 0 ? "up" : "down",
    },
  ] as const;

  return (
    <div className="space-y-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((card) => (
          <StatCard
            key={card.id}
            icon={card.icon}
            title={reportsT.stats[card.titleKey]}
            value={card.value}
            unit={reportsT.stats[card.unitKey]}
            trendValue={card.trendValue}
            trendDirection={card.trendDirection}
            iconBgClass={card.iconBgClass}
            isLoading={isLoading}
          />
        ))}
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
