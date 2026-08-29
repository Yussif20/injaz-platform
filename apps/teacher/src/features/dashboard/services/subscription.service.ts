/**
 * Subscription service - Client-side API calls for subscription management
 */

import { clientApi } from "@/shared/lib/api";
import type { Subscription, SubscriptionInfo } from "../types/me.types";

interface SubscriptionResponse {
  status: boolean;
  message: string;
  data?: Subscription | null;
  errors?: string[] | null;
}

interface SubscriptionInfoResponse {
  status: boolean;
  message: string;
  data?: SubscriptionInfo | null;
  errors?: string[] | null;
}

interface SubscriptionHistoryResponse {
  status: boolean;
  message: string;
  data?: Subscription[] | null;
  errors?: string[] | null;
}

/**
 * Get subscription info (pricing, discount, days remaining)
 */
export async function getSubscriptionInfo(): Promise<SubscriptionInfoResponse> {
  try {
    const response = await clientApi.get<SubscriptionInfoResponse>(
      "/api/subscriptions/info",
    );
    return response.data;
  } catch (error) {
    if (error && typeof error === "object" && "response" in error) {
      const axiosError = error as {
        response?: { data?: SubscriptionInfoResponse };
      };
      if (axiosError.response?.data) return axiosError.response.data;
    }
    return { status: false, message: "فشل في جلب معلومات الاشتراك" };
  }
}

/**
 * Get current user's active subscription
 */
export async function getMySubscription(): Promise<SubscriptionResponse> {
  try {
    const response = await clientApi.get<SubscriptionResponse>(
      "/api/subscriptions/my-subscription",
    );
    return response.data;
  } catch (error) {
    if (error && typeof error === "object" && "response" in error) {
      const axiosError = error as {
        response?: { data?: SubscriptionResponse };
      };
      if (axiosError.response?.data) return axiosError.response.data;
    }
    return { status: false, message: "فشل في جلب بيانات الاشتراك" };
  }
}

/**
 * Get current user's subscription history
 */
export async function getMySubscriptionHistory(): Promise<SubscriptionHistoryResponse> {
  try {
    const response = await clientApi.get<SubscriptionHistoryResponse>(
      "/api/subscriptions/my-history",
    );
    return response.data;
  } catch (error) {
    if (error && typeof error === "object" && "response" in error) {
      const axiosError = error as {
        response?: { data?: SubscriptionHistoryResponse };
      };
      if (axiosError.response?.data) return axiosError.response.data;
    }
    return { status: false, message: "فشل في جلب سجل الاشتراكات" };
  }
}

/**
 * Submit payment token to subscribe
 */
export async function subscribe(
  token: string,
  paymentMethod: string,
  idempotencyKey: string,
): Promise<SubscriptionResponse> {
  try {
    const response = await clientApi.post<SubscriptionResponse>(
      "/api/subscriptions/subscribe",
      { token, paymentMethod },
      { headers: { "Idempotency-Key": idempotencyKey } },
    );
    return response.data;
  } catch (error) {
    if (error && typeof error === "object" && "response" in error) {
      const axiosError = error as {
        response?: { data?: SubscriptionResponse };
      };
      if (axiosError.response?.data) return axiosError.response.data;
    }
    return { status: false, message: "فشلت عملية الدفع" };
  }
}
