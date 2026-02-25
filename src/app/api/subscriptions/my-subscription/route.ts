/**
 * GET /api/subscriptions/my-subscription
 * Returns the current user's active subscription.
 */

import { NextResponse } from "next/server";
import { getAccessToken } from "@/shared/lib/cookies";
import { serverApi, API_ENDPOINTS } from "@/shared/lib/api";
import type { ApiResponse } from "@/features/auth/types/auth.types";

export async function GET() {
  try {
    const accessToken = await getAccessToken();

    if (!accessToken) {
      return NextResponse.json(
        { status: false, message: "غير مصرح", data: null },
        { status: 401 },
      );
    }

    const response = await serverApi.get<ApiResponse<unknown>>(
      API_ENDPOINTS.MY_SUBSCRIPTION,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    return NextResponse.json({
      status: true,
      message: response.data.message || "تم جلب بيانات الاشتراك",
      data: response.data.data,
    });
  } catch (error) {
    console.error("My subscription error:", error);

    if (error && typeof error === "object" && "response" in error) {
      const axiosError = error as {
        response?: { data?: ApiResponse<null>; status?: number };
      };
      const errorData = axiosError.response?.data;
      const statusCode = axiosError.response?.status || 500;

      return NextResponse.json(
        {
          status: false,
          message: errorData?.message || "فشل في جلب بيانات الاشتراك",
          errors: errorData?.errors || null,
        },
        { status: statusCode },
      );
    }

    return NextResponse.json(
      { status: false, message: "حدث خطأ غير متوقع", data: null },
      { status: 500 },
    );
  }
}
