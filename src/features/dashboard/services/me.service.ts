/**
 * Me service - Client-side API calls for user profile management
 */

import { clientApi } from "@/shared/lib/api";
// TODO: BYPASS - Remove before production
import { isBypassUser } from "@/shared/lib/bypass-storage";
import {
  MOCK_USER_PROFILE,
  MOCK_PERSONAL_INFO,
  MOCK_QUALIFICATIONS,
  MOCK_CAREER_JOBS,
  MOCK_PROFILE_COMPLETENESS,
} from "@/shared/lib/mock-data";
import type {
  UserProfile,
  PersonalInfo,
  UpdatePersonalInfoRequest,
  UpdateBasicInfoRequest,
  ChangePasswordRequest,
  MeApiResponse,
} from "../types/me.types";

// Response types
interface SimpleResponse {
  status: boolean;
  message: string;
  errors?: string[] | null;
}

interface ProfileResponse {
  status: boolean;
  message: string;
  data?: UserProfile;
  errors?: string[] | null;
}

interface PersonalInfoResponse {
  status: boolean;
  message: string;
  data?: PersonalInfo;
  errors?: string[] | null;
}

interface ImageUploadResponse {
  status: boolean;
  message: string;
  data?: { imageUrl: string };
  errors?: string[] | null;
}

/**
 * Get complete user profile
 */
export async function getMyProfile(): Promise<ProfileResponse> {
  // TODO: BYPASS - Remove before production
  if (isBypassUser()) {
    return {
      status: true,
      message: "Test bypass - Profile fetched",
      data: MOCK_USER_PROFILE,
    };
  }

  const response = await clientApi.get<ProfileResponse>("/api/me/profile");
  return response.data;
}

/**
 * Get personal info
 */
export async function getMyPersonalInfo(): Promise<PersonalInfoResponse> {
  // TODO: BYPASS - Remove before production
  if (isBypassUser()) {
    return {
      status: true,
      message: "Test bypass - Personal info fetched",
      data: MOCK_PERSONAL_INFO,
    };
  }

  const response = await clientApi.get<PersonalInfoResponse>("/api/me/personal-info");
  return response.data;
}

/**
 * Update personal info (nationalId, birthDate, email)
 */
export async function updatePersonalInfo(
  data: UpdatePersonalInfoRequest
): Promise<PersonalInfoResponse> {
  // TODO: BYPASS - Remove before production
  if (isBypassUser()) {
    return {
      status: true,
      message: "Test bypass - Personal info updated",
      data: { ...MOCK_PERSONAL_INFO, ...data },
    };
  }

  const response = await clientApi.put<PersonalInfoResponse>("/api/me/personal-info", data);
  return response.data;
}

/**
 * Update basic info (fullName, gender)
 */
export async function updateBasicInfo(
  data: UpdateBasicInfoRequest
): Promise<SimpleResponse> {
  // TODO: BYPASS - Remove before production
  if (isBypassUser()) {
    return {
      status: true,
      message: "Test bypass - Basic info updated",
    };
  }

  const response = await clientApi.put<SimpleResponse>("/api/me/basic-info", data);
  return response.data;
}

/**
 * Upload profile image
 */
export async function uploadProfileImage(file: File): Promise<ImageUploadResponse> {
  // TODO: BYPASS - Remove before production
  if (isBypassUser()) {
    // Create a fake URL for the uploaded image
    const fakeUrl = URL.createObjectURL(file);
    return {
      status: true,
      message: "Test bypass - Image uploaded",
      data: { imageUrl: fakeUrl },
    };
  }

  const formData = new FormData();
  formData.append("image", file);

  const response = await clientApi.post<ImageUploadResponse>("/api/me/image", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
}

/**
 * Delete account
 */
export async function deleteAccount(): Promise<SimpleResponse> {
  const response = await clientApi.delete<SimpleResponse>("/api/me");
  return response.data;
}

/**
 * Change password
 */
export async function changePassword(
  data: ChangePasswordRequest
): Promise<SimpleResponse> {
  // TODO: BYPASS - Remove before production
  if (isBypassUser()) {
    return {
      status: true,
      message: "Test bypass - Password changed successfully",
    };
  }

  try {
    const response = await clientApi.post<SimpleResponse>("/api/auth/change-password", data);
    return response.data;
  } catch (error) {
    // Handle axios error - extract response data
    if (error && typeof error === "object" && "response" in error) {
      const axiosError = error as { response?: { data?: SimpleResponse; status?: number } };
      if (axiosError.response?.data) {
        const responseData = axiosError.response.data;
        return {
          status: responseData.status ?? false,
          message: responseData.message || "فشل في تغيير كلمة المرور",
          errors: responseData.errors || null,
        };
      }
    }
    return {
      status: false,
      message: "فشل في تغيير كلمة المرور",
      errors: null,
    };
  }
}
