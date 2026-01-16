/**
 * Profiles API routes
 * GET /api/profiles - Get all my profiles
 * POST /api/profiles - Create new profile
 */

import { NextRequest, NextResponse } from "next/server";
import { getAccessToken } from "@/shared/lib/cookies";
import { serverApi, API_ENDPOINTS } from "@/shared/lib/api";
import { isApiSuccess, type ApiResponse } from "@/features/auth/types/auth.types";
import type { Profile } from "@/features/profiles/types";

/**
 * GET /api/profiles - Get all my profiles
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

    const response = await serverApi.get<ApiResponse<Profile[]>>(
      API_ENDPOINTS.MY_PROFILES,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (isApiSuccess(response.data.status)) {
      return NextResponse.json({
        status: true,
        message: response.data.message || "تم جلب الملفات بنجاح",
        data: response.data.data,
      });
    }

    return NextResponse.json(
      {
        status: false,
        message: response.data.message || "فشل في جلب الملفات",
        errors: response.data.errors,
      },
      { status: 400 }
    );
  } catch (error) {
    console.error("Get profiles error:", error);

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
          message: errorData?.message || "فشل في جلب الملفات",
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

/**
 * POST /api/profiles - Create new profile
 */
export async function POST(request: NextRequest) {
  try {
    const accessToken = await getAccessToken();

    if (!accessToken) {
      return NextResponse.json(
        { status: false, message: "غير مصرح", data: null },
        { status: 401 }
      );
    }

    const body = await request.json();

    const response = await serverApi.post<ApiResponse<Profile>>(
      API_ENDPOINTS.MY_PROFILES,
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
        message: response.data.message || "تم إنشاء الملف بنجاح",
        data: response.data.data,
      });
    }

    return NextResponse.json(
      {
        status: false,
        message: response.data.message || "فشل في إنشاء الملف",
        errors: response.data.errors,
      },
      { status: 400 }
    );
  } catch (error) {
    console.error("Create profile error:", error);

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
          message: errorData?.message || "فشل في إنشاء الملف",
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
