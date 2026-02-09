import { NextResponse } from "next/server";
import { serverApi, API_ENDPOINTS } from "@/shared/lib/api";
import {
  getRefreshToken,
  setAuthCookies,
  clearAuthCookies,
} from "@/shared/lib/cookies";

export async function POST() {
  try {
    const refreshToken = await getRefreshToken();

    if (!refreshToken) {
      return NextResponse.json(
        { message: "No refresh token" },
        { status: 401 }
      );
    }

    const { data } = await serverApi.post(API_ENDPOINTS.AUTH.REFRESH, {
      refresh_token: refreshToken,
    });

    const { token, refresh_token } = data.data;

    await setAuthCookies(token, refresh_token);

    return NextResponse.json({ success: true });
  } catch {
    await clearAuthCookies();
    return NextResponse.json(
      { message: "Token refresh failed" },
      { status: 401 }
    );
  }
}
