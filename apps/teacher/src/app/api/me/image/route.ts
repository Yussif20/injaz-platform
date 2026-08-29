/**
 * Profile Image API route
 * POST /api/me/image - Upload profile image
 */

import { NextRequest, NextResponse } from "next/server";
import { getAccessToken } from "@/shared/lib/cookies";
import { BACKEND_API_URL, API_ENDPOINTS } from "@/shared/lib/api";
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

    // Backend expects multipart field name "file" (not "image")
    const backendFormData = new FormData();
    backendFormData.append("file", imageFile);

    // Use native fetch — handles File/Blob from request.formData() natively in Node.js 18+.
    // Axios can throw when serialising native File objects in Node.js; fetch does not.
    // Do NOT set Content-Type — fetch sets multipart/form-data with the correct boundary automatically.
    const fetchResponse = await fetch(
      `${BACKEND_API_URL}${API_ENDPOINTS.MY_IMAGE}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: backendFormData,
      }
    );

    // Read as text first so we can surface the backend's actual response
    // (status + body + headers) in logs when something upstream — Railway's
    // edge, Fastly, a WAF — intercepts the request and returns an empty
    // response. The old code called fetchResponse.json() directly and would
    // throw "Unexpected end of JSON input" with no context.
    const responseText = await fetchResponse.text();

    let responseData: ApiResponse<ImageUploadResponse> | null = null;
    if (responseText) {
      try {
        responseData = JSON.parse(responseText);
      } catch {
        console.error(
          "Backend returned non-JSON for /api/Me/image:",
          fetchResponse.status,
          responseText.slice(0, 500)
        );
      }
    } else {
      console.error(
        "Backend returned empty body for /api/Me/image:",
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
    console.error("Upload image error:", error);

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
