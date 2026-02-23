/**
 * Register API route
 * POST /api/auth/register
 */

import { NextRequest, NextResponse } from "next/server";
import { serverApi, API_ENDPOINTS } from "@/shared/lib/api";
import { setAuthCookies } from "@/shared/lib/cookies";
import {
  isApiSuccess,
  type ApiResponse,
  type AuthData,
  type RegisterCredentials,
  type User,
} from "@/features/auth/types/auth.types";

export async function POST(request: NextRequest) {
  try {
    const body: RegisterCredentials = await request.json();

    // Call backend register endpoint
    const response = await serverApi.post<ApiResponse<AuthData>>(
      API_ENDPOINTS.REGISTER,
      body
    );

    const { status, message, data, errors } = response.data;

    if (!isApiSuccess(status) || !data) {
      return NextResponse.json(
        { status: false, message, errors },
        { status: 400 }
      );
    }

    // Set HTTP-only cookies with tokens
    await setAuthCookies(data.token, data.refreshToken);

    // Return user data without tokens
    const user: User = {
      userId: String(data.userId),
      phone: data.phone,
      fullName: data.fullName,
      userName: data.userName,
      role: data.role,
    };

    return NextResponse.json({
      status: true,
      message: message || "تم إنشاء الحساب بنجاح",
      data: user,
    });
  } catch (error) {
    console.error("Register error:", error);

    if (error && typeof error === "object" && "response" in error) {
      const axiosError = error as { response?: { data?: ApiResponse<null> } };
      const errorData = axiosError.response?.data;
      return NextResponse.json(
        {
          status: false,
          message: errorData?.message || "فشل إنشاء الحساب",
          errors: errorData?.errors || null,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { status: false, message: "حدث خطأ غير متوقع", errors: null },
      { status: 500 }
    );
  }
}
