/**
 * Reset Password API route
 * POST /api/auth/reset-password
 */

import { NextRequest, NextResponse } from "next/server";
import { serverApi, API_ENDPOINTS } from "@/shared/lib/api";
import {
  isApiSuccess,
  type ApiResponse,
  type ResetPasswordRequest,
} from "@/features/auth/types/auth.types";

export async function POST(request: NextRequest) {
  try {
    const body: ResetPasswordRequest = await request.json();

    if (!body.phone || !body.code || !body.newPassword) {
      return NextResponse.json(
        { status: false, message: "جميع الحقول مطلوبة", errors: null },
        { status: 400 }
      );
    }

    // Call backend to reset password
    const response = await serverApi.post<ApiResponse<boolean>>(
      API_ENDPOINTS.RESET_PASSWORD_WITH_OTP,
      body
    );

    const { status, message, errors } = response.data;

    if (!isApiSuccess(status)) {
      return NextResponse.json({ status: false, message, errors }, { status: 400 });
    }

    return NextResponse.json({
      status: true,
      message: message || "تم تغيير كلمة المرور بنجاح",
    });
  } catch (error) {
    console.error("Reset password error:", error);

    if (error && typeof error === "object" && "response" in error) {
      const axiosError = error as { response?: { data?: ApiResponse<null> } };
      const errorData = axiosError.response?.data;
      return NextResponse.json(
        {
          status: false,
          message: errorData?.message || "فشل تغيير كلمة المرور",
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
