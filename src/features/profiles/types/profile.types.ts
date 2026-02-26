/**
 * Profile Types
 * Types for user profiles/portfolios
 */

import type { AcademicYear, ProfileType, Section, Subsection } from "./reference.types";

// Profile Status Enum
export enum ProfileStatus {
  Draft = "Draft",
  Unpublished = "Unpublished",
  Published = "Published",
}

// Personal Info (embedded in profile)
export interface PersonalInfo {
  rankId: number | null;
  rankTitleMale: string | null;
  rankTitleFemale: string | null;
  rankTitle: string | null;
  nationalId: string | null;
  birthDate: string;
  address: string | null;
  phoneNumber: string | null;
  email: string | null;
}

// Qualification (embedded in profile)
export interface Qualification {
  id: number;
  degreeType: string | null;
  title?: string | null; // deprecated, use major
  major?: string | null; // التخصص
  institution?: string | null;
  grade: string | null;
  graduationDate: string;
}

// Career Job (embedded in profile)
export interface CareerJob {
  id: number;
  title?: string | null;
  jobTitle?: string | null;
  rank?: string | null;
  school: string | null;
  educationalStage: string | null;
  startYear: number;
  endYear: number | null;
}

// Profile
export interface Profile {
  id: number;
  userId: number;
  userFullName: string | null;
  profileTypeId: number;
  profileTypeName: string | null;
  academicYearId: number;
  academicYearName: string | null;
  templateId: number;
  imageUrl: string | null;
  useDefaultImage: boolean;
  personalInfo: PersonalInfo | null;
  qualifications: Qualification[] | null;
  careerJobs: CareerJob[] | null;
  status: string | null;
  isPasswordProtected: boolean;
  publishedAt: string | null;
  createdAt: string;
  modifiedAt: string;
}

// Profile Image
export interface SubsectionImage {
  id: number;
  imagePath: string | null;
  publicUrl: string | null;
  description: string | null;
  displayOrder: number;
}

// Profile Section with images
export interface ProfileSection {
  id: number;
  title: string | null;
  weightPercent: number;
  displayOrder: number;
  subsections: ProfileSubsection[] | null;
}

// Profile Subsection with images
export interface ProfileSubsection {
  id: number;
  title: string | null;
  weightPercent: number;
  displayOrder: number;
  images: SubsectionImage[] | null;
}

// Profile Details (with sections and images)
export interface ProfileDetails {
  id: number;
  userName: string | null;
  profileTypeName: string | null;
  academicYearName: string | null;
  templateId: number;
  imageUrl: string | null;
  personalInfo: PersonalInfo | null;
  qualifications: Qualification[] | null;
  careerJobs: CareerJob[] | null;
  sections: ProfileSection[] | null;
  status: string | null;
  publishedAt: string | null;
}

// Profile Completeness
export interface ProfileCompleteness {
  isComplete: boolean;
  isPersonalDataComplete: boolean;
  hasCareerJobs: boolean;
  hasQualifications: boolean;
  missingFields: string[] | null;
  message: string | null;
}

// Profile Save Validation
export interface ProfileSaveValidation {
  canSave: boolean;
  isUserDataComplete: boolean;
  areAllSubsectionsPopulated: boolean;
  missingUserDataFields: string[] | null;
  subsectionsWithoutImages: string[] | null;
  message: string | null;
}

// Request types - IDs are integers matching the backend API
export interface CreateProfileRequest {
  academicYearId: number;     // Integer ID from backend
  profileTypeId: number;      // Integer ID from backend
  templateId?: number;        // Optional template ID
}

export interface UpdateTemplateRequest {
  templateId: number;
}

export interface UpdateAcademicYearRequest {
  academicYearId: number;
}

export interface UpdateProfileTypeRequest {
  profileTypeId: number;
}

export interface SetPasswordRequest {
  password: string;
  confirmPassword: string;
}

export interface VerifyPasswordRequest {
  password: string;
}

// API Response types
export interface ProfilesResponse {
  status: boolean;
  message: string;
  data?: Profile[];
  errors?: string[] | null;
}

export interface ProfileResponse {
  status: boolean;
  message: string;
  data?: Profile;
  errors?: string[] | null;
  debug?: unknown;
}

export interface ProfileDetailsResponse {
  status: boolean;
  message: string;
  data?: ProfileDetails;
  errors?: string[] | null;
}

export interface ProfileValidationResponse {
  status: boolean;
  message: string;
  data?: ProfileSaveValidation;
  errors?: string[] | null;
}

export interface SimpleResponse {
  status: boolean;
  message: string;
  errors?: string[] | null;
}
