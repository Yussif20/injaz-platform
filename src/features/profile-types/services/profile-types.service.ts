import { proxyApi } from "@/shared/lib/api";
import { unwrapResponse } from "@/shared/lib/api-helpers";
import type { ApiResponse, PaginatedData } from "@/shared/types";
import type {
  ProfileTypeDto,
  CreateProfileTypeDto,
  UpdateProfileTypeDto,
  ProfileTypeFilterParams,
} from "../types/profile-types.types";

const BASE_PATH = "ProfileTypes";

/**
 * Get all profile types (active + inactive)
 */
export async function getAllProfileTypes(): Promise<ProfileTypeDto[]> {
  const response = await proxyApi.get<ApiResponse<ProfileTypeDto[]>>(BASE_PATH);
  return unwrapResponse(response);
}

/**
 * Get filtered profile types with pagination
 */
export async function getFilteredProfileTypes(
  params: ProfileTypeFilterParams,
): Promise<PaginatedData<ProfileTypeDto>> {
  const response = await proxyApi.get<
    ApiResponse<PaginatedData<ProfileTypeDto>>
  >(`${BASE_PATH}/filtered`, { params });
  return unwrapResponse(response);
}

/**
 * Get profile type by ID
 */
export async function getProfileTypeById(id: number): Promise<ProfileTypeDto> {
  const response = await proxyApi.get<ApiResponse<ProfileTypeDto>>(
    `${BASE_PATH}/${id}`,
  );
  return unwrapResponse(response);
}

/**
 * Get profile type with full section/subsection hierarchy
 */
export async function getProfileTypeWithSections(
  id: number,
): Promise<ProfileTypeDto> {
  const response = await proxyApi.get<ApiResponse<ProfileTypeDto>>(
    `${BASE_PATH}/${id}/with-sections`,
  );
  return unwrapResponse(response);
}

/**
 * Create a new profile type
 */
export async function createProfileType(
  data: CreateProfileTypeDto,
): Promise<ProfileTypeDto> {
  const response = await proxyApi.post<ApiResponse<ProfileTypeDto>>(
    BASE_PATH,
    data,
  );
  return unwrapResponse(response);
}

/**
 * Update a profile type
 */
export async function updateProfileType(
  id: number,
  data: UpdateProfileTypeDto,
): Promise<ProfileTypeDto> {
  const response = await proxyApi.put<ApiResponse<ProfileTypeDto>>(
    `${BASE_PATH}/${id}`,
    data,
  );
  return unwrapResponse(response);
}

/**
 * Delete a profile type (cascades to sections/subsections)
 */
export async function deleteProfileType(id: number): Promise<void> {
  const response = await proxyApi.delete<ApiResponse<void>>(
    `${BASE_PATH}/${id}`,
  );
  unwrapResponse(response);
}

/**
 * Activate a profile type
 */
export async function activateProfileType(id: number): Promise<ProfileTypeDto> {
  const response = await proxyApi.put<ApiResponse<ProfileTypeDto>>(
    `${BASE_PATH}/${id}/activate`,
  );
  return unwrapResponse(response);
}

/**
 * Deactivate a profile type
 */
export async function deactivateProfileType(
  id: number,
): Promise<ProfileTypeDto> {
  const response = await proxyApi.put<ApiResponse<ProfileTypeDto>>(
    `${BASE_PATH}/${id}/deactivate`,
  );
  return unwrapResponse(response);
}

/**
 * Duplicate a profile type with all sections/subsections
 */
export async function duplicateProfileType(
  id: number,
): Promise<ProfileTypeDto> {
  const response = await proxyApi.post<ApiResponse<ProfileTypeDto>>(
    `${BASE_PATH}/${id}/duplicate`,
  );
  return unwrapResponse(response);
}
