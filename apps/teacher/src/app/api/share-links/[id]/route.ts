/**
 * Share Link by ID API route
 * DELETE /api/share-links/[id] - Delete share link
 */

import { NextRequest, NextResponse } from "next/server";
import { getAccessToken } from "@/shared/lib/cookies";
import { serverApi, API_ENDPOINTS } from "@/shared/lib/api";
import { isApiSuccess, type ApiResponse } from "@/features/auth/types/auth.types";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const accessToken = await getAccessToken();

    if (!accessToken) {
      return NextResponse.json(
        { status: "Failure", message: "غير مصرح", data: null },
        { status: 401 }
      );
    }

    const { id } = await params;

    // Backend uses DELETE /api/ShareLinks/my-profile/{profileId} (not by link ID)
    const response = await serverApi.delete<ApiResponse<boolean>>(
      `${API_ENDPOINTS.SHARE_LINKS}/my-profile/${id}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (isApiSuccess(response.data.status)) {
      return NextResponse.json({
        status: "Success",
        message: response.data.message || "تم حذف رابط المشاركة بنجاح",
        data: response.data.data,
      });
    }

    return NextResponse.json(
      {
        status: "Failure",
        message: response.data.message || "فشل في حذف رابط المشاركة",
        errors: response.data.errors,
      },
      { status: 400 }
    );
  } catch (error) {
    console.error("Delete share link error:", error);

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
          message: errorData?.message || "فشل في حذف رابط المشاركة",
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
