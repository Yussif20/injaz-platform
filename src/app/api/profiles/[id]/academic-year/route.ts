/**
 * Profile Academic Year API routes
 * PUT /api/profiles/[id]/academic-year - Update profile academic year
 */

import { NextRequest, NextResponse } from "next/server";
import { getAccessToken } from "@/shared/lib/cookies";
import { serverApi, API_ENDPOINTS } from "@/shared/lib/api";
import { isApiSuccess, type ApiResponse } from "@/features/auth/types/auth.types";
import type { Profile } from "@/features/profiles/types";

/**
 * PUT /api/profiles/[id]/academic-year - Update profile academic year
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const accessToken = await getAccessToken();

    if (!accessToken) {
      return NextResponse.json(
        { status: false, message: "غير مصرح", data: null },
        { status: 401 }
      );
    }

    const body = await request.json();

    const response = await serverApi.put<ApiResponse<Profile>>(
      `${API_ENDPOINTS.MY_PROFILES}/${id}/academic-year`,
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
        message: response.data.message || "تم تحديث السنة الدراسية بنجاح",
        data: response.data.data,
      });
    }

    return NextResponse.json(
      {
        status: false,
        message: response.data.message || "فشل في تحديث السنة الدراسية",
        errors: response.data.errors,
      },
      { status: 400 }
    );
  } catch (error) {
    console.error("Update profile academic year error:", error);

    if (error && typeof error === "object" && "response" in error) {
      const axiosError = error as {
        response?: {
          data?: ApiResponse<null>;
          status?: number;
        };
      };
      const errorData = axiosError.response?.data;
      const statusCode = axiosError.response?.status || 500;

      return NextResponse.json(
        {
          status: false,
          message: errorData?.message || "فشل في تحديث السنة الدراسية",
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
