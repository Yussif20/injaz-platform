import type { PaginatedQueryParams, PaginatedResponse } from "@/shared/types";

/**
 * Payment Status Enum — matches backend API values
 * 0 = Pending, 1 = Processing, 2 = Initiated, 3 = Completed,
 * 4 = Failed, 5 = Unknown, 6 = Cancelled
 */
export enum PaymentStatus {
  Pending = 0,
  Processing = 1,
  Initiated = 2,
  Completed = 3,
  Failed = 4,
  Unknown = 5,
  Cancelled = 6,
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
  requires3DSecure: boolean;
  threeDSecureUrl: string | null;
  paymentGatewayId: string | null;
  paymentFee: number | null;
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
  maxPaymentRetries: number;
  retryLockoutMinutes: number;
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
