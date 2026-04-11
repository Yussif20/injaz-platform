/**
 * Profile Image API routes
 * POST /api/profiles/[id]/image - Upload profile image
 */

import { NextRequest, NextResponse } from "next/server";
import { getAccessToken } from "@/shared/lib/cookies";
import { BACKEND_API_URL, API_ENDPOINTS } from "@/shared/lib/api";
import { isApiSuccess, type ApiResponse } from "@/features/auth/types/auth.types";
import type { Profile } from "@/features/profiles/types";

/**
 * POST /api/profiles/[id]/image - Upload profile image
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const accessToken = await getAccessToken();

    if (!accessToken) {
      return NextResponse.json(
        { status: false, message: "غير مصرح", data: null },
        { status: 401 }
      );
    }

    // Pass-through the raw multipart body (see /api/me/image for rationale).
    const contentType = request.headers.get("content-type");

    if (!contentType || !contentType.includes("multipart/form-data")) {
      return NextResponse.json(
        { status: false, message: "نوع الطلب غير صحيح", data: null },
        { status: 400 }
      );
    }

    const body = Buffer.from(await request.arrayBuffer());

    const fetchResponse = await fetch(
      `${BACKEND_API_URL}${API_ENDPOINTS.MY_PROFILES}/${id}/image`,
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

    let responseData: ApiResponse<Profile> | null = null;
    if (responseText) {
      try {
        responseData = JSON.parse(responseText);
      } catch {
        console.error(
          "Backend returned non-JSON for /api/my-profiles/:id/image:",
          fetchResponse.status,
          responseText.slice(0, 500)
        );
      }
    } else {
      console.error(
        "Backend returned empty body for /api/my-profiles/:id/image:",
        fetchResponse.status,
        Object.fromEntries(fetchResponse.headers.entries())
      );
    }

    if (responseData && isApiSuccess(responseData.status)) {
      return NextResponse.json({
        status: true,
        message: responseData.message || "تم رفع الصورة بنجاح",
        data: responseData.data,
      });
    }

    return NextResponse.json(
      {
        status: false,
        message: responseData?.message || `فشل في رفع الصورة (HTTP ${fetchResponse.status})`,
        errors: responseData?.errors ?? (responseText ? [responseText.slice(0, 500)] : null),
      },
      { status: fetchResponse.ok ? 400 : fetchResponse.status }
    );
  } catch (error) {
    console.error("Upload profile image error:", error);

    return NextResponse.json(
      {
        status: false,
        message: "حدث خطأ غير متوقع",
        data: null,
        errors: error instanceof Error ? [error.message] : null,
      },
      { status: 500 }
    );
  }
}
