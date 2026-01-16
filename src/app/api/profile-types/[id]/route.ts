/**
 * Profile Type by ID API routes
 * GET /api/profile-types/[id] - Get profile type with sections
 */

import { NextRequest, NextResponse } from "next/server";
import { getAccessToken } from "@/shared/lib/cookies";
import { serverApi, API_ENDPOINTS } from "@/shared/lib/api";
import { isApiSuccess, type ApiResponse } from "@/features/auth/types/auth.types";
import type { ProfileType } from "@/features/profiles/types";

/**
 * GET /api/profile-types/[id] - Get profile type with sections
 */
export async function GET(
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

    const response = await serverApi.get<ApiResponse<ProfileType>>(
      `${API_ENDPOINTS.PROFILE_TYPES}/${id}/with-sections`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (isApiSuccess(response.data.status)) {
      return NextResponse.json({
        status: true,
        message: response.data.message || "تم جلب نوع الملف بنجاح",
        data: response.data.data,
      });
    }

    return NextResponse.json(
      {
        status: false,
        message: response.data.message || "فشل في جلب نوع الملف",
        errors: response.data.errors,
      },
      { status: 400 }
    );
  } catch (error) {
    console.error("Get profile type error:", error);

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
          message: errorData?.message || "فشل في جلب نوع الملف",
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
