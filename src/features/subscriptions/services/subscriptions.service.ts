import { proxyApi } from "@/shared/lib/api";
import { unwrapResponse } from "@/shared/lib/api-helpers";
import type { ApiResponse, PaginatedData } from "@/shared/types";
import type {
  SubscriptionDto,
  SubscriptionInfoDto,
  SubscriptionFilterParams,
} from "../types/subscriptions.types";

const BASE_PATH = "/Subscriptions";

/**
 * Get subscription info (fees, discount, days remaining)
 */
export async function getSubscriptionInfo(): Promise<SubscriptionInfoDto> {
  const response = await proxyApi.get<ApiResponse<SubscriptionInfoDto>>(
    `${BASE_PATH}/info`,
  );
  return unwrapResponse(response);
}

/**
 * Subscribe to current period (auto-applies discount)
 */
export async function subscribe(): Promise<SubscriptionDto> {
  const response = await proxyApi.post<ApiResponse<SubscriptionDto>>(
    `${BASE_PATH}/subscribe`,
  );
  return unwrapResponse(response);
}

/**
 * Get current user's active subscription
 */
export async function getMySubscription(): Promise<SubscriptionDto | null> {
  const response = await proxyApi.get<ApiResponse<SubscriptionDto | null>>(
    `${BASE_PATH}/my-subscription`,
  );
  return unwrapResponse(response);
}

/**
 * Get current user's subscription history
 */
export async function getMySubscriptionHistory(): Promise<SubscriptionDto[]> {
  const response = await proxyApi.get<ApiResponse<SubscriptionDto[]>>(
    `${BASE_PATH}/my-history`,
  );
  return unwrapResponse(response);
}

/**
 * Get all subscriptions (Admin)
 */
export async function getAllSubscriptions(): Promise<SubscriptionDto[]> {
  const response =
    await proxyApi.get<ApiResponse<SubscriptionDto[]>>(BASE_PATH);
  return unwrapResponse(response);
}

/**
 * Get filtered subscriptions with pagination (Admin)
 */
export async function getFilteredSubscriptions(
  params: SubscriptionFilterParams,
): Promise<PaginatedData<SubscriptionDto>> {
  const response = await proxyApi.get<
    ApiResponse<PaginatedData<SubscriptionDto>>
  >(`${BASE_PATH}/filtered`, { params });
  return unwrapResponse(response);
}
