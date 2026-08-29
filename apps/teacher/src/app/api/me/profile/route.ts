/**
 * Get User Profile API route
 * GET /api/me/profile
 *
 * Tries /api/Me/profile first (full profile from DB),
 * falls back to /api/Me (basic info from JWT) if profile endpoint fails
 */

import { NextResponse } from "next/server";
import { getAccessToken } from "@/shared/lib/cookies";
import { serverApi, API_ENDPOINTS } from "@/shared/lib/api";
import { isApiSuccess, type ApiResponse } from "@/features/auth/types/auth.types";
import type { UserProfile } from "@/features/dashboard/types/me.types";

export async function GET() {
  try {
    const accessToken = await getAccessToken();

    if (!accessToken) {
      return NextResponse.json(
        { status: false, message: "غير مصرح", data: null },
        { status: 401 }
      );
    }

    // Try to get full profile from database
    try {
      const response = await serverApi.get<ApiResponse<UserProfile>>(
        API_ENDPOINTS.MY_PROFILE,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (isApiSuccess(response.data.status)) {
        return NextResponse.json({
          status: true,
          message: response.data.message || "تم جلب بيانات الملف الشخصي",
          data: response.data.data,
        });
      }
    } catch (profileError) {
      console.warn("Full profile fetch failed, trying basic info:", profileError);
    }

    // Fallback: Get basic user info from /api/Me
    const basicResponse = await serverApi.get<ApiResponse<UserProfile>>(
      API_ENDPOINTS.ME,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (isApiSuccess(basicResponse.data.status)) {
      return NextResponse.json({
        status: true,
        message: basicResponse.data.message || "تم جلب بيانات المستخدم",
        data: basicResponse.data.data,
      });
    }

    return NextResponse.json(
      {
        status: false,
        message: basicResponse.data.message || "فشل في جلب البيانات",
        errors: basicResponse.data.errors,
      },
      { status: 400 }
    );
  } catch (error) {
    console.error("Get profile error:", error);

    // Handle axios errors - extract backend error message
    if (error && typeof error === "object" && "response" in error) {
      const axiosError = error as {
        response?: {
          data?: ApiResponse<null>;
          status?: number;
        }
      };
      const errorData = axiosError.response?.data;
      const statusCode = axiosError.response?.status || 500;

      console.error("Backend response:", JSON.stringify(errorData, null, 2));

      return NextResponse.json(
        {
          status: false,
          message: errorData?.message || "فشل في جلب البيانات",
          errors: errorData?.errors || null,
        },
        { status: statusCode }
      );
    }

    return NextResponse.json(
      { status: false, message: "حدث خطأ غير متوقع", data: null },
      { status: 500 }
    );
  }
}
