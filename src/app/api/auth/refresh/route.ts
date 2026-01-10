/**
 * Refresh Token API route
 * POST /api/auth/refresh
 */

import { NextResponse } from "next/server";
import { getRefreshToken, setAuthCookies, clearAuthCookies } from "@/shared/lib/cookies";
import { serverApi, API_ENDPOINTS } from "@/shared/lib/api";
import { isApiSuccess, type ApiResponse, type AuthData, type User } from "@/features/auth/types/auth.types";

export async function POST() {
  try {
    const refreshToken = await getRefreshToken();

    if (!refreshToken) {
      return NextResponse.json(
        { status: false, message: "لا يوجد رمز تحديث", data: null },
        { status: 401 }
      );
    }

    // Call backend to refresh token
    const response = await serverApi.post<ApiResponse<AuthData>>(
      API_ENDPOINTS.REFRESH_TOKEN,
      { refreshToken }
    );

    const { status, message, data, errors } = response.data;

    if (!isApiSuccess(status) || !data) {
      await clearAuthCookies();
      return NextResponse.json(
        { status: false, message, errors, data: null },
        { status: 401 }
      );
    }

    // Set new tokens
    await setAuthCookies(data.token, data.refreshToken);

    // Return user data
    const user: User = {
      userId: data.userId,
      phone: data.phone,
      fullName: data.fullName,
      userName: data.userName,
      role: data.role,
    };

    return NextResponse.json({
      status: true,
      message: message || "تم تحديث الجلسة",
      data: user,
    });
  } catch (error) {
    console.error("Refresh token error:", error);

    await clearAuthCookies();

    if (error && typeof error === "object" && "response" in error) {
      const axiosError = error as { response?: { data?: ApiResponse<null> } };
      const errorData = axiosError.response?.data;
      return NextResponse.json(
        {
          status: false,
          message: errorData?.message || "فشل تحديث الجلسة",
          errors: errorData?.errors || null,
          data: null,
        },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { status: false, message: "حدث خطأ غير متوقع", data: null },
      { status: 500 }
    );
  }
}
