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

    // Pass-through the raw multipart body (see /api/me/image for rationale).
    const contentType = request.headers.get("content-type");

    if (!contentType || !contentType.includes("multipart/form-data")) {
      return NextResponse.json(
        { status: "Failure", message: "نوع الطلب غير صحيح", data: null },
        { status: 400 }
      );
    }

    const body = Buffer.from(await request.arrayBuffer());

    // Build query params for backend
    const backendParams = new URLSearchParams();
    backendParams.append("profileId", profileId);
    backendParams.append("subsectionId", subsectionId);
    if (description) backendParams.append("description", description);
    if (displayOrder) backendParams.append("displayOrder", displayOrder);

    const fetchResponse = await fetch(
      `${BACKEND_API_URL}${API_ENDPOINTS.IMAGES_UPLOAD}?${backendParams.toString()}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": contentType,
        },
        body,
      }
    );

    const responseText = await fetchResponse.text();

    let responseData: ApiResponse<ProfileImage> | null = null;
    if (responseText) {
      try {
        responseData = JSON.parse(responseText);
      } catch {
        console.error(
          "Backend returned non-JSON for /api/Images/upload:",
          fetchResponse.status,
          responseText.slice(0, 500)
        );
      }
    } else {
      console.error(
        "Backend returned empty body for /api/Images/upload:",
        fetchResponse.status,
        Object.fromEntries(fetchResponse.headers.entries())
      );
    }

    if (responseData && isApiSuccess(responseData.status)) {
      return NextResponse.json({
        status: "Success",
        message: responseData.message || "تم رفع الصورة بنجاح",
        data: responseData.data,
      });
    }

    return NextResponse.json(
      {
        status: "Failure",
        message: responseData?.message || `فشل في رفع الصورة (HTTP ${fetchResponse.status})`,
        errors: responseData?.errors ?? (responseText ? [responseText.slice(0, 500)] : null),
      },
      { status: fetchResponse.ok ? 400 : fetchResponse.status }
    );
  } catch (error) {
    console.error("Upload image error:", error);

    return NextResponse.json(
      {
        status: "Failure",
        message: "حدث خطأ غير متوقع",
        data: null,
        errors: error instanceof Error ? [error.message] : null,
      },
      { status: 500 }
    );
  }
}
