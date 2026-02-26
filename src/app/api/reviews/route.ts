/**
 * Reviews API route
 * GET /api/reviews - Get all active reviews (public)
 */

import { NextResponse } from "next/server";
import { getAccessToken } from "@/shared/lib/cookies";
import { serverApi, API_ENDPOINTS } from "@/shared/lib/api";
import { isApiSuccess, type ApiResponse } from "@/features/auth/types/auth.types";

interface ReviewDto {
  id: number;
  content: string | null;
  rating: number;
  reviewerName: string | null;
  reviewerJobTitle: string | null;
  reviewerPhotoPath: string | null;
  publicUrl: string | null;
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
}

/**
 * GET /api/reviews - Get active reviews for landing page
 */
export async function GET() {
  try {
    const accessToken = await getAccessToken();

    const headers: Record<string, string> = {};
    if (accessToken) {
      headers.Authorization = `Bearer ${accessToken}`;
    }

    const response = await serverApi.get<ApiResponse<ReviewDto[]>>(
      "/api/Reviews/active",
      { headers },
    );

    if (isApiSuccess(response.data.status)) {
      return NextResponse.json({
        status: true,
        message: response.data.message || "تم جلب التقييمات بنجاح",
        data: response.data.data,
      });
    }

    return NextResponse.json(
      {
        status: false,
        message: response.data.message || "فشل في جلب التقييمات",
        errors: response.data.errors,
      },
      { status: 400 },
    );
  } catch (error) {
    console.error("Get reviews error:", error);

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
          message: errorData?.message || "فشل في جلب التقييمات",
          errors: errorData?.errors || null,
        },
        { status: statusCode },
      );
    }

    return NextResponse.json(
      { status: false, message: "حدث خطأ غير متوقع", data: null },
      { status: 500 },
    );
  }
}
