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
import { filesChartData } from "../data/reports.mock";

function CustomTooltip({ active, payload }: any) {
  if (active && payload && payload.length) {
    return (
      <div
        dir="rtl"
        className="rounded-lg bg-primary-500 px-3 py-1.5 text-sm text-white shadow"
      >
        {payload[0].value.toLocaleString("ar-SA")} ملف
      </div>
    );
  }
  return null;
}

export function FilesChart() {
  const { t } = useTranslation();
  const reportsT = t("reports");

  const totalFiles = filesChartData.reduce((sum, d) => sum + d.value, 0);

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
          <FileText className="h-5 w-5" />
          <h3 className="text-base font-semibold">
            {reportsT.charts.filesCreated}{" "}
            <span className="font-normal text-grey-400">
              ({totalFiles.toLocaleString("ar-SA")} {reportsT.charts.totalFiles})
            </span>
          </h3>
        </div>
        <TrendBadge value={30} direction="up" />
      </div>
      <p className="mb-4 text-xs text-grey-400">{reportsT.charts.vsLastMonth}</p>

      <div dir="ltr" className="h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={filesChartData}
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
            <Tooltip content={<CustomTooltip />} />
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
