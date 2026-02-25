/**
 * POST /api/subscriptions/subscribe
 * Submits a payment token to subscribe. Forwards Idempotency-Key header.
 */

import { NextRequest, NextResponse } from "next/server";
import { getAccessToken } from "@/shared/lib/cookies";
import { serverApi, API_ENDPOINTS } from "@/shared/lib/api";
import type { ApiResponse } from "@/features/auth/types/auth.types";

export async function POST(request: NextRequest) {
  try {
    const accessToken = await getAccessToken();

    if (!accessToken) {
      return NextResponse.json(
        { status: false, message: "غير مصرح", data: null },
        { status: 401 },
      );
    }

    const body = await request.json();
    const idempotencyKey = request.headers.get("Idempotency-Key") || "";

    const response = await serverApi.post<ApiResponse<unknown>>(
      API_ENDPOINTS.SUBSCRIBE,
      body,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Idempotency-Key": idempotencyKey,
        },
      },
    );

    return NextResponse.json({
      status: true,
      message: response.data.message || "تمت عملية الدفع بنجاح",
      data: response.data.data,
    });
  } catch (error) {
    console.error("Subscribe error:", error);

    if (error && typeof error === "object" && "response" in error) {
      const axiosError = error as {
        response?: { data?: ApiResponse<null>; status?: number };
      };
      const errorData = axiosError.response?.data;
      const statusCode = axiosError.response?.status || 500;

      console.error("Backend response:", JSON.stringify(errorData, null, 2));

      return NextResponse.json(
        {
          status: false,
          message: errorData?.message || "فشلت عملية الدفع",
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
