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

    const formData = await request.formData();
    const imageFile = formData.get("file");

    if (!imageFile) {
      return NextResponse.json(
        { status: false, message: "لم يتم تحديد صورة", data: null },
        { status: 400 }
      );
    }

    const backendFormData = new FormData();
    backendFormData.append("file", imageFile);

    // Use native fetch — handles File/Blob from request.formData() natively in Node.js 18+.
    // Axios can throw when serialising native File objects in Node.js; fetch does not.
    // Do NOT set Content-Type — fetch sets multipart/form-data with the correct boundary automatically.
    const fetchResponse = await fetch(
      `${BACKEND_API_URL}${API_ENDPOINTS.MY_PROFILES}/${id}/image`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: backendFormData,
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
