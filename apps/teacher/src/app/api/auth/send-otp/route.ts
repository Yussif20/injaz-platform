/**
 * Send Registration OTP API route
 * POST /api/auth/send-otp
 */

import { NextRequest, NextResponse } from "next/server";
import { serverApi, API_ENDPOINTS } from "@/shared/lib/api";
import { isApiSuccess, type ApiResponse } from "@/features/auth/types/auth.types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const phone: string = body.phone;

    if (!phone) {
      return NextResponse.json(
        { status: false, message: "رقم الجوال مطلوب", errors: null },
        { status: 400 }
      );
    }

    // Call backend to send OTP
    const response = await serverApi.post<ApiResponse<boolean>>(
      API_ENDPOINTS.SEND_REGISTRATION_OTP,
      { phone }
    );

    const { status, message, errors } = response.data;

    if (!isApiSuccess(status)) {
      return NextResponse.json({ status: false, message, errors }, { status: 400 });
    }

    return NextResponse.json({
      status: true,
      message: message || "تم إرسال رمز التحقق بنجاح",
    });
  } catch (error) {
    console.error("Send OTP error:", error);

    if (error && typeof error === "object" && "response" in error) {
      const axiosError = error as { response?: { data?: ApiResponse<null> } };
      const errorData = axiosError.response?.data;
      return NextResponse.json(
        {
          status: false,
          message: errorData?.message || "فشل إرسال رمز التحقق",
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
