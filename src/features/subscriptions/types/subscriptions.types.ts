import type { PaginatedQueryParams, PaginatedResponse } from "@/shared/types";

/**
 * Payment Status Enum
 * 0 = Pending, 1 = Completed, 2 = Failed, 3 = Refunded
 */
export enum PaymentStatus {
  Pending = 0,
  Completed = 1,
  Failed = 2,
  Refunded = 3,
}

/**
 * Subscription Discount from API
 */
export interface SubscriptionDiscountDto {
  id: number;
  title: string;
  discountPercentage: number;
  endDate: string; // date-time
  isActive: boolean;
  createdAt: string; // date-time
}

/**
 * Create Discount DTO
 */
export interface CreateSubscriptionDiscountDto {
  title: string;
  discountPercentage: number;
  endDate: string; // date-time
}

/**
 * Update Discount DTO
 */
export interface UpdateSubscriptionDiscountDto {
  title?: string;
  discountPercentage?: number | null;
  endDate?: string | null; // date-time
}

/**
 * Subscription DTO from API
 */
export interface SubscriptionDto {
  id: number;
  userId: number;
  subscribedAt: string; // date-time
  expiresAt: string; // date-time
  baseAmount: number;
  discountPercentage: number;
  discountAmount: number;
  finalAmount: number;
  paymentStatus: PaymentStatus;
  paymentMethod: string;
  paymentTransactionId: string;
  isActive: boolean;
  daysRemaining: number;
  appliedDiscount: SubscriptionDiscountDto | null;
  // Joined user info (for display)
  userName?: string;
  userPhone?: string;
}

/**
 * Subscription Info DTO (fees, discount, days remaining)
 */
export interface SubscriptionInfoDto {
  subscriptionFee: number;
  discountPercentage: number;
  finalAmount: number;
  daysRemaining: number;
  endDate: string; // date-time
  isSubscriptionOpen: boolean;
  activeDiscount: SubscriptionDiscountDto | null;
}

/**
 * Subscription Settings DTO
 */
export interface SubscriptionSettingsDto {
  id: number;
  isSubscriptionEnabled: boolean;
  subscriptionFee: number;
  subscriptionEndDate: string; // date-time
  activeDiscountId: number | null;
  updatedAt: string; // date-time
  activeDiscount: SubscriptionDiscountDto | null;
}

/**
 * Update Subscription Settings DTO
 */
export interface UpdateSubscriptionSettingsDto {
  isSubscriptionEnabled?: boolean | null;
  subscriptionFee?: number | null;
  subscriptionEndDate?: string | null; // date-time
  activeDiscountId?: number | null;
}

/**
 * Filter params for subscriptions list
 */
export interface SubscriptionFilterParams extends PaginatedQueryParams {
  IsActive?: boolean;
  ExpiresAfter?: string; // date-time
  ExpiresBefore?: string; // date-time
}

/**
 * Paginated subscriptions response
 */
export type PaginatedSubscriptions = PaginatedResponse<SubscriptionDto>;
