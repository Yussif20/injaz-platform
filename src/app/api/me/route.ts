/**
 * Me API route
 * DELETE /api/me - Delete account
 */

import { NextResponse } from "next/server";
import { getAccessToken, clearAuthCookies } from "@/shared/lib/cookies";
import { serverApi, API_ENDPOINTS } from "@/shared/lib/api";
import { isApiSuccess, type ApiResponse } from "@/features/auth/types/auth.types";

export async function DELETE() {
  try {
    const accessToken = await getAccessToken();

    if (!accessToken) {
      return NextResponse.json(
        { status: false, message: "غير مصرح", data: null },
        { status: 401 }
      );
    }

    const response = await serverApi.delete<ApiResponse<null>>(
      API_ENDPOINTS.ME,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (isApiSuccess(response.data.status)) {
      // Clear auth cookies after successful account deletion
      await clearAuthCookies();

      return NextResponse.json({
        status: true,
        message: response.data.message || "تم حذف الحساب بنجاح",
        data: null,
      });
    }

    return NextResponse.json(
      {
        status: false,
        message: response.data.message || "فشل في حذف الحساب",
        errors: response.data.errors,
      },
      { status: 400 }
    );
  } catch (error) {
    console.error("Delete account error:", error);

    return NextResponse.json(
      { status: false, message: "حدث خطأ غير متوقع", data: null },
      { status: 500 }
    );
  }
}
