/**
 * Personal Info API route
 * GET /api/me/personal-info - Get personal info
 * PUT /api/me/personal-info - Update personal info
 */

import { NextRequest, NextResponse } from "next/server";
import { getAccessToken } from "@/shared/lib/cookies";
import { serverApi, API_ENDPOINTS } from "@/shared/lib/api";
import { isApiSuccess, type ApiResponse } from "@/features/auth/types/auth.types";
import type { PersonalInfo, UpdatePersonalInfoRequest } from "@/features/dashboard/types/me.types";

function handleAxiosError(error: unknown, defaultMessage: string) {
  if (error && typeof error === "object" && "response" in error) {
    const axiosError = error as {
      response?: {
        data?: ApiResponse<null>;
        status?: number;
      }
    };
    const errorData = axiosError.response?.data;
    const statusCode = axiosError.response?.status || 500;

    console.error("Backend response:", JSON.stringify(errorData, null, 2));

    return NextResponse.json(
      {
        status: false,
        message: errorData?.message || defaultMessage,
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

export async function GET() {
  try {
    const accessToken = await getAccessToken();

    if (!accessToken) {
      return NextResponse.json(
        { status: false, message: "غير مصرح", data: null },
        { status: 401 }
      );
    }

    const response = await serverApi.get<ApiResponse<PersonalInfo>>(
      API_ENDPOINTS.MY_PERSONAL_INFO,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (isApiSuccess(response.data.status)) {
      return NextResponse.json({
        status: true,
        message: response.data.message || "تم جلب البيانات الشخصية",
        data: response.data.data,
      });
    }

    return NextResponse.json(
      {
        status: false,
        message: response.data.message || "فشل في جلب البيانات",
        errors: response.data.errors,
      },
      { status: 400 }
    );
  } catch (error) {
    console.error("Get personal info error:", error);
    return handleAxiosError(error, "فشل في جلب البيانات");
  }
}

export async function PUT(request: NextRequest) {
  try {
    const accessToken = await getAccessToken();

    if (!accessToken) {
      return NextResponse.json(
        { status: false, message: "غير مصرح", data: null },
        { status: 401 }
      );
    }

    const body: UpdatePersonalInfoRequest = await request.json();

    const response = await serverApi.put<ApiResponse<PersonalInfo>>(
      API_ENDPOINTS.MY_PERSONAL_INFO,
      body,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (isApiSuccess(response.data.status)) {
      return NextResponse.json({
        status: true,
        message: response.data.message || "تم تحديث البيانات الشخصية",
        data: response.data.data,
      });
    }

    return NextResponse.json(
      {
        status: false,
        message: response.data.message || "فشل في تحديث البيانات",
        errors: response.data.errors,
      },
      { status: 400 }
    );
  } catch (error) {
    console.error("Update personal info error:", error);
    return handleAxiosError(error, "فشل في تحديث البيانات");
  }
}
