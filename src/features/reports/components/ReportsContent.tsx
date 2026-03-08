"use client";

import { CircleDollarSign, Users, CreditCard, FileText } from "lucide-react";
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

  // Don't show stat cards with placeholder zeros when there was an error (e.g. 401)
  if (isError) {
    return (
      <div className="space-y-6">
        <div className="rounded-2xl border border-grey-200 bg-white p-8 text-center">
          <p className="text-grey-600">{reportsT.error}</p>
        </div>
      </div>
    );
  }

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

      {/* Charts + Subscriptions + Latest Files Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {/* ProfitChart: full on mobile/tablet, 3/4 on desktop (right side in RTL) */}
        <div className="order-1 md:order-1 md:col-span-2 xl:col-span-3">
          <ProfitChart />
        </div>

        {/* FilesChart: full on mobile/tablet, 3/4 on desktop (right side in RTL) */}
        <div className="order-2 md:order-2 md:col-span-2 xl:col-span-3">
          <FilesChart />
        </div>

        {/* Subscriptions: desktop 1/4 on the LEFT (col 4 in RTL), row-span-2; tablet left half */}
        <div className="order-4 md:order-4 xl:col-start-4 xl:row-start-1 xl:row-span-2">
          <LatestSubscriptions
            trendValue={Math.abs(stats?.subscribersChange ?? 0)}
            trendDirection={
              (stats?.subscribersChange ?? 0) >= 0 ? "up" : "down"
            }
          />
        </div>

        {/* LatestFiles: tablet right half, desktop full width */}
        <div className="order-3 md:order-3 xl:col-span-4">
          <LatestFiles />
        </div>
      </div>
    </div>
  );
}
