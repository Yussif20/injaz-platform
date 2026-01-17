/**
 * Image Reorder API route
 * PUT /api/images/reorder/[subsectionId] - Reorder images within a subsection
 */

import { NextRequest, NextResponse } from "next/server";
import { getAccessToken } from "@/shared/lib/cookies";
import { serverApi, API_ENDPOINTS } from "@/shared/lib/api";
import { isApiSuccess, type ApiResponse } from "@/features/auth/types/auth.types";

interface RouteParams {
  params: Promise<{ subsectionId: string }>;
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const accessToken = await getAccessToken();

    if (!accessToken) {
      return NextResponse.json(
        { status: "Failure", message: "غير مصرح", data: null },
        { status: 401 }
      );
    }

    const { subsectionId } = await params;
    const body = await request.json();

    // body should be a mapping of imageId to displayOrder
    // e.g., { 1: 0, 2: 1, 3: 2 }

    const response = await serverApi.put<ApiResponse<boolean>>(
      `${API_ENDPOINTS.IMAGES}/reorder/${subsectionId}`,
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
        status: "Success",
        message: response.data.message || "تم إعادة ترتيب الصور بنجاح",
        data: response.data.data,
      });
    }

    return NextResponse.json(
      {
        status: "Failure",
        message: response.data.message || "فشل في إعادة ترتيب الصور",
        errors: response.data.errors,
      },
      { status: 400 }
    );
  } catch (error) {
    console.error("Reorder images error:", error);

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
          status: "Failure",
          message: errorData?.message || "فشل في إعادة ترتيب الصور",
          errors: errorData?.errors || null,
        },
        { status: statusCode }
      );
    }

    return NextResponse.json(
      { status: "Failure", message: "حدث خطأ غير متوقع", data: null },
      { status: 500 }
    );
  }
}
