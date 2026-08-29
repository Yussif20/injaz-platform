import { NextResponse } from "next/server";
import { clearAuthCookies } from "@/shared/lib/cookies";

export async function POST() {
  try {
    await clearAuthCookies();
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { message: "Logout failed" },
      { status: 500 }
    );
  }
}
