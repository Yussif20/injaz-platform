/**
 * GET /api/system-parameters/terms-and-conditions
 * Public proxy — no auth required (terms are publicly readable)
 */

import { NextResponse } from "next/server";
import { serverApi } from "@/shared/lib/api";
import { getAccessToken } from "@/shared/lib/cookies";

export async function GET() {
  try {
    const token = await getAccessToken();
    const headers: Record<string, string> = {};
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const response = await serverApi.get(
      "/api/SystemParameters/terms-and-conditions",
      { headers },
    );

    const data = response.data;

    if (data?.status === "Success") {
      return NextResponse.json({
        status: "Success",
        message: data.message,
        data: data.data,
      });
    }

    return NextResponse.json(
      { status: "Failure", message: data?.message || "فشل في جلب الشروط والأحكام", data: null },
      { status: 400 },
    );
  } catch (error: any) {
    const status = error?.response?.status || 500;
    const message = error?.response?.data?.message || "حدث خطأ غير متوقع";
    return NextResponse.json(
      { status: "Failure", message, data: null },
      { status },
    );
  }
}
