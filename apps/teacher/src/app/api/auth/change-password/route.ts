/**
 * Change Password API route
 * POST /api/auth/change-password
 */

import { NextRequest, NextResponse } from "next/server";
import { getAccessToken } from "@/shared/lib/cookies";
import { serverApi, API_ENDPOINTS } from "@/shared/lib/api";
import { isApiSuccess, type ApiResponse } from "@/features/auth/types/auth.types";
import type { ChangePasswordRequest } from "@/features/dashboard/types/me.types";

export async function POST(request: NextRequest) {
  try {
    const accessToken = await getAccessToken();

    if (!accessToken) {
      return NextResponse.json(
        { status: false, message: "غير مصرح", data: null },
        { status: 401 }
      );
    }

    const body: ChangePasswordRequest = await request.json();

    const response = await serverApi.post<ApiResponse<null>>(
      API_ENDPOINTS.CHANGE_PASSWORD,
      body,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (isApiSuccess(response.data.status)) {
      return NextResponse.json({
        status: true,
        message: response.data.message || "تم تغيير كلمة المرور بنجاح",
        data: null,
      });
    }

    return NextResponse.json(
      {
        status: false,
        message: response.data.message || "فشل في تغيير كلمة المرور",
        errors: response.data.errors,
      },
      { status: 400 }
    );
  } catch (error) {
    console.error("Change password error:", error);

    // Handle axios errors - extract backend error message
    if (error && typeof error === "object" && "response" in error) {
      const axiosError = error as {
        response?: {
          data?: ApiResponse<null>;
          status?: number;
        };
      };
      const errorData = axiosError.response?.data;
      const statusCode = axiosError.response?.status || 500;

      console.error("Backend response:", JSON.stringify(errorData, null, 2));

      // Extract error message - backend may return errors in different formats
      let errorMessage = "فشل في تغيير كلمة المرور";
      if (errorData?.message) {
        errorMessage = errorData.message;
      } else if (errorData?.errors && errorData.errors.length > 0) {
        errorMessage = errorData.errors.join(", ");
      }

      return NextResponse.json(
        {
          status: false,
          message: errorMessage,
          errors: errorData?.errors || null,
        },
        { status: statusCode }
      );
    }

    return NextResponse.json(
      { status: false, message: "حدث خطأ غير متوقع", data: null },
      { status: 500 }
    );
  }
}
