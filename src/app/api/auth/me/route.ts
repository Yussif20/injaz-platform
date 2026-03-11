/**
 * Get Current User API route
 * GET /api/auth/me
 */

import { NextResponse } from "next/server";
import { getAccessToken, getRefreshToken, setAuthCookies, clearAuthCookies } from "@/shared/lib/cookies";
import { serverApi, API_ENDPOINTS } from "@/shared/lib/api";
import { isApiSuccess, type ApiResponse, type AuthData, type User } from "@/features/auth/types/auth.types";

export async function GET() {
  try {
    const accessToken = await getAccessToken();

    if (!accessToken) {
      return NextResponse.json(
        { status: false, message: "غير مصرح", data: null },
        { status: 401 }
      );
    }

    // Call backend to get verified user data
    try {
      const response = await serverApi.get<ApiResponse<User>>(
        API_ENDPOINTS.ME,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (isApiSuccess(response.data.status) && response.data.data) {
        const data = response.data.data;
        return NextResponse.json({
          status: true,
          message: "تم جلب بيانات المستخدم",
          data: {
            userId: String(data.userId),
            phone: data.phone,
            fullName: data.fullName,
            userName: data.userName,
            role: data.role,
          } as User,
        });
      }
    } catch {
      // Token might be expired, try to refresh below
    }

    // Token failed — try to refresh
    const refreshToken = await getRefreshToken();

    if (!refreshToken) {
      await clearAuthCookies();
      return NextResponse.json(
        { status: false, message: "جلسة منتهية", data: null },
        { status: 401 }
      );
    }

    try {
      const response = await serverApi.post<ApiResponse<AuthData>>(
        API_ENDPOINTS.REFRESH_TOKEN,
        { refreshToken }
      );

      if (isApiSuccess(response.data.status) && response.data.data) {
        const { data } = response.data;
        await setAuthCookies(data.token, data.refreshToken);

        return NextResponse.json({
          status: true,
          message: "تم تحديث الجلسة",
          data: {
            userId: String(data.userId),
            phone: data.phone,
            fullName: data.fullName,
            userName: data.userName,
            role: data.role,
          } as User,
        });
      }
    } catch {
      // Refresh also failed
    }

    await clearAuthCookies();
    return NextResponse.json(
      { status: false, message: "جلسة منتهية", data: null },
      { status: 401 }
    );
  } catch (error) {
    console.error("Get user error:", error);

    return NextResponse.json(
      { status: false, message: "حدث خطأ غير متوقع", data: null },
      { status: 500 }
    );
  }
}
