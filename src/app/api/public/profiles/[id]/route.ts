/**
 * Public Profile API route
 * GET /api/public/profiles/[id] - Get profile details for public viewing
 * POST /api/public/profiles/[id] - Verify profile password (no auth required)
 */

import { NextRequest, NextResponse } from "next/server";
import { serverApi, API_ENDPOINTS } from "@/shared/lib/api";

/**
 * GET /api/public/profiles/[id] - Fetch public profile details
 * This calls the backend Profiles/{id}/details endpoint.
 * Returns profile metadata + whether it's password protected.
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const response = await serverApi.get(
      `${API_ENDPOINTS.PROFILES}/${id}/details`
    );

    const data = response.data;

    // Check if status indicates success
    const isSuccess =
      data.status === "Success" || data.status === true;

    if (isSuccess && data.data) {
      return NextResponse.json({
        status: true,
        message: data.message || "تم جلب البيانات بنجاح",
        data: data.data,
      });
    }

    return NextResponse.json(
      { status: false, message: data.message || "الملف غير موجود", data: null },
      { status: 404 }
    );
  } catch (error) {
    console.error("Public profile fetch error:", error);

    if (error && typeof error === "object" && "response" in error) {
      const axiosError = error as {
        response?: { status?: number; data?: { message?: string } };
      };
      const statusCode = axiosError.response?.status || 500;
      return NextResponse.json(
        {
          status: false,
          message: axiosError.response?.data?.message || "الملف غير موجود",
          data: null,
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

/**
 * POST /api/public/profiles/[id] - Verify profile password (no auth required)
 * Body: { password: string }
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { password } = await request.json();

    if (!password) {
      return NextResponse.json(
        { status: false, message: "كلمة المرور مطلوبة", data: { isValid: false } },
        { status: 400 }
      );
    }

    const response = await serverApi.post(
      `${API_ENDPOINTS.MY_PROFILES}/${id}/verify-password?password=${encodeURIComponent(password)}`
    );

    const data = response.data;
    const isSuccess = data.status === "Success" || data.status === true;

    if (isSuccess) {
      return NextResponse.json({
        status: true,
        message: "كلمة المرور صحيحة",
        data: { isValid: true },
      });
    }

    return NextResponse.json(
      {
        status: false,
        message: data.message || "كلمة المرور غير صحيحة",
        data: { isValid: false },
      },
      { status: 400 }
    );
  } catch (error) {
    console.error("Public password verify error:", error);

    if (error && typeof error === "object" && "response" in error) {
      const axiosError = error as {
        response?: { status?: number; data?: { message?: string } };
      };
      return NextResponse.json(
        {
          status: false,
          message: axiosError.response?.data?.message || "كلمة المرور غير صحيحة",
          data: { isValid: false },
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { status: false, message: "حدث خطأ غير متوقع", data: { isValid: false } },
      { status: 500 }
    );
  }
}
