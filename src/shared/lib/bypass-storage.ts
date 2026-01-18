/**
 * Bypass Storage Helpers
 * TODO: BYPASS - Remove before production
 *
 * This file contains localStorage helpers for the bypass system.
 * Delete this entire file before production deployment.
 */

import type { Profile, ProfileDetails, ProfileSection, SubsectionImage } from "@/features/profiles/types/profile.types";
import { MOCK_SAMPLE_PROFILE, MOCK_PROFILE_DETAILS, generateMockId } from "./mock-data";

// localStorage keys
const BYPASS_USER_KEY = "bypass_user";
const BYPASS_USER_DATA_KEY = "bypass_user_data";
const BYPASS_PROFILES_KEY = "bypass_profiles";
const BYPASS_PROFILE_IMAGES_KEY = "bypass_profile_images";

// ============================================
// Bypass User Helpers
// ============================================

/**
 * Check if bypass user is logged in
 */
export function isBypassUser(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(BYPASS_USER_KEY) === "true";
}

/**
 * Set bypass user flag
 */
export function setBypassUser(userData: object): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(BYPASS_USER_KEY, "true");
  localStorage.setItem(BYPASS_USER_DATA_KEY, JSON.stringify(userData));

  // TODO: BYPASS - Remove before production
  // Set a bypass cookie that the middleware can read
  document.cookie = "bypass_auth=true; path=/; max-age=86400"; // 1 day

  // Initialize with sample profile if no profiles exist
  const existingProfiles = localStorage.getItem(BYPASS_PROFILES_KEY);
  if (!existingProfiles) {
    localStorage.setItem(BYPASS_PROFILES_KEY, JSON.stringify([MOCK_SAMPLE_PROFILE]));
  }
}

/**
 * Clear bypass user data (on logout)
 */
export function clearBypassUser(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(BYPASS_USER_KEY);
  localStorage.removeItem(BYPASS_USER_DATA_KEY);

  // TODO: BYPASS - Remove before production
  // Clear the bypass cookie
  document.cookie = "bypass_auth=; path=/; max-age=0";

  // Note: We keep profiles and images so user doesn't lose work
  // To fully clear: also remove BYPASS_PROFILES_KEY and BYPASS_PROFILE_IMAGES_KEY
}

/**
 * Get bypass user data
 */
export function getBypassUserData<T>(): T | null {
  if (typeof window === "undefined") return null;
  const data = localStorage.getItem(BYPASS_USER_DATA_KEY);
  if (!data) return null;
  try {
    return JSON.parse(data) as T;
  } catch {
    return null;
  }
}

// ============================================
// Profile Storage Helpers
// ============================================

/**
 * Get all bypass profiles
 */
export function getBypassProfiles(): Profile[] {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(BYPASS_PROFILES_KEY);
  if (!data) return [];
  try {
    return JSON.parse(data) as Profile[];
  } catch {
    return [];
  }
}

/**
 * Save bypass profiles
 */
export function saveBypassProfiles(profiles: Profile[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(BYPASS_PROFILES_KEY, JSON.stringify(profiles));
}

/**
 * Get single profile by ID
 */
export function getBypassProfile(profileId: number): Profile | null {
  const profiles = getBypassProfiles();
  return profiles.find(p => p.id === profileId) || null;
}

/**
 * Get profile details by ID (includes sections)
 */
export function getBypassProfileDetails(profileId: number): ProfileDetails | null {
  const profile = getBypassProfile(profileId);
  if (!profile) return null;

  // Get stored sections or use mock sections
  const imagesData = getBypassProfileImages();
  const profileImages = imagesData[profileId] || MOCK_PROFILE_DETAILS.sections;

  return {
    id: profile.id,
    userName: profile.userFullName,
    profileTypeName: profile.profileTypeName,
    academicYearName: profile.academicYearName,
    templateId: profile.templateId,
    personalInfo: profile.personalInfo,
    qualifications: profile.qualifications,
    careerJobs: profile.careerJobs,
    sections: profileImages,
    status: profile.status,
    publishedAt: profile.publishedAt,
  };
}

/**
 * Add new profile
 */
export function addBypassProfile(profileData: Partial<Profile>): Profile {
  const profiles = getBypassProfiles();

  const newProfile: Profile = {
    id: generateMockId(),
    userId: 1,
    userFullName: profileData.userFullName || "فاطمة أحمد",
    profileTypeId: profileData.profileTypeId || 1,
    profileTypeName: profileData.profileTypeName || "ملف إنجاز المعلمة",
    academicYearId: profileData.academicYearId || 1,
    academicYearName: profileData.academicYearName || "1446-1447",
    templateId: profileData.templateId || 1,
    imageUrl: null,
    useDefaultImage: true,
    personalInfo: profileData.personalInfo || null,
    qualifications: profileData.qualifications || null,
    careerJobs: profileData.careerJobs || null,
    status: "Draft",
    isPasswordProtected: false,
    publishedAt: null,
    createdAt: new Date().toISOString(),
    modifiedAt: new Date().toISOString(),
  };

  profiles.push(newProfile);
  saveBypassProfiles(profiles);

  // Initialize sections for new profile
  initializeProfileSections(newProfile.id);

  return newProfile;
}

/**
 * Update profile
 */
export function updateBypassProfile(profileId: number, updates: Partial<Profile>): Profile | null {
  const profiles = getBypassProfiles();
  const index = profiles.findIndex(p => p.id === profileId);

  if (index === -1) return null;

  profiles[index] = {
    ...profiles[index],
    ...updates,
    modifiedAt: new Date().toISOString(),
  };

  saveBypassProfiles(profiles);
  return profiles[index];
}

/**
 * Delete profile
 */
export function deleteBypassProfile(profileId: number): boolean {
  const profiles = getBypassProfiles();
  const filteredProfiles = profiles.filter(p => p.id !== profileId);

  if (filteredProfiles.length === profiles.length) return false;

  saveBypassProfiles(filteredProfiles);

  // Also remove profile images
  const imagesData = getBypassProfileImages();
  delete imagesData[profileId];
  saveBypassProfileImages(imagesData);

  return true;
}

// ============================================
// Profile Images/Sections Storage
// ============================================

interface ProfileImagesData {
  [profileId: number]: ProfileSection[];
}

/**
 * Get all profile images data
 */
export function getBypassProfileImages(): ProfileImagesData {
  if (typeof window === "undefined") return {};
  const data = localStorage.getItem(BYPASS_PROFILE_IMAGES_KEY);
  if (!data) return {};
  try {
    return JSON.parse(data) as ProfileImagesData;
  } catch {
    return {};
  }
}

/**
 * Save profile images data
 */
export function saveBypassProfileImages(data: ProfileImagesData): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(BYPASS_PROFILE_IMAGES_KEY, JSON.stringify(data));
}

/**
 * Initialize sections for a new profile
 */
export function initializeProfileSections(profileId: number): void {
  const imagesData = getBypassProfileImages();

  // Deep copy the mock sections
  imagesData[profileId] = JSON.parse(JSON.stringify(MOCK_PROFILE_DETAILS.sections));

  saveBypassProfileImages(imagesData);
}

/**
 * Get sections for a profile
 */
export function getBypassProfileSections(profileId: number): ProfileSection[] {
  const imagesData = getBypassProfileImages();
  return imagesData[profileId] || [];
}

/**
 * Add image to subsection
 */
export function addImageToSubsection(
  profileId: number,
  sectionId: number,
  subsectionId: number,
  image: SubsectionImage
): boolean {
  const imagesData = getBypassProfileImages();
  const sections = imagesData[profileId];

  if (!sections) return false;

  const section = sections.find(s => s.id === sectionId);
  if (!section || !section.subsections) return false;

  const subsection = section.subsections.find(sub => sub.id === subsectionId);
  if (!subsection) return false;

  if (!subsection.images) subsection.images = [];
  subsection.images.push(image);

  saveBypassProfileImages(imagesData);
  return true;
}

/**
 * Remove image from subsection
 */
export function removeImageFromSubsection(
  profileId: number,
  sectionId: number,
  subsectionId: number,
  imageId: number
): boolean {
  const imagesData = getBypassProfileImages();
  const sections = imagesData[profileId];

  if (!sections) return false;

  const section = sections.find(s => s.id === sectionId);
  if (!section || !section.subsections) return false;

  const subsection = section.subsections.find(sub => sub.id === subsectionId);
  if (!subsection || !subsection.images) return false;

  const imageIndex = subsection.images.findIndex(img => img.id === imageId);
  if (imageIndex === -1) return false;

  subsection.images.splice(imageIndex, 1);
  saveBypassProfileImages(imagesData);
  return true;
}

/**
 * Reorder images in subsection
 */
export function reorderSubsectionImages(
  profileId: number,
  sectionId: number,
  subsectionId: number,
  imageIds: number[]
): boolean {
  const imagesData = getBypassProfileImages();
  const sections = imagesData[profileId];

  if (!sections) return false;

  const section = sections.find(s => s.id === sectionId);
  if (!section || !section.subsections) return false;

  const subsection = section.subsections.find(sub => sub.id === subsectionId);
  if (!subsection || !subsection.images) return false;

  // Reorder based on imageIds array
  const reorderedImages: SubsectionImage[] = [];
  imageIds.forEach((id, index) => {
    const image = subsection.images!.find(img => img.id === id);
    if (image) {
      reorderedImages.push({ ...image, displayOrder: index + 1 });
    }
  });

  subsection.images = reorderedImages;
  saveBypassProfileImages(imagesData);
  return true;
}

// ============================================
// Profile Status Helpers
// ============================================

/**
 * Publish profile
 */
export function publishBypassProfile(profileId: number): boolean {
  const profile = updateBypassProfile(profileId, {
    status: "Published",
    publishedAt: new Date().toISOString(),
  });
  return !!profile;
}

/**
 * Unpublish profile
 */
export function unpublishBypassProfile(profileId: number): boolean {
  const profile = updateBypassProfile(profileId, {
    status: "Unpublished",
  });
  return !!profile;
}

/**
 * Set profile password
 */
export function setBypassProfilePassword(profileId: number): boolean {
  const profile = updateBypassProfile(profileId, {
    isPasswordProtected: true,
  });
  return !!profile;
}

/**
 * Remove profile password
 */
export function removeBypassProfilePassword(profileId: number): boolean {
  const profile = updateBypassProfile(profileId, {
    isPasswordProtected: false,
  });
  return !!profile;
}

// ============================================
// Clear All Bypass Data
// ============================================

/**
 * Clear all bypass data from localStorage
 */
export function clearAllBypassData(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(BYPASS_USER_KEY);
  localStorage.removeItem(BYPASS_USER_DATA_KEY);
  localStorage.removeItem(BYPASS_PROFILES_KEY);
  localStorage.removeItem(BYPASS_PROFILE_IMAGES_KEY);
}
