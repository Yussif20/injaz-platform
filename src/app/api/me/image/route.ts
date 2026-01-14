/**
 * Profile Image API route
 * POST /api/me/image - Upload profile image
 */

import { NextRequest, NextResponse } from "next/server";
import { getAccessToken } from "@/shared/lib/cookies";
import { serverApi, API_ENDPOINTS } from "@/shared/lib/api";
import { isApiSuccess, type ApiResponse } from "@/features/auth/types/auth.types";

interface ImageUploadResponse {
  imageUrl: string;
}

export async function POST(request: NextRequest) {
  try {
    const accessToken = await getAccessToken();

    if (!accessToken) {
      return NextResponse.json(
        { status: false, message: "غير مصرح", data: null },
        { status: 401 }
      );
    }

    // Get the form data from the request
    const incomingFormData = await request.formData();
    const imageFile = incomingFormData.get("image");

    if (!imageFile) {
      return NextResponse.json(
        { status: false, message: "لم يتم تحديد صورة", data: null },
        { status: 400 }
      );
    }

    // Create a new FormData for the backend request
    const backendFormData = new FormData();
    backendFormData.append("image", imageFile);

    const response = await serverApi.post<ApiResponse<ImageUploadResponse>>(
      API_ENDPOINTS.MY_IMAGE,
      backendFormData,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (isApiSuccess(response.data.status)) {
      return NextResponse.json({
        status: true,
        message: response.data.message || "تم رفع الصورة بنجاح",
        data: response.data.data,
      });
    }

    return NextResponse.json(
      {
        status: false,
        message: response.data.message || "فشل في رفع الصورة",
        errors: response.data.errors,
      },
      { status: 400 }
    );
  } catch (error) {
    console.error("Upload image error:", error);

    // Handle axios errors - extract backend error message
    if (error && typeof error === "object" && "response" in error) {
      const axiosError = error as {
        response?: {
          data?: ApiResponse<null>;
          status?: number;
        }
      };
      const errorData = axiosError.response?.data;
      const statusCode = axiosError.response?.status || 500;

      console.error("Backend response:", errorData);

      return NextResponse.json(
        {
          status: false,
          message: errorData?.message || "فشل في رفع الصورة",
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
