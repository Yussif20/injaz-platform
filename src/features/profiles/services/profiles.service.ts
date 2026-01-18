/**
 * Profiles service - Client-side API calls for profile management
 */

import { clientApi } from "@/shared/lib/api";
// TODO: BYPASS - Remove before production
import {
  isBypassUser,
  getBypassProfiles,
  getBypassProfileDetails,
  addBypassProfile,
  updateBypassProfile,
  deleteBypassProfile,
  publishBypassProfile,
  unpublishBypassProfile,
  setBypassProfilePassword,
  removeBypassProfilePassword,
} from "@/shared/lib/bypass-storage";
import {
  MOCK_USER_PROFILE,
  MOCK_ACADEMIC_YEARS,
  MOCK_PROFILE_TYPES,
} from "@/shared/lib/mock-data";
import type {
  Profile,
  ProfileDetails,
  ProfileSaveValidation,
  CreateProfileRequest,
  UpdateTemplateRequest,
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
  // TODO: BYPASS - Remove before production
  if (isBypassUser()) {
    return {
      status: true,
      message: "Test bypass - Profiles fetched",
      data: getBypassProfiles(),
    };
  }

  const response = await clientApi.get<ProfilesResponse>("/api/profiles");
  return response.data;
}

/**
 * Create a new profile
 */
export async function createProfile(data: CreateProfileRequest): Promise<ProfileResponse> {
  // TODO: BYPASS - Remove before production
  if (isBypassUser()) {
    // Find the academic year and profile type names
    const academicYear = MOCK_ACADEMIC_YEARS.find(ay => ay.id === data.academicYearId);
    const profileType = MOCK_PROFILE_TYPES.find(pt => pt.id === data.profileTypeId);

    const newProfile = addBypassProfile({
      academicYearId: parseInt(data.academicYearId) || 1,
      academicYearName: academicYear?.name || "1446-1447",
      profileTypeId: parseInt(data.profileTypeId) || 1,
      profileTypeName: profileType?.nameFemale || "ملف إنجاز المعلمة",
      userFullName: MOCK_USER_PROFILE.fullName,
      personalInfo: MOCK_USER_PROFILE.personalInfo,
      qualifications: MOCK_USER_PROFILE.qualifications,
      careerJobs: MOCK_USER_PROFILE.careerJobs,
    });

    return {
      status: true,
      message: "Test bypass - Profile created",
      data: newProfile,
    };
  }

  const response = await clientApi.post<ProfileResponse>("/api/profiles", data);
  return response.data;
}

/**
 * Get profile details by ID
 */
export async function getProfileDetails(profileId: number): Promise<ProfileDetailsResponse> {
  // TODO: BYPASS - Remove before production
  if (isBypassUser()) {
    const details = getBypassProfileDetails(profileId);
    if (details) {
      return {
        status: true,
        message: "Test bypass - Profile details fetched",
        data: details,
      };
    }
    return {
      status: false,
      message: "Profile not found",
      errors: ["Profile not found"],
    };
  }

  const response = await clientApi.get<ProfileDetailsResponse>(`/api/profiles/${profileId}`);
  return response.data;
}

// ==================== Profile Updates ====================

/**
 * Upload profile image
 */
export async function uploadProfileImage(profileId: number, file: File): Promise<ProfileResponse> {
  // TODO: BYPASS - Remove before production
  if (isBypassUser()) {
    const fakeUrl = URL.createObjectURL(file);
    const updated = updateBypassProfile(profileId, { imageUrl: fakeUrl, useDefaultImage: false });
    if (updated) {
      return {
        status: true,
        message: "Test bypass - Profile image uploaded",
        data: updated,
      };
    }
    return {
      status: false,
      message: "Profile not found",
      errors: ["Profile not found"],
    };
  }

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
 * Update profile template
 */
export async function updateProfileTemplate(
  profileId: number,
  data: UpdateTemplateRequest
): Promise<ProfileResponse> {
  // TODO: BYPASS - Remove before production
  if (isBypassUser()) {
    const updated = updateBypassProfile(profileId, { templateId: parseInt(data.templateId) || 1 });
    if (updated) {
      return {
        status: true,
        message: "Test bypass - Template updated",
        data: updated,
      };
    }
    return {
      status: false,
      message: "Profile not found",
      errors: ["Profile not found"],
    };
  }

  const response = await clientApi.put<ProfileResponse>(
    `/api/profiles/${profileId}/template`,
    data
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
  // TODO: BYPASS - Remove before production
  if (isBypassUser()) {
    const academicYear = MOCK_ACADEMIC_YEARS.find(ay => ay.id === data.academicYearId);
    const updated = updateBypassProfile(profileId, {
      academicYearId: parseInt(data.academicYearId) || 1,
      academicYearName: academicYear?.name || "1446-1447",
    });
    if (updated) {
      return {
        status: true,
        message: "Test bypass - Academic year updated",
        data: updated,
      };
    }
    return {
      status: false,
      message: "Profile not found",
      errors: ["Profile not found"],
    };
  }

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
  // TODO: BYPASS - Remove before production
  if (isBypassUser()) {
    const profileType = MOCK_PROFILE_TYPES.find(pt => pt.id === data.profileTypeId);
    const updated = updateBypassProfile(profileId, {
      profileTypeId: parseInt(data.profileTypeId) || 1,
      profileTypeName: profileType?.nameFemale || "ملف إنجاز المعلمة",
    });
    if (updated) {
      return {
        status: true,
        message: "Test bypass - Profile type updated",
        data: updated,
      };
    }
    return {
      status: false,
      message: "Profile not found",
      errors: ["Profile not found"],
    };
  }

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
  // TODO: BYPASS - Remove before production
  if (isBypassUser()) {
    const success = setBypassProfilePassword(profileId);
    return {
      status: success,
      message: success ? "Test bypass - Password set" : "Profile not found",
    };
  }

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
  // TODO: BYPASS - Remove before production
  if (isBypassUser()) {
    const success = removeBypassProfilePassword(profileId);
    return {
      status: success,
      message: success ? "Test bypass - Password removed" : "Profile not found",
    };
  }

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
  // TODO: BYPASS - Remove before production
  if (isBypassUser()) {
    // For bypass, accept "123456" as the password
    const isValid = password === "123456";
    return {
      status: true,
      message: "Test bypass - Password verified",
      data: { isValid },
    };
  }

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
  // TODO: BYPASS - Remove before production
  if (isBypassUser()) {
    return {
      status: true,
      message: "Test bypass - Profile validated",
      data: {
        canSave: true,
        isUserDataComplete: true,
        areAllSubsectionsPopulated: false,
        missingUserDataFields: null,
        subsectionsWithoutImages: ["السيرة الذاتية", "الشهادات العلمية"],
        message: "يمكن حفظ الملف كمسودة",
      },
    };
  }

  const response = await clientApi.get<ProfileValidationResponse>(
    `/api/profiles/${profileId}/validate`
  );
  return response.data;
}

/**
 * Save profile as draft
 */
export async function saveDraft(profileId: number): Promise<SimpleResponse> {
  // TODO: BYPASS - Remove before production
  if (isBypassUser()) {
    const updated = updateBypassProfile(profileId, { status: "Draft" });
    return {
      status: !!updated,
      message: updated ? "Test bypass - Draft saved" : "Profile not found",
    };
  }

  const response = await clientApi.post<SimpleResponse>(`/api/profiles/${profileId}/save-draft`);
  return response.data;
}

/**
 * Publish profile
 */
export async function publishProfile(profileId: number): Promise<SimpleResponse> {
  // TODO: BYPASS - Remove before production
  if (isBypassUser()) {
    const success = publishBypassProfile(profileId);
    return {
      status: success,
      message: success ? "Test bypass - Profile published" : "Profile not found",
    };
  }

  const response = await clientApi.post<SimpleResponse>(`/api/profiles/${profileId}/publish`);
  return response.data;
}

/**
 * Unpublish profile
 */
export async function unpublishProfile(profileId: number): Promise<SimpleResponse> {
  // TODO: BYPASS - Remove before production
  if (isBypassUser()) {
    const success = unpublishBypassProfile(profileId);
    return {
      status: success,
      message: success ? "Test bypass - Profile unpublished" : "Profile not found",
    };
  }

  const response = await clientApi.post<SimpleResponse>(`/api/profiles/${profileId}/unpublish`);
  return response.data;
}

/**
 * Delete profile
 */
export async function deleteProfile(profileId: number): Promise<SimpleResponse> {
  // TODO: BYPASS - Remove before production
  if (isBypassUser()) {
    const success = deleteBypassProfile(profileId);
    return {
      status: success,
      message: success ? "Test bypass - Profile deleted" : "Profile not found",
    };
  }

  const response = await clientApi.delete<SimpleResponse>(`/api/profiles/${profileId}`);
  return response.data;
}
