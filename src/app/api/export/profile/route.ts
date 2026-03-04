/**
 * GET /api/export/profile?token=<export-token>
 * Returns profile details using the embedded access token from the export token.
 * Used by the /preview/[id]/print page rendered by Puppeteer.
 */

import { NextRequest, NextResponse } from "next/server";
import { verifyExportToken } from "@/shared/lib/export-token";
import { serverApi, API_ENDPOINTS } from "@/shared/lib/api";
import { isApiSuccess, type ApiResponse } from "@/features/auth/types/auth.types";
import type { ProfileDetails, Profile } from "@/features/profiles/types";

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");

  if (!token) {
    return NextResponse.json({ status: false, message: "Missing token" }, { status: 400 });
  }

  const result = verifyExportToken(token);
  if (!result) {
    return NextResponse.json({ status: false, message: "Invalid or expired token" }, { status: 401 });
  }

  const { accessToken, profileId } = result;

  try {
    // Fetch profile details
    const detailsRes = await serverApi.get<ApiResponse<ProfileDetails>>(
      `${API_ENDPOINTS.PROFILES}/${profileId}/details`,
      { headers: { Authorization: `Bearer ${accessToken}` } },
    );

    if (!isApiSuccess(detailsRes.data.status)) {
      return NextResponse.json(
        { status: false, message: detailsRes.data.message || "Failed to fetch profile" },
        { status: 400 },
      );
    }

    // Also fetch profiles list to get imageUrl (details endpoint doesn't return it)
    let imageUrl: string | null = null;
    try {
      const profilesRes = await serverApi.get<ApiResponse<Profile[]>>(
        API_ENDPOINTS.MY_PROFILES,
        { headers: { Authorization: `Bearer ${accessToken}` } },
      );
      if (isApiSuccess(profilesRes.data.status) && profilesRes.data.data) {
        const match = profilesRes.data.data.find((p) => String(p.id) === profileId);
        if (match) imageUrl = match.imageUrl;
      }
    } catch {
      // Non-critical — fall back to details imageUrl
    }

    return NextResponse.json({
      status: true,
      message: "OK",
      data: {
        details: detailsRes.data.data,
        imageUrl,
      },
    });
  } catch (error) {
    console.error("Export profile fetch error:", error);
    return NextResponse.json(
      { status: false, message: "Failed to fetch profile data" },
      { status: 500 },
    );
  }
}
