/**
 * Reference Data service - Client-side API calls for reference data
 */

import { clientApi } from "@/shared/lib/api";
// TODO: BYPASS - Remove before production
import { isBypassUser } from "@/shared/lib/bypass-storage";
import {
  MOCK_ACADEMIC_YEARS,
  MOCK_PROFILE_TYPES,
  MOCK_RANKS,
  MOCK_SECTIONS,
} from "@/shared/lib/mock-data";
import type {
  AcademicYear,
  ProfileType,
  Rank,
  AcademicYearsResponse,
  ProfileTypesResponse,
  ProfileTypeResponse,
  RanksResponse,
} from "../types/reference.types";

/**
 * Get all active academic years
 */
export async function getActiveAcademicYears(): Promise<AcademicYearsResponse> {
  // TODO: BYPASS - Remove before production
  if (isBypassUser()) {
    return {
      status: true,
      message: "Test bypass - Academic years fetched",
      data: MOCK_ACADEMIC_YEARS,
    };
  }

  const response = await clientApi.get<AcademicYearsResponse>("/api/academic-years");
  return response.data;
}

/**
 * Get available profile types (gender-filtered)
 */
export async function getAvailableProfileTypes(): Promise<ProfileTypesResponse> {
  // TODO: BYPASS - Remove before production
  if (isBypassUser()) {
    return {
      status: true,
      message: "Test bypass - Profile types fetched",
      data: MOCK_PROFILE_TYPES,
    };
  }

  const response = await clientApi.get<ProfileTypesResponse>("/api/profile-types");
  return response.data;
}

/**
 * Get profile type with sections by ID
 */
export async function getProfileTypeWithSections(id: number | string): Promise<ProfileTypeResponse> {
  // TODO: BYPASS - Remove before production
  if (isBypassUser()) {
    // Find matching profile type or return first one
    const profileType = MOCK_PROFILE_TYPES.find(pt => pt.id === String(id)) || MOCK_PROFILE_TYPES[0];
    return {
      status: true,
      message: "Test bypass - Profile type with sections fetched",
      data: {
        ...profileType,
        // Note: sections are attached in the ProfileTypeWithSections interface
      },
    };
  }

  const response = await clientApi.get<ProfileTypeResponse>(`/api/profile-types/${id}`);
  return response.data;
}

/**
 * Get all ranks
 */
export async function getRanks(): Promise<RanksResponse> {
  // TODO: BYPASS - Remove before production
  if (isBypassUser()) {
    return {
      status: true,
      message: "Test bypass - Ranks fetched",
      data: MOCK_RANKS,
    };
  }

  const response = await clientApi.get<RanksResponse>("/api/ranks");
  return response.data;
}
