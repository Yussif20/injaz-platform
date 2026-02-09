import { NextRequest, NextResponse } from "next/server";
import { serverApi, API_ENDPOINTS } from "@/shared/lib/api";
import { setAuthCookies } from "@/shared/lib/cookies";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { data } = await serverApi.post(API_ENDPOINTS.AUTH.LOGIN, body);

    const { token, refresh_token, user } = data.data;

    await setAuthCookies(token, refresh_token);

    return NextResponse.json({ user });
  } catch (error: unknown) {
    const status =
      error && typeof error === "object" && "response" in error
        ? (error as { response: { status: number } }).response?.status || 500
        : 500;
    const message =
      error && typeof error === "object" && "response" in error
        ? (error as { response: { data: { message?: string } } }).response
            ?.data?.message || "Login failed"
        : "Login failed";

    return NextResponse.json({ message }, { status });
  }
}
