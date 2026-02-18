import { proxyApi, API_ENDPOINTS } from "@/shared/lib/api";
import { unwrapResponse } from "@/shared/lib/api-helpers";
import type { ApiResponse, PaginatedData } from "@/shared/types";
import type { AdminProfileDto, ProfileFilterParams } from "../types/profiles.types";

export async function getFilteredProfiles(
  params?: ProfileFilterParams,
): Promise<PaginatedData<AdminProfileDto>> {
  const response = await proxyApi.get<ApiResponse<PaginatedData<AdminProfileDto>>>(
    API_ENDPOINTS.PROFILES.FILTERED,
    { params },
  );
  return unwrapResponse(response);
}
