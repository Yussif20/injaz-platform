import { proxyApi } from "@/shared/lib/api";
import { unwrapResponse } from "@/shared/lib/api-helpers";
import type { ApiResponse, PaginatedData } from "@/shared/types";
import type { UserDto } from "@/features/users/types/users.types";
import type { SubscriptionDto } from "@/features/subscriptions/types/subscriptions.types";
import type {
  DashboardStatsDto,
  LatestSubscriptionDto,
  ChartDataPoint,
} from "../types/reports.types";

/**
 * Get dashboard statistics
 * Aggregates data from users and subscriptions endpoints
 */
export async function getDashboardStats(): Promise<DashboardStatsDto> {
  // Fetch users count
  const usersResponse = await proxyApi.get<ApiResponse<PaginatedData<UserDto>>>(
    "/Users/filtered",
    { params: { PageSize: 1, PageNumber: 1 } },
  );
  const usersData = unwrapResponse(usersResponse);
  const totalUsers = usersData.totalCount;

  // Fetch active subscriptions count
  const subsResponse = await proxyApi.get<
    ApiResponse<PaginatedData<SubscriptionDto>>
  >("/Subscriptions/filtered", {
    params: { PageSize: 1, PageNumber: 1, IsActive: true },
  });
  const subsData = unwrapResponse(subsResponse);
  const activeSubscribers = subsData.totalCount;

  // Calculate total profits from subscriptions
  const allSubsResponse = await proxyApi.get<ApiResponse<SubscriptionDto[]>>(
    "/Subscriptions",
  );
  const allSubs = unwrapResponse(allSubsResponse);
  const totalProfits = allSubs.reduce(
    (sum, sub) => sum + (sub.finalAmount || 0),
    0,
  );

  // For now, use placeholder values for trends
  // In a real implementation, you'd compare with last month's data
  return {
    totalProfits,
    totalProfitsChange: 30, // placeholder
    newUsersCount: totalUsers,
    newUsersChange: -15, // placeholder
    activeSubscribersCount: activeSubscribers,
    subscribersChange: 20, // placeholder
    publishedFilesCount: 0, // No files endpoint available yet
    filesChange: 10, // placeholder
  };
}

/**
 * Get latest subscriptions for dashboard sidebar
 */
export async function getLatestSubscriptions(
  limit: number = 10,
): Promise<LatestSubscriptionDto[]> {
  const response = await proxyApi.get<
    ApiResponse<PaginatedData<SubscriptionDto>>
  >("/Subscriptions/filtered", {
    params: {
      PageSize: limit,
      PageNumber: 1,
      SortBy: "SubscribedAt",
      SortDescending: true,
    },
  });

  const data = unwrapResponse(response);

  return data.items.map((sub) => ({
    id: sub.id,
    userName: sub.userName || "مستخدم",
    userAvatar: null,
    subscribedAt: sub.subscribedAt,
    amount: sub.finalAmount,
  }));
}

/**
 * Get profit chart data (monthly aggregation)
 */
export async function getProfitChartData(): Promise<ChartDataPoint[]> {
  const response = await proxyApi.get<ApiResponse<SubscriptionDto[]>>(
    "/Subscriptions",
  );
  const subscriptions = unwrapResponse(response);

  // Group by month and sum profits
  const monthlyData: Record<string, number> = {};
  const months = [
    "jan",
    "feb",
    "mar",
    "apr",
    "may",
    "jun",
    "jul",
    "aug",
    "sep",
    "oct",
    "nov",
    "dec",
  ];

  // Initialize all months with 0
  months.forEach((month) => {
    monthlyData[month] = 0;
  });

  // Aggregate subscription amounts by month
  subscriptions.forEach((sub) => {
    if (sub.subscribedAt) {
      const date = new Date(sub.subscribedAt);
      const monthIndex = date.getMonth();
      const monthKey = months[monthIndex];
      monthlyData[monthKey] += sub.finalAmount || 0;
    }
  });

  return months.map((month) => ({
    month,
    value: monthlyData[month],
  }));
}

/**
 * Get files chart data (monthly aggregation)
 * Note: This is a placeholder until a files/profiles endpoint is available
 */
export async function getFilesChartData(): Promise<ChartDataPoint[]> {
  // Placeholder data - in real implementation, would fetch from profiles/files endpoint
  const months = [
    "jan",
    "feb",
    "mar",
    "apr",
    "may",
    "jun",
    "jul",
    "aug",
    "sep",
    "oct",
    "nov",
    "dec",
  ];

  return months.map((month) => ({
    month,
    value: 0, // No data available yet
  }));
}
