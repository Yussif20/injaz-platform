/**
 * Image Upload API route
 * POST /api/images/upload - Upload image to subsection
 */

import { NextRequest, NextResponse } from "next/server";
import { getAccessToken } from "@/shared/lib/cookies";
import { serverApi, API_ENDPOINTS } from "@/shared/lib/api";
import { isApiSuccess, type ApiResponse } from "@/features/auth/types/auth.types";
import type { ProfileImage } from "@/features/profiles/types/image.types";

export async function POST(request: NextRequest) {
  try {
    const accessToken = await getAccessToken();

    if (!accessToken) {
      return NextResponse.json(
        { status: "Failure", message: "غير مصرح", data: null },
        { status: 401 }
      );
    }

    // Get query params
    const { searchParams } = new URL(request.url);
    const profileId = searchParams.get("profileId");
    const subsectionId = searchParams.get("subsectionId");
    const description = searchParams.get("description");
    const displayOrder = searchParams.get("displayOrder");

    if (!profileId || !subsectionId) {
      return NextResponse.json(
        { status: "Failure", message: "profileId و subsectionId مطلوبان", data: null },
        { status: 400 }
      );
    }

    // Get the form data from the request
    const incomingFormData = await request.formData();
    const imageFile = incomingFormData.get("file");

    if (!imageFile) {
      return NextResponse.json(
        { status: "Failure", message: "لم يتم تحديد صورة", data: null },
        { status: 400 }
      );
    }

    // Create backend form data
    const backendFormData = new FormData();
    backendFormData.append("file", imageFile);

    // Build query params for backend
    const backendParams = new URLSearchParams();
    backendParams.append("profileId", profileId);
    backendParams.append("subsectionId", subsectionId);
    if (description) backendParams.append("description", description);
    if (displayOrder) backendParams.append("displayOrder", displayOrder);

    const response = await serverApi.post<ApiResponse<ProfileImage>>(
      `${API_ENDPOINTS.IMAGES_UPLOAD}?${backendParams.toString()}`,
      backendFormData,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (isApiSuccess(response.data.status)) {
      return NextResponse.json({
        status: "Success",
        message: response.data.message || "تم رفع الصورة بنجاح",
        data: response.data.data,
      });
    }

    return NextResponse.json(
      {
        status: "Failure",
        message: response.data.message || "فشل في رفع الصورة",
        errors: response.data.errors,
      },
      { status: 400 }
    );
  } catch (error) {
    console.error("Upload image error:", error);

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
          message: errorData?.message || "فشل في رفع الصورة",
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
