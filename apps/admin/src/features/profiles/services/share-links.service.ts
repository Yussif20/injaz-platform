import { proxyApi, API_ENDPOINTS } from "@/shared/lib/api";
import { unwrapResponse } from "@/shared/lib/api-helpers";
import type { ApiResponse } from "@/shared/types";
import type { ShareLink } from "../types/share-link.types";

export async function getProfileShareLinks(
  profileId: number,
): Promise<ShareLink[]> {
  const response = await proxyApi.get<ApiResponse<ShareLink[]>>(
    API_ENDPOINTS.SHARE_LINKS.BY_PROFILE(profileId),
  );
  return unwrapResponse(response);
}
