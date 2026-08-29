/**
 * Career Jobs API routes (by ID)
 * PUT /api/career-jobs/[id] - Update career job
 * DELETE /api/career-jobs/[id] - Delete career job
 */

import { NextRequest, NextResponse } from "next/server";
import { getAccessToken } from "@/shared/lib/cookies";
import { serverApi, API_ENDPOINTS } from "@/shared/lib/api";
import { isApiSuccess, type ApiResponse } from "@/features/auth/types/auth.types";
import type { CareerJob } from "@/features/dashboard/types/me.types";

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * PUT /api/career-jobs/[id] - Update career job
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

    const response = await serverApi.put<ApiResponse<CareerJob>>(
      `${API_ENDPOINTS.MY_CAREER_JOBS}/${id}`,
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
        message: response.data.message || "تم تحديث الوظيفة بنجاح",
        data: response.data.data,
      });
    }

    return NextResponse.json(
      {
        status: false,
        message: response.data.message || "فشل في تحديث الوظيفة",
        errors: response.data.errors,
      },
      { status: 400 }
    );
  } catch (error) {
    console.error("Update career job error:", error);

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
          message: errorData?.message || "فشل في تحديث الوظيفة",
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
 * DELETE /api/career-jobs/[id] - Delete career job
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
      `${API_ENDPOINTS.MY_CAREER_JOBS}/${id}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (isApiSuccess(response.data.status)) {
      return NextResponse.json({
        status: true,
        message: response.data.message || "تم حذف الوظيفة بنجاح",
      });
    }

    return NextResponse.json(
      {
        status: false,
        message: response.data.message || "فشل في حذف الوظيفة",
        errors: response.data.errors,
      },
      { status: 400 }
    );
  } catch (error) {
    console.error("Delete career job error:", error);

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
          message: errorData?.message || "فشل في حذف الوظيفة",
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
