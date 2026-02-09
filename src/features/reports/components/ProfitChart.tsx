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
import { profitChartData } from "../data/reports.mock";

function CustomTooltip({ active, payload }: any) {
  if (active && payload && payload.length) {
    return (
      <div
        dir="rtl"
        className="rounded-lg bg-primary-500 px-3 py-1.5 text-sm text-white shadow"
      >
        {payload[0].value.toLocaleString("ar-SA")} ريال
      </div>
    );
  }
  return null;
}

export function ProfitChart() {
  const { t } = useTranslation();
  const reportsT = t("reports");

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

  return (
    <div className="rounded-2xl border border-grey-200 bg-white p-5">
      <div className="mb-1 flex items-center justify-between">
        <div className="flex items-center gap-2 text-text-dark">
          <CircleDollarSign className="h-5 w-5" />
          <h3 className="text-base font-semibold">{reportsT.charts.profitStats}</h3>
        </div>
        <TrendBadge value={30} direction="up" />
      </div>
      <p className="mb-4 text-xs text-grey-400">{reportsT.charts.weekProfits}</p>

      <div dir="ltr" className="h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={profitChartData}
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
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(0,131,135,0.05)" }} />
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
