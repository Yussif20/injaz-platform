/**
 * Login API route
 * POST /api/auth/login
 */

import { NextRequest, NextResponse } from "next/server";
import { serverApi, API_ENDPOINTS } from "@/shared/lib/api";
import { setAuthCookies } from "@/shared/lib/cookies";
import {
  isApiSuccess,
  type ApiResponse,
  type AuthData,
  type LoginCredentials,
  type User,
} from "@/features/auth/types/auth.types";

export async function POST(request: NextRequest) {
  try {
    const body: LoginCredentials = await request.json();

    // Call backend login endpoint
    const response = await serverApi.post<ApiResponse<AuthData>>(
      API_ENDPOINTS.LOGIN,
      body
    );

    const { status, message, data, errors } = response.data;

    if (!isApiSuccess(status) || !data) {
      return NextResponse.json(
        { status: false, message, errors },
        { status: 401 }
      );
    }

    // Set HTTP-only cookies with tokens
    await setAuthCookies(data.token, data.refreshToken);

    // Return user data without tokens (backend may return userId as number)
    const user: User = {
      userId: String(data.userId),
      phone: data.phone,
      fullName: data.fullName,
      userName: data.userName,
      role: data.role,
    };

    return NextResponse.json({
      status: true,
      message,
      data: user,
    });
  } catch (error) {
    console.error("Login error:", error);

    // Handle axios errors
    if (error && typeof error === "object" && "response" in error) {
      const axiosError = error as { response?: { data?: ApiResponse<null> } };
      const errorData = axiosError.response?.data;
      return NextResponse.json(
        {
          status: false,
          message: errorData?.message || "فشل تسجيل الدخول",
          errors: errorData?.errors || null,
        },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { status: false, message: "حدث خطأ غير متوقع", errors: null },
      { status: 500 }
    );
  }
}
