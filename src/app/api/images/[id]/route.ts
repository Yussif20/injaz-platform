/**
 * Image API routes (by ID)
 * PUT /api/images/[id] - Update image
 * DELETE /api/images/[id] - Delete image
 */

import { NextRequest, NextResponse } from "next/server";
import { getAccessToken } from "@/shared/lib/cookies";
import { serverApi, API_ENDPOINTS } from "@/shared/lib/api";
import { isApiSuccess, type ApiResponse } from "@/features/auth/types/auth.types";
import type { ProfileImage } from "@/features/profiles/types/image.types";

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * PUT /api/images/[id] - Update image (description, displayOrder, or replace file)
 */
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const accessToken = await getAccessToken();

    if (!accessToken) {
      return NextResponse.json(
        { status: "Failure", message: "غير مصرح", data: null },
        { status: 401 }
      );
    }

    const { id } = await params;

    // Get query params
    const { searchParams } = new URL(request.url);
    const description = searchParams.get("description");
    const displayOrder = searchParams.get("displayOrder");

    // Build backend query params
    const backendParams = new URLSearchParams();
    if (description !== null) backendParams.append("description", description);
    if (displayOrder !== null) backendParams.append("displayOrder", displayOrder);

    // Check if request has form data (file upload)
    const contentType = request.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      const incomingFormData = await request.formData();
      const imageFile = incomingFormData.get("file");

      if (imageFile) {
        const backendFormData = new FormData();
        backendFormData.append("file", imageFile);

        const response = await serverApi.put<ApiResponse<ProfileImage>>(
          `${API_ENDPOINTS.IMAGES}/${id}?${backendParams.toString()}`,
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
            message: response.data.message || "تم تحديث الصورة بنجاح",
            data: response.data.data,
          });
        }

        return NextResponse.json(
          {
            status: "Failure",
            message: response.data.message || "فشل في تحديث الصورة",
            errors: response.data.errors,
          },
          { status: 400 }
        );
      }
    }

    // No file, just update metadata
    const response = await serverApi.put<ApiResponse<ProfileImage>>(
      `${API_ENDPOINTS.IMAGES}/${id}?${backendParams.toString()}`,
      null,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (isApiSuccess(response.data.status)) {
      return NextResponse.json({
        status: "Success",
        message: response.data.message || "تم تحديث الصورة بنجاح",
        data: response.data.data,
      });
    }

    return NextResponse.json(
      {
        status: "Failure",
        message: response.data.message || "فشل في تحديث الصورة",
        errors: response.data.errors,
      },
      { status: 400 }
    );
  } catch (error) {
    console.error("Update image error:", error);

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
          message: errorData?.message || "فشل في تحديث الصورة",
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

/**
 * DELETE /api/images/[id] - Delete image
 */
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

    const response = await serverApi.delete<ApiResponse<boolean>>(
      `${API_ENDPOINTS.IMAGES}/${id}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (isApiSuccess(response.data.status)) {
      return NextResponse.json({
        status: "Success",
        message: response.data.message || "تم حذف الصورة بنجاح",
        data: response.data.data,
      });
    }

    return NextResponse.json(
      {
        status: "Failure",
        message: response.data.message || "فشل في حذف الصورة",
        errors: response.data.errors,
      },
      { status: 400 }
    );
  } catch (error) {
    console.error("Delete image error:", error);

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
          message: errorData?.message || "فشل في حذف الصورة",
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
