/**
 * Reference Data service - Client-side API calls for reference data
 */

import { clientApi } from "@/shared/lib/api";
import type {
  AcademicYearsResponse,
  ProfileTypesResponse,
  ProfileTypeResponse,
  RanksResponse,
} from "../types/reference.types";

/**
 * Get all active academic years
 */
export async function getActiveAcademicYears(): Promise<AcademicYearsResponse> {
  const response = await clientApi.get<AcademicYearsResponse>("/api/academic-years");
  return response.data;
}

/**
 * Get available profile types (gender-filtered)
 */
export async function getAvailableProfileTypes(): Promise<ProfileTypesResponse> {
  const response = await clientApi.get<ProfileTypesResponse>("/api/profile-types");
  return response.data;
}

/**
 * Get profile type with sections by ID
 */
export async function getProfileTypeWithSections(id: number | string): Promise<ProfileTypeResponse> {
  const response = await clientApi.get<ProfileTypeResponse>(`/api/profile-types/${id}`);
  return response.data;
}

/**
 * Get all ranks
 */
export async function getRanks(): Promise<RanksResponse> {
  const response = await clientApi.get<RanksResponse>("/api/ranks");
  return response.data;
}
