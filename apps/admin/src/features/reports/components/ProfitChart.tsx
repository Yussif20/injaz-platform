"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { CircleDollarSign } from "lucide-react";
import { useTranslation } from "@/i18n/TranslationContext";
import { TrendBadge } from "./TrendBadge";
import { ChartTooltip } from "./ChartTooltip";
import { useProfitChartData } from "../hooks";

export function ProfitChart() {
  const { t } = useTranslation();
  const reportsT = t("reports");

  const { data: chartData = [], isLoading } = useProfitChartData();

  // Calculate total and trend
  const totalProfit = chartData.reduce((sum, d) => sum + d.value, 0);
  const currentMonthIndex = new Date().getMonth();
  const currentMonthValue = chartData[currentMonthIndex]?.value ?? 0;
  const lastMonthValue =
    chartData[currentMonthIndex > 0 ? currentMonthIndex - 1 : 11]?.value ?? 0;
  const trendValue =
    lastMonthValue > 0
      ? Math.round(
          ((currentMonthValue - lastMonthValue) / lastMonthValue) * 100,
        )
      : 0;

  const monthLabels: Record<string, string> = {
    jan: reportsT.months.jan,
    feb: reportsT.months.feb,
    mar: reportsT.months.mar,
    apr: reportsT.months.apr,
    may: reportsT.months.may,
    jun: reportsT.months.jun,
    jul: reportsT.months.jul,
    jul2: reportsT.months.jul,
    aug: reportsT.months.aug,
    sep: reportsT.months.sep,
    oct: reportsT.months.oct,
    nov: reportsT.months.nov,
    dec: reportsT.months.dec,
  };

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-grey-200 bg-white p-5">
        <div className="mb-4 flex items-center justify-between">
          <div className="h-6 w-40 animate-pulse rounded bg-grey-200" />
          <div className="h-5 w-20 animate-pulse rounded bg-grey-200" />
        </div>
        <div className="h-[280px] w-full animate-pulse rounded bg-grey-100" />
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-grey-200 bg-white p-5">
      <div className="mb-1 flex items-center justify-between">
        <div className="flex items-center gap-2 text-text-dark">
          <CircleDollarSign className="h-5 w-5" />
          <h3 className="text-base font-semibold">{reportsT.charts.profitStats}</h3>
        </div>
        <TrendBadge
          value={Math.abs(trendValue)}
          direction={trendValue >= 0 ? "up" : "down"}
        />
      </div>
      <p className="mb-4 text-xs text-grey-400">{reportsT.charts.weekProfits}</p>

      <div dir="ltr" className="h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
          >
            <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="month"
              tickFormatter={(v) => monthLabels[v] || v}
              tick={{ fontSize: 11, fill: "#9ca3af" }}
              axisLine={false}
              tickLine={false}
              reversed
            />
            <YAxis
              orientation="right"
              tick={{ fontSize: 11, fill: "#9ca3af" }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `${v} ®`}
            />
            <Tooltip
              content={<ChartTooltip unit="ريال" />}
              cursor={{ fill: "rgba(0,131,135,0.05)" }}
            />
            <Bar
              dataKey="value"
              fill="#008387"
              radius={[6, 6, 0, 0]}
              barSize={28}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
