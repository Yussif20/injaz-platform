/**
 * Share Links API route
 * POST /api/share-links - Create (or get existing) share link
 *
 * Backend uses GET /api/ShareLinks/my-profile/{profileId} which
 * auto-creates a link if none exists, so we translate the client-side
 * POST into the backend's GET-or-create endpoint.
 */

import { NextRequest, NextResponse } from "next/server";
import { getAccessToken } from "@/shared/lib/cookies";
import { serverApi, API_ENDPOINTS } from "@/shared/lib/api";
import { isApiSuccess, type ApiResponse } from "@/features/auth/types/auth.types";
import type { ShareLink } from "@/features/profiles/types/share-link.types";

export async function POST(request: NextRequest) {
  try {
    const accessToken = await getAccessToken();

    if (!accessToken) {
      return NextResponse.json(
        { status: "Failure", message: "غير مصرح", data: null },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { profileId } = body as { profileId: number };

    if (!profileId) {
      return NextResponse.json(
        { status: "Failure", message: "معرف الملف مطلوب", data: null },
        { status: 400 }
      );
    }

    // Backend's GET endpoint returns existing link or auto-creates one
    const response = await serverApi.get<ApiResponse<ShareLink>>(
      `${API_ENDPOINTS.SHARE_LINKS}/my-profile/${profileId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (isApiSuccess(response.data.status)) {
      return NextResponse.json({
        status: "Success",
        message: response.data.message || "تم إنشاء رابط المشاركة بنجاح",
        data: response.data.data,
      });
    }

    return NextResponse.json(
      {
        status: "Failure",
        message: response.data.message || "فشل في إنشاء رابط المشاركة",
        errors: response.data.errors,
      },
      { status: 400 }
    );
  } catch (error) {
    console.error("Create share link error:", error);

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
          message: errorData?.message || "فشل في إنشاء رابط المشاركة",
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
