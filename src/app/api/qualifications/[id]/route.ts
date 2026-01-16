/**
 * Qualifications API routes (by ID)
 * PUT /api/qualifications/[id] - Update qualification
 * DELETE /api/qualifications/[id] - Delete qualification
 */

import { NextRequest, NextResponse } from "next/server";
import { getAccessToken } from "@/shared/lib/cookies";
import { serverApi, API_ENDPOINTS } from "@/shared/lib/api";
import { isApiSuccess, type ApiResponse } from "@/features/auth/types/auth.types";
import type { Qualification } from "@/features/dashboard/types/me.types";

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * PUT /api/qualifications/[id] - Update qualification
 */
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const accessToken = await getAccessToken();

    if (!accessToken) {
      return NextResponse.json(
        { status: false, message: "غير مصرح", data: null },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json();

    const response = await serverApi.put<ApiResponse<Qualification>>(
      `${API_ENDPOINTS.MY_QUALIFICATIONS}/${id}`,
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
        message: response.data.message || "تم تحديث المؤهل بنجاح",
        data: response.data.data,
      });
    }

    return NextResponse.json(
      {
        status: false,
        message: response.data.message || "فشل في تحديث المؤهل",
        errors: response.data.errors,
      },
      { status: 400 }
    );
  } catch (error) {
    console.error("Update qualification error:", error);

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
          message: errorData?.message || "فشل في تحديث المؤهل",
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
 * DELETE /api/qualifications/[id] - Delete qualification
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const accessToken = await getAccessToken();

    if (!accessToken) {
      return NextResponse.json(
        { status: false, message: "غير مصرح", data: null },
        { status: 401 }
      );
    }

    const { id } = await params;

    const response = await serverApi.delete<ApiResponse<null>>(
      `${API_ENDPOINTS.MY_QUALIFICATIONS}/${id}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (isApiSuccess(response.data.status)) {
      return NextResponse.json({
        status: true,
        message: response.data.message || "تم حذف المؤهل بنجاح",
      });
    }

    return NextResponse.json(
      {
        status: false,
        message: response.data.message || "فشل في حذف المؤهل",
        errors: response.data.errors,
      },
      { status: 400 }
    );
  } catch (error) {
    console.error("Delete qualification error:", error);

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
          message: errorData?.message || "فشل في حذف المؤهل",
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
