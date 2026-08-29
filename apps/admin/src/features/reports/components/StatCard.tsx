"use client";

import type { ReactNode } from "react";
import { TrendBadge } from "./TrendBadge";

interface StatCardProps {
  icon: ReactNode;
  title: string;
  value: number;
  unit: string;
  trendValue: number;
  trendDirection: "up" | "down";
  iconBgClass: string;
  isLoading?: boolean;
}

export function StatCard({
  icon,
  title,
  value,
  unit,
  trendValue,
  trendDirection,
  iconBgClass,
  isLoading = false,
}: StatCardProps) {
  if (isLoading) {
    return (
      <div className="rounded-2xl border border-grey-200 bg-white p-5">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 animate-pulse rounded-full bg-grey-200" />
          <div className="h-4 w-24 animate-pulse rounded bg-grey-200" />
        </div>
        <div className="mt-3 h-8 w-32 animate-pulse rounded bg-grey-200" />
        <div className="mt-2 h-5 w-28 animate-pulse rounded bg-grey-200" />
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-grey-200 bg-white p-5">
      <div className="flex items-center gap-2 text-text-dark">
        <div
          className={`flex h-8 w-8 items-center justify-center rounded-full ${iconBgClass}`}
        >
          {icon}
        </div>
        <h3 className="text-sm font-normal">{title}</h3>
      </div>
      <p className="mt-3 text-2xl font-bold text-text-dark">
        {value.toLocaleString("ar-SA")} <span className="text-base font-normal">{unit}</span>
      </p>
      <div className="mt-2">
        <TrendBadge value={trendValue} direction={trendDirection} />
      </div>
    </div>
  );
}
