import { proxyApi } from "@/shared/lib/api";
import { unwrapResponse } from "@/shared/lib/api-helpers";
import type { ApiResponse } from "@/shared/types";
import type {
  SubscriptionSettingsDto,
  UpdateSubscriptionSettingsDto,
} from "../types/subscriptions.types";

const BASE_PATH = "/subscription-settings";

/**
 * Get global subscription settings
 */
export async function getSubscriptionSettings(): Promise<SubscriptionSettingsDto> {
  const response =
    await proxyApi.get<ApiResponse<SubscriptionSettingsDto>>(BASE_PATH);
  return unwrapResponse(response);
}

/**
 * Update global subscription settings
 */
export async function updateSubscriptionSettings(
  data: UpdateSubscriptionSettingsDto,
): Promise<SubscriptionSettingsDto> {
  const response = await proxyApi.put<ApiResponse<SubscriptionSettingsDto>>(
    BASE_PATH,
    data,
  );
  return unwrapResponse(response);
}

/**
 * Toggle subscriptions enabled globally
 */
export async function toggleSubscriptions(): Promise<SubscriptionSettingsDto> {
  const response = await proxyApi.patch<ApiResponse<SubscriptionSettingsDto>>(
    `${BASE_PATH}/toggle`,
  );
  return unwrapResponse(response);
}

/**
 * Set active discount for new subscriptions
 */
export async function setActiveDiscount(
  discountId: number,
): Promise<SubscriptionSettingsDto> {
  const response = await proxyApi.patch<ApiResponse<SubscriptionSettingsDto>>(
    `${BASE_PATH}/active-discount/${discountId}`,
  );
  return unwrapResponse(response);
}
