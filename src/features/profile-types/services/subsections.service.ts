import { proxyApi } from "@/shared/lib/api";
import { unwrapResponse } from "@/shared/lib/api-helpers";
import type { ApiResponse } from "@/shared/types";
import type {
  SubsectionDto,
  CreateSubsectionDto,
  UpdateSubsectionDto,
  ReorderMap,
} from "../types/profile-types.types";

const BASE_PATH = "Subsections";

/**
 * Get all subsections for a section
 */
export async function getSubsectionsBySection(
  sectionId: number,
): Promise<SubsectionDto[]> {
  const response = await proxyApi.get<ApiResponse<SubsectionDto[]>>(
    `${BASE_PATH}/by-section/${sectionId}`,
  );
  return unwrapResponse(response);
}

/**
 * Get subsection by ID
 */
export async function getSubsectionById(id: number): Promise<SubsectionDto> {
  const response = await proxyApi.get<ApiResponse<SubsectionDto>>(
    `${BASE_PATH}/${id}`,
  );
  return unwrapResponse(response);
}

/**
 * Create a new subsection
 */
export async function createSubsection(
  data: CreateSubsectionDto,
): Promise<SubsectionDto> {
  const response = await proxyApi.post<ApiResponse<SubsectionDto>>(
    BASE_PATH,
    data,
  );
  return unwrapResponse(response);
}

/**
 * Update a subsection
 */
export async function updateSubsection(
  id: number,
  data: UpdateSubsectionDto,
): Promise<SubsectionDto> {
  const response = await proxyApi.put<ApiResponse<SubsectionDto>>(
    `${BASE_PATH}/${id}`,
    data,
  );
  return unwrapResponse(response);
}

/**
 * Delete a subsection
 */
export async function deleteSubsection(id: number): Promise<void> {
  const response = await proxyApi.delete<ApiResponse<void>>(
    `${BASE_PATH}/${id}`,
  );
  unwrapResponse(response);
}

/**
 * Reorder subsections within a section
 * @param sectionId - The section to reorder subsections for
 * @param reorderMap - Object mapping subsectionId to newDisplayOrder
 */
export async function reorderSubsections(
  sectionId: number,
  reorderMap: ReorderMap,
): Promise<void> {
  const response = await proxyApi.put<ApiResponse<void>>(
    `${BASE_PATH}/reorder/${sectionId}`,
    reorderMap,
  );
  unwrapResponse(response);
}
