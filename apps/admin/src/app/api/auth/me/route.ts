import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { BACKEND_API_URL, COOKIE_NAMES } from "@/config";
import { serverApi, API_ENDPOINTS } from "@/shared/lib/api";
import { setAuthCookies, clearAuthCookies } from "@/shared/lib/cookies";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAMES.AUTH_TOKEN)?.value;

  if (!token) {
    return NextResponse.json({ user: null });
  }

  try {
    const response = await fetch(`${BACKEND_API_URL}${API_ENDPOINTS.AUTH.ME}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.ok) {
      const data = await response.json();
      return NextResponse.json({ user: data.data ?? data });
    }

    // Token expired — try refresh
    if (response.status === 401) {
      const refreshToken = cookieStore.get(COOKIE_NAMES.REFRESH_TOKEN)?.value;
      if (!refreshToken) {
        await clearAuthCookies();
        return NextResponse.json({ user: null });
      }

      try {
        const { data: refreshData } = await serverApi.post(
          API_ENDPOINTS.AUTH.REFRESH,
          { refresh_token: refreshToken },
        );
        const { token: newToken, refresh_token: newRefresh } =
          refreshData.data;
        await setAuthCookies(newToken, newRefresh);

        // Retry with new token
        const retryResponse = await fetch(
          `${BACKEND_API_URL}${API_ENDPOINTS.AUTH.ME}`,
          { headers: { Authorization: `Bearer ${newToken}` } },
        );

        if (retryResponse.ok) {
          const retryData = await retryResponse.json();
          return NextResponse.json({ user: retryData.data ?? retryData });
        }
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
        await clearAuthCookies();
      }
    }

    return NextResponse.json({ user: null });
  } catch (error) {
    console.error("Auth /me error:", error);
    return NextResponse.json({ user: null });
  }
}
