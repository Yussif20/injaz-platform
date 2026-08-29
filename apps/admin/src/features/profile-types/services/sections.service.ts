import { proxyApi } from "@/shared/lib/api";
import { unwrapResponse } from "@/shared/lib/api-helpers";
import type { ApiResponse } from "@/shared/types";
import type {
  SectionDto,
  CreateSectionDto,
  UpdateSectionDto,
  ReorderMap,
} from "../types/profile-types.types";

const BASE_PATH = "Sections";

/**
 * Get all sections for a profile type (ordered by displayOrder)
 */
export async function getSectionsByProfileType(
  profileTypeId: number,
): Promise<SectionDto[]> {
  const response = await proxyApi.get<ApiResponse<SectionDto[]>>(
    `${BASE_PATH}/by-profile-type/${profileTypeId}`,
  );
  return unwrapResponse(response);
}

/**
 * Get section by ID
 */
export async function getSectionById(id: number): Promise<SectionDto> {
  const response = await proxyApi.get<ApiResponse<SectionDto>>(
    `${BASE_PATH}/${id}`,
  );
  return unwrapResponse(response);
}

/**
 * Get section with all subsections
 */
export async function getSectionWithSubsections(
  id: number,
): Promise<SectionDto> {
  const response = await proxyApi.get<ApiResponse<SectionDto>>(
    `${BASE_PATH}/${id}/with-subsections`,
  );
  return unwrapResponse(response);
}

/**
 * Create a new section
 */
export async function createSection(
  data: CreateSectionDto,
): Promise<SectionDto> {
  const response = await proxyApi.post<ApiResponse<SectionDto>>(
    BASE_PATH,
    data,
  );
  return unwrapResponse(response);
}

/**
 * Update a section
 */
export async function updateSection(
  id: number,
  data: UpdateSectionDto,
): Promise<SectionDto> {
  const response = await proxyApi.put<ApiResponse<SectionDto>>(
    `${BASE_PATH}/${id}`,
    data,
  );
  return unwrapResponse(response);
}

/**
 * Delete a section (cascades to subsections)
 */
export async function deleteSection(id: number): Promise<void> {
  const response = await proxyApi.delete<ApiResponse<void>>(
    `${BASE_PATH}/${id}`,
  );
  unwrapResponse(response);
}

/**
 * Reorder sections within a profile type
 * @param profileTypeId - The profile type to reorder sections for
 * @param reorderMap - Object mapping sectionId to newDisplayOrder
 */
export async function reorderSections(
  profileTypeId: number,
  reorderMap: ReorderMap,
): Promise<void> {
  const response = await proxyApi.put<ApiResponse<void>>(
    `${BASE_PATH}/reorder/${profileTypeId}`,
    reorderMap,
  );
  unwrapResponse(response);
}
