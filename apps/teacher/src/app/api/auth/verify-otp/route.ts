/**
 * Verify OTP API route
 * POST /api/auth/verify-otp
 */

import { NextRequest, NextResponse } from "next/server";
import { serverApi, API_ENDPOINTS } from "@/shared/lib/api";
import {
  isApiSuccess,
  type ApiResponse,
  type VerifyOtpRequest,
} from "@/features/auth/types/auth.types";

export async function POST(request: NextRequest) {
  try {
    const body: VerifyOtpRequest = await request.json();

    if (!body.phone || !body.code) {
      return NextResponse.json(
        { status: false, message: "رقم الجوال ورمز التحقق مطلوبان", errors: null },
        { status: 400 }
      );
    }

    // Call backend to verify OTP
    const response = await serverApi.post<ApiResponse<boolean>>(
      API_ENDPOINTS.VERIFY_REGISTRATION_OTP,
      body
    );

    const { status, message, errors } = response.data;

    if (!isApiSuccess(status)) {
      return NextResponse.json({ status: false, message, errors }, { status: 400 });
    }

    return NextResponse.json({
      status: true,
      message: message || "تم التحقق من الرمز بنجاح",
    });
  } catch (error) {
    console.error("Verify OTP error:", error);

    if (error && typeof error === "object" && "response" in error) {
      const axiosError = error as { response?: { data?: ApiResponse<null> } };
      const errorData = axiosError.response?.data;
      return NextResponse.json(
        {
          status: false,
          message: errorData?.message || "رمز التحقق غير صحيح",
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
