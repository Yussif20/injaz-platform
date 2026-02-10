/**
 * Profiles service - Client-side API calls for profile management
 */

import { clientApi } from "@/shared/lib/api";
import type {
  Profile,
  ProfileDetails,
  ProfileSaveValidation,
  CreateProfileRequest,
  UpdateAcademicYearRequest,
  UpdateProfileTypeRequest,
  SetPasswordRequest,
  ProfilesResponse,
  ProfileResponse,
  ProfileDetailsResponse,
  ProfileValidationResponse,
  SimpleResponse,
} from "../types/profile.types";

// ==================== Profile CRUD ====================

/**
 * Get all my profiles
 */
export async function getMyProfiles(): Promise<ProfilesResponse> {
  const response = await clientApi.get<ProfilesResponse>("/api/profiles");
  return response.data;
}

/**
 * Create a new profile
 */
export async function createProfile(data: CreateProfileRequest): Promise<ProfileResponse> {
  const response = await clientApi.post<ProfileResponse>("/api/profiles", data);
  return response.data;
}

/**
 * Get profile details by ID
 */
export async function getProfileDetails(profileId: number): Promise<ProfileDetailsResponse> {
  const response = await clientApi.get<ProfileDetailsResponse>(`/api/profiles/${profileId}`);
  return response.data;
}

// ==================== Profile Updates ====================

/**
 * Upload profile image
 */
export async function uploadProfileImage(profileId: number, file: File): Promise<ProfileResponse> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await clientApi.post<ProfileResponse>(
    `/api/profiles/${profileId}/image`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
}

/**
 * Update profile academic year
 */
export async function updateProfileAcademicYear(
  profileId: number,
  data: UpdateAcademicYearRequest
): Promise<ProfileResponse> {
  const response = await clientApi.put<ProfileResponse>(
    `/api/profiles/${profileId}/academic-year`,
    data
  );
  return response.data;
}

/**
 * Update profile type
 */
export async function updateProfileType(
  profileId: number,
  data: UpdateProfileTypeRequest
): Promise<ProfileResponse> {
  const response = await clientApi.put<ProfileResponse>(
    `/api/profiles/${profileId}/profile-type`,
    data
  );
  return response.data;
}

// ==================== Password Protection ====================

/**
 * Set profile password
 */
export async function setProfilePassword(
  profileId: number,
  data: SetPasswordRequest
): Promise<SimpleResponse> {
  const response = await clientApi.post<SimpleResponse>(
    `/api/profiles/${profileId}/password`,
    data
  );
  return response.data;
}

/**
 * Remove profile password
 */
export async function removeProfilePassword(profileId: number): Promise<SimpleResponse> {
  const response = await clientApi.delete<SimpleResponse>(`/api/profiles/${profileId}/password`);
  return response.data;
}

/**
 * Verify profile password
 */
export async function verifyProfilePassword(
  profileId: number,
  password: string
): Promise<SimpleResponse & { data?: { isValid: boolean } }> {
  const response = await clientApi.post<SimpleResponse & { data?: { isValid: boolean } }>(
    `/api/profiles/${profileId}/verify-password`,
    { password }
  );
  return response.data;
}

// ==================== Publishing Workflow ====================

/**
 * Validate profile for save
 */
export async function validateProfile(profileId: number): Promise<ProfileValidationResponse> {
  const response = await clientApi.get<ProfileValidationResponse>(
    `/api/profiles/${profileId}/validate`
  );
  return response.data;
}

/**
 * Save profile as draft
 */
export async function saveDraft(profileId: number): Promise<SimpleResponse> {
  const response = await clientApi.post<SimpleResponse>(`/api/profiles/${profileId}/save-draft`);
  return response.data;
}

/**
 * Publish profile
 */
export async function publishProfile(profileId: number): Promise<SimpleResponse> {
  const response = await clientApi.post<SimpleResponse>(`/api/profiles/${profileId}/publish`);
  return response.data;
}

/**
 * Unpublish profile
 */
export async function unpublishProfile(profileId: number): Promise<SimpleResponse> {
  const response = await clientApi.post<SimpleResponse>(`/api/profiles/${profileId}/unpublish`);
  return response.data;
}

/**
 * Delete profile
 */
export async function deleteProfile(profileId: number): Promise<SimpleResponse> {
  const response = await clientApi.delete<SimpleResponse>(`/api/profiles/${profileId}`);
  return response.data;
}
