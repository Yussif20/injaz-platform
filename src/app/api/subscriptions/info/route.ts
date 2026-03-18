/**
 * GET /api/subscriptions/info
 * Returns subscription pricing info (no auth required — public endpoint)
 */

import { NextResponse } from "next/server";
import { serverApi, API_ENDPOINTS } from "@/shared/lib/api";
import type { ApiResponse } from "@/features/auth/types/auth.types";

export async function GET() {
  try {
    const response = await serverApi.get<ApiResponse<unknown>>(
      API_ENDPOINTS.SUBSCRIPTION_INFO,
    );

    return NextResponse.json({
      status: true,
      message: response.data.message || "تم جلب معلومات الاشتراك",
      data: response.data.data,
    });
  } catch (error) {
    console.error("Subscription info error:", error);

    if (error && typeof error === "object" && "response" in error) {
      const axiosError = error as {
        response?: { data?: ApiResponse<null>; status?: number };
      };
      const errorData = axiosError.response?.data;
      const statusCode = axiosError.response?.status || 500;

      // Return 200 for 404 — subscription endpoints not yet implemented on backend
      return NextResponse.json(
        {
          status: false,
          message: errorData?.message || "فشل في جلب معلومات الاشتراك",
          errors: errorData?.errors || null,
        },
        { status: statusCode === 404 ? 200 : statusCode },
      );
    }

    return NextResponse.json(
      { status: false, message: "حدث خطأ غير متوقع", data: null },
      { status: 500 },
    );
  }
}
