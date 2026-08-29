/**
 * Dashboard statistics DTO
 */
export interface DashboardStatsDto {
  totalProfits: number;
  totalProfitsChange: number; // percentage change from last month
  newUsersCount: number;
  newUsersChange: number;
  activeSubscribersCount: number;
  subscribersChange: number;
  publishedFilesCount: number;
  filesChange: number;
}

/**
 * Chart data point for time-series
 */
export interface ChartDataPoint {
  month: string;
  value: number;
}

/**
 * Profit chart data
 */
export interface ProfitChartDto {
  data: ChartDataPoint[];
  totalThisMonth: number;
  changeFromLastMonth: number; // percentage
}

/**
 * Files chart data
 */
export interface FilesChartDto {
  data: ChartDataPoint[];
  totalFiles: number;
  changeFromLastMonth: number; // percentage
}

/**
 * Latest subscription for dashboard
 */
export interface LatestSubscriptionDto {
  id: number;
  userName: string;
  userAvatar: string | null;
  subscribedAt: string; // ISO date
  amount: number;
}

/**
 * Latest file for dashboard
 */
export interface LatestFileDto {
  id: number;
  title: string;
  ownerName: string;
  ownerRank: string;
  academicYear: string;
  createdAt: string;
  isPublished: boolean;
}

/**
 * Full dashboard data response
 */
export interface DashboardDataDto {
  stats: DashboardStatsDto;
  profitChart: ProfitChartDto;
  filesChart: FilesChartDto;
  latestSubscriptions: LatestSubscriptionDto[];
  latestFiles: LatestFileDto[];
}
