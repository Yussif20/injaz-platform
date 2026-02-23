/**
 * Get Current User API route
 * GET /api/auth/me
 */

import { NextResponse } from "next/server";
import { getAccessToken, getRefreshToken, setAuthCookies, clearAuthCookies } from "@/shared/lib/cookies";
import { serverApi, API_ENDPOINTS } from "@/shared/lib/api";
import { isApiSuccess, type ApiResponse, type AuthData, type User } from "@/features/auth/types/auth.types";

// Microsoft-style JWT claim URIs
const JWT_CLAIMS = {
  PHONE: "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/mobilephone",
  NAME: "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name",
  ROLE: "http://schemas.microsoft.com/ws/2008/06/identity/claims/role",
  USERNAME: "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier",
};

// Decode JWT to get user info (without verification - server handles that)
function decodeJWT(token: string): User | null {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    const payload = JSON.parse(jsonPayload);

    // Support both Microsoft-style URI claims and simple claim names
    return {
      userId: payload.UserId || payload.nameid || payload.sub || "",
      phone: payload[JWT_CLAIMS.PHONE] || payload.phone || "",
      fullName: payload[JWT_CLAIMS.NAME] || payload.name || payload.fullName || "",
      userName: payload[JWT_CLAIMS.USERNAME] || payload.unique_name || payload.userName || "",
      role: payload[JWT_CLAIMS.ROLE] || payload.role || "",
    };
  } catch {
    return null;
  }
}

export async function GET() {
  try {
    const accessToken = await getAccessToken();

    if (!accessToken) {
      return NextResponse.json(
        { status: false, message: "غير مصرح", data: null },
        { status: 401 }
      );
    }

    // Decode token to get user info
    const user = decodeJWT(accessToken);

    if (!user) {
      // Token might be expired, try to refresh
      const refreshToken = await getRefreshToken();

      if (!refreshToken) {
        await clearAuthCookies();
        return NextResponse.json(
          { status: false, message: "جلسة منتهية", data: null },
          { status: 401 }
        );
      }

      // Try to refresh the token
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
        await clearAuthCookies();
        return NextResponse.json(
          { status: false, message: "جلسة منتهية", data: null },
          { status: 401 }
        );
      }
    }

    return NextResponse.json({
      status: true,
      message: "تم جلب بيانات المستخدم",
      data: user,
    });
  } catch (error) {
    console.error("Get user error:", error);

    return NextResponse.json(
      { status: false, message: "حدث خطأ غير متوقع", data: null },
      { status: 500 }
    );
  }
}
