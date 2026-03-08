import { proxyApi, API_ENDPOINTS } from "@/shared/lib/api";
import { unwrapResponse } from "@/shared/lib/api-helpers";
import type { ApiResponse, PaginatedData } from "@/shared/types";
import type { UserDto } from "@/features/users/types/users.types";
import type { SubscriptionDto } from "@/features/subscriptions/types/subscriptions.types";
import type { AdminProfileDto } from "@/features/profiles/types/profiles.types";
import { ProfileStatus } from "@/features/profiles/types/profiles.types";

const STORAGE_BASE_URL =
  process.env.NEXT_PUBLIC_STORAGE_URL ||
  "https://enjazmo3alem-staging.s3.us-east-005.backblazeb2.com";

const API_BASE_URL = "https://staging.enjazfile.com";

function normalizeImageUrl(path: string | null | undefined): string | null {
  if (!path || path.trim() === "") return null;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  const clean = path.startsWith("/") ? path.slice(1) : path;
  if (clean.startsWith("uploads/")) return `${STORAGE_BASE_URL}/${clean}`;
  return `${API_BASE_URL}/${clean}`;
}
import type {
  DashboardStatsDto,
  LatestSubscriptionDto,
  LatestFileDto,
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
  const allSubsResponse =
    await proxyApi.get<ApiResponse<SubscriptionDto[]>>("/Subscriptions");
  const allSubs = unwrapResponse(allSubsResponse);
  const totalProfits = allSubs.reduce(
    (sum, sub) => sum + (sub.finalAmount || 0),
    0,
  );

  // Fetch published profiles count
  const publishedResponse = await proxyApi.get<
    ApiResponse<PaginatedData<AdminProfileDto>>
  >(API_ENDPOINTS.PROFILES.FILTERED, {
    params: { PageSize: 1, PageNumber: 1, Status: ProfileStatus.Published },
  });
  const publishedData = unwrapResponse(publishedResponse);
  const publishedFilesCount = publishedData.totalCount;

  return {
    totalProfits,
    totalProfitsChange: 30, // placeholder
    newUsersCount: totalUsers,
    newUsersChange: -15, // placeholder
    activeSubscribersCount: activeSubscribers,
    subscribersChange: 20, // placeholder
    publishedFilesCount,
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

  // Fetch user details for avatars and names
  const uniqueUserIds = [...new Set(data.items.map((s) => s.userId))];
  const userMap = new Map<number, UserDto>();
  await Promise.all(
    uniqueUserIds.map(async (userId) => {
      try {
        const userRes = await proxyApi.get<ApiResponse<UserDto>>(
          API_ENDPOINTS.USERS.BY_ID(userId),
        );
        const user = unwrapResponse(userRes);
        userMap.set(userId, user);
      } catch {
        // User fetch failed — will fall back to subscription data
      }
    }),
  );

  return data.items.map((sub) => {
    const user = userMap.get(sub.userId);
    return {
      id: sub.id,
      userName: user?.fullName || sub.userName || "مستخدم",
      userAvatar: normalizeImageUrl(user?.imageUrl),
      subscribedAt: sub.subscribedAt,
      amount: sub.finalAmount,
    };
  });
}

/**
 * Get profit chart data (monthly aggregation)
 */
export async function getProfitChartData(): Promise<ChartDataPoint[]> {
  const response =
    await proxyApi.get<ApiResponse<SubscriptionDto[]>>("/Subscriptions");
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
 * Get files chart data (monthly aggregation from profiles)
 */
export async function getFilesChartData(): Promise<ChartDataPoint[]> {
  const response = await proxyApi.get<
    ApiResponse<PaginatedData<AdminProfileDto>>
  >(API_ENDPOINTS.PROFILES.FILTERED, {
    params: { PageSize: 10000, PageNumber: 1 },
  });
  const data = unwrapResponse(response);

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

  const monthlyData: Record<string, number> = {};
  months.forEach((m) => {
    monthlyData[m] = 0;
  });

  data.items.forEach((profile) => {
    if (profile.createdAt) {
      const monthIndex = new Date(profile.createdAt).getMonth();
      monthlyData[months[monthIndex]]++;
    }
  });

  return months.map((month) => ({
    month,
    value: monthlyData[month],
  }));
}

/**
 * Get latest created files/profiles
 */
export async function getLatestFiles(
  limit: number = 4,
): Promise<LatestFileDto[]> {
  const response = await proxyApi.get<
    ApiResponse<PaginatedData<AdminProfileDto>>
  >(API_ENDPOINTS.PROFILES.FILTERED, {
    params: {
      PageSize: limit,
      PageNumber: 1,
      SortBy: "CreatedAt",
      SortDescending: true,
    },
  });
  const data = unwrapResponse(response);

  return data.items.map((profile) => ({
    id: profile.id,
    title: `ملف انجاز ${profile.academicYearName}`,
    ownerName: profile.userName,
    ownerRank: profile.profileTypeName,
    academicYear: profile.academicYearName,
    createdAt: new Date(profile.createdAt).toLocaleDateString("ar", {
      day: "numeric",
      month: "numeric",
      year: "numeric",
    }),
    isPublished: profile.status === ProfileStatus.Published,
  }));
}
