/**
 * Academic Years API routes
 * GET /api/academic-years - Get all active academic years
 */

import { NextResponse } from "next/server";
import { getAccessToken } from "@/shared/lib/cookies";
import { serverApi, API_ENDPOINTS } from "@/shared/lib/api";
import { isApiSuccess, type ApiResponse } from "@/features/auth/types/auth.types";
import type { AcademicYear } from "@/features/profiles/types";

/**
 * GET /api/academic-years - Get all active academic years
 */
export async function GET() {
  try {
    const accessToken = await getAccessToken();

    if (!accessToken) {
      return NextResponse.json(
        { status: false, message: "غير مصرح", data: null },
        { status: 401 }
      );
    }

    const response = await serverApi.get<ApiResponse<AcademicYear[]>>(
      API_ENDPOINTS.ACADEMIC_YEARS_ACTIVE,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (isApiSuccess(response.data.status)) {
      return NextResponse.json({
        status: true,
        message: response.data.message || "تم جلب السنوات الدراسية بنجاح",
        data: response.data.data,
      });
    }

    return NextResponse.json(
      {
        status: false,
        message: response.data.message || "فشل في جلب السنوات الدراسية",
        errors: response.data.errors,
      },
      { status: 400 }
    );
  } catch (error) {
    console.error("Get academic years error:", error);

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
          message: errorData?.message || "فشل في جلب السنوات الدراسية",
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
