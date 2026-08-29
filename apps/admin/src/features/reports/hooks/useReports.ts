"use client";

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/shared/lib/query-keys";
import {
  getDashboardStats,
  getLatestSubscriptions,
  getProfitChartData,
  getFilesChartData,
  getLatestFiles,
} from "../services/reports.service";

/**
 * Fetch dashboard statistics
 */
export function useDashboardStats() {
  return useQuery({
    queryKey: queryKeys.reports.stats(),
    queryFn: getDashboardStats,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Fetch latest subscriptions for sidebar
 */
export function useLatestSubscriptions(limit: number = 10) {
  return useQuery({
    queryKey: queryKeys.reports.latestSubscriptions(limit),
    queryFn: () => getLatestSubscriptions(limit),
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}

/**
 * Fetch profit chart data
 */
export function useProfitChartData() {
  return useQuery({
    queryKey: queryKeys.reports.profitChart(),
    queryFn: getProfitChartData,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Fetch files chart data
 */
export function useFilesChartData() {
  return useQuery({
    queryKey: queryKeys.reports.filesChart(),
    queryFn: getFilesChartData,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Fetch latest files/profiles for dashboard
 */
export function useLatestFiles(limit: number = 4) {
  return useQuery({
    queryKey: queryKeys.reports.latestFiles(limit),
    queryFn: () => getLatestFiles(limit),
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}
