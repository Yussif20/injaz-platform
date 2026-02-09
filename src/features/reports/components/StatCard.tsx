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
}

export function StatCard({
  icon,
  title,
  value,
  unit,
  trendValue,
  trendDirection,
  iconBgClass,
}: StatCardProps) {
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
