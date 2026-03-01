/**
 * Image Upload API route
 * POST /api/images/upload - Upload image to subsection
 */

import { NextRequest, NextResponse } from "next/server";
import { getAccessToken } from "@/shared/lib/cookies";
import { BACKEND_API_URL, API_ENDPOINTS } from "@/shared/lib/api";
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

    // Re-create FormData for the backend request
    const backendFormData = new FormData();
    backendFormData.append("file", imageFile);

    // Build query params for backend
    const backendParams = new URLSearchParams();
    backendParams.append("profileId", profileId);
    backendParams.append("subsectionId", subsectionId);
    if (description) backendParams.append("description", description);
    if (displayOrder) backendParams.append("displayOrder", displayOrder);

    // Use native fetch — handles File/Blob from request.formData() natively in Node.js 18+.
    // Axios can throw when serialising native File objects in Node.js; fetch does not.
    // Do NOT set Content-Type — fetch sets multipart/form-data with the correct boundary automatically.
    const fetchResponse = await fetch(
      `${BACKEND_API_URL}${API_ENDPOINTS.IMAGES_UPLOAD}?${backendParams.toString()}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: backendFormData,
      }
    );

    const responseData = (await fetchResponse.json()) as ApiResponse<ProfileImage>;

    if (isApiSuccess(responseData.status)) {
      return NextResponse.json({
        status: "Success",
        message: responseData.message || "تم رفع الصورة بنجاح",
        data: responseData.data,
      });
    }

    return NextResponse.json(
      {
        status: "Failure",
        message: responseData.message || "فشل في رفع الصورة",
        errors: responseData.errors,
      },
      { status: fetchResponse.ok ? 400 : fetchResponse.status }
    );
  } catch (error) {
    console.error("Upload image error:", error);

    return NextResponse.json(
      { status: "Failure", message: "حدث خطأ غير متوقع", data: null },
      { status: 500 }
    );
  }
}
