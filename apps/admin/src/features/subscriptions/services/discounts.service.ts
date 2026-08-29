import { proxyApi } from "@/shared/lib/api";
import { unwrapResponse } from "@/shared/lib/api-helpers";
import type { ApiResponse } from "@/shared/types";
import type {
  SubscriptionDiscountDto,
  CreateSubscriptionDiscountDto,
  UpdateSubscriptionDiscountDto,
} from "../types/subscriptions.types";

const BASE_PATH = "subscription-discounts";

/**
 * Get all discounts
 */
export async function getAllDiscounts(): Promise<SubscriptionDiscountDto[]> {
  const response =
    await proxyApi.get<ApiResponse<SubscriptionDiscountDto[]>>(BASE_PATH);
  return unwrapResponse(response);
}

/**
 * Get active discounts
 */
export async function getActiveDiscounts(): Promise<SubscriptionDiscountDto[]> {
  const response = await proxyApi.get<ApiResponse<SubscriptionDiscountDto[]>>(
    `${BASE_PATH}/active`,
  );
  return unwrapResponse(response);
}

/**
 * Get discount by ID
 */
export async function getDiscountById(
  id: number,
): Promise<SubscriptionDiscountDto> {
  const response = await proxyApi.get<ApiResponse<SubscriptionDiscountDto>>(
    `${BASE_PATH}/${id}`,
  );
  return unwrapResponse(response);
}

/**
 * Create a new discount
 */
export async function createDiscount(
  data: CreateSubscriptionDiscountDto,
): Promise<SubscriptionDiscountDto> {
  const response = await proxyApi.post<ApiResponse<SubscriptionDiscountDto>>(
    BASE_PATH,
    data,
  );
  return unwrapResponse(response);
}

/**
 * Update a discount
 */
export async function updateDiscount(
  id: number,
  data: UpdateSubscriptionDiscountDto,
): Promise<SubscriptionDiscountDto> {
  const response = await proxyApi.put<ApiResponse<SubscriptionDiscountDto>>(
    `${BASE_PATH}/${id}`,
    data,
  );
  return unwrapResponse(response);
}

/**
 * Delete a discount
 */
export async function deleteDiscount(id: number): Promise<void> {
  const response = await proxyApi.delete<ApiResponse<void>>(
    `${BASE_PATH}/${id}`,
  );
  unwrapResponse(response);
}

/**
 * Toggle discount active status
 */
export async function toggleDiscount(
  id: number,
): Promise<SubscriptionDiscountDto> {
  const response = await proxyApi.patch<ApiResponse<SubscriptionDiscountDto>>(
    `${BASE_PATH}/${id}/toggle`,
  );
  return unwrapResponse(response);
}
