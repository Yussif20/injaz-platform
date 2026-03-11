/**
 * Public Shared Profile API route
 * GET /api/public/shared/[token] - Get shared profile via ShareLinks token
 * Supports optional ?password= query param for password-protected profiles
 */

import { NextRequest, NextResponse } from "next/server";
import { serverApi, API_ENDPOINTS } from "@/shared/lib/api";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;
    const { searchParams } = new URL(request.url);
    const password = searchParams.get("password");

    // Build backend URL: /api/ShareLinks/shared/{token}?password=...
    let url = `${API_ENDPOINTS.SHARE_LINKS}/shared/${token}`;
    if (password) {
      url += `?password=${encodeURIComponent(password)}`;
    }

    // Public endpoint — no auth header needed
    const response = await serverApi.get(url);
    const data = response.data;

    const isSuccess =
      data.status === "Success" || data.status === true;

    if (isSuccess && data.data) {
      const profile = data.data;

      // Log actual response keys to help debug field mapping
      console.log("[SharedProfile] Response keys:", Object.keys(profile));
      console.log("[SharedProfile] userName:", profile.userName, "| userFullName:", profile.userFullName, "| imageUrl:", profile.imageUrl);

      return NextResponse.json({
        status: true,
        message: data.message || "تم جلب البيانات بنجاح",
        data: profile,
      });
    }

    return NextResponse.json(
      { status: false, message: data.message || "الملف غير موجود", data: null },
      { status: 404 }
    );
  } catch (error) {
    console.error("Public shared profile fetch error:", error);

    if (error && typeof error === "object" && "response" in error) {
      const axiosError = error as {
        response?: {
          status?: number;
          data?: { message?: string; errors?: string[] | null };
        };
      };
      const statusCode = axiosError.response?.status || 500;
      const message = axiosError.response?.data?.message || "";

      // Password required — backend returns 400 with password-related message
      if (
        statusCode === 400 &&
        (message.toLowerCase().includes("password") ||
          message.includes("كلمة المرور"))
      ) {
        return NextResponse.json(
          {
            status: false,
            passwordRequired: true,
            message: message || "كلمة المرور مطلوبة",
            data: null,
          },
          { status: 403 }
        );
      }

      // Not found / not published
      if (statusCode === 404) {
        return NextResponse.json(
          {
            status: false,
            message: message || "الملف غير موجود",
            data: null,
          },
          { status: 404 }
        );
      }

      return NextResponse.json(
        {
          status: false,
          message: message || "حدث خطأ غير متوقع",
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
