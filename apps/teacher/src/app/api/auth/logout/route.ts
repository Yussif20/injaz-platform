/**
 * Logout API route
 * POST /api/auth/logout
 */

import { NextResponse } from "next/server";
import { clearAuthCookies } from "@/shared/lib/cookies";

export async function POST() {
  try {
    // Clear authentication cookies
    await clearAuthCookies();

    return NextResponse.json({
      status: true,
      message: "تم تسجيل الخروج بنجاح",
    });
  } catch (error) {
    console.error("Logout error:", error);

    return NextResponse.json(
      { status: false, message: "حدث خطأ أثناء تسجيل الخروج", errors: null },
      { status: 500 }
    );
  }
}
