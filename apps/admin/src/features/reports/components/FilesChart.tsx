"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { FileText } from "lucide-react";
import { useTranslation } from "@/i18n/TranslationContext";
import { TrendBadge } from "./TrendBadge";
import { ChartTooltip } from "./ChartTooltip";
import { useFilesChartData } from "../hooks";

export function FilesChart() {
  const { t } = useTranslation();
  const reportsT = t("reports");

  const { data: chartData = [], isLoading } = useFilesChartData();

  const totalFiles = chartData.reduce((sum, d) => sum + d.value, 0);

  // Calculate trend
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
          <div className="h-6 w-48 animate-pulse rounded bg-grey-200" />
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
          <FileText className="h-5 w-5" />
          <h3 className="text-base font-semibold">
            {reportsT.charts.filesCreated}{" "}
            <span className="font-normal text-grey-400">
              ({totalFiles.toLocaleString("ar-SA")} {reportsT.charts.totalFiles})
            </span>
          </h3>
        </div>
        <TrendBadge
          value={Math.abs(trendValue)}
          direction={trendValue >= 0 ? "up" : "down"}
        />
      </div>
      <p className="mb-4 text-xs text-grey-400">{reportsT.charts.vsLastMonth}</p>

      <div dir="ltr" className="h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
          >
            <defs>
              <linearGradient id="filesGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#008387" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#008387" stopOpacity={0.02} />
              </linearGradient>
            </defs>
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
            <Tooltip content={<ChartTooltip unit="ملف" />} />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#008387"
              strokeWidth={2}
              fill="url(#filesGradient)"
              dot={false}
              activeDot={{ r: 5, fill: "#008387", stroke: "#fff", strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
