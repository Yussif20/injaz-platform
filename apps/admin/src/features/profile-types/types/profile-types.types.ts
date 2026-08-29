import type { PaginatedQueryParams, GenderAvailability } from "@/shared/types";

/**
 * Subsection DTO from API
 */
export interface SubsectionDto {
  id: number;
  sectionId: number;
  title: string;
  displayOrder: number;
  maxImageCount: number | null; // null = unlimited
  maxImageSize: number | null; // bytes, null = default (5MB)
}

/**
 * Create Subsection DTO
 */
export interface CreateSubsectionDto {
  sectionId: number;
  title: string;
  displayOrder: number;
  maxImageCount?: number | null;
  maxImageSize?: number | null; // bytes
}

/**
 * Update Subsection DTO
 */
export interface UpdateSubsectionDto {
  title: string;
  displayOrder: number;
  maxImageCount?: number | null;
  maxImageSize?: number | null;
}

/**
 * Section DTO from API
 */
export interface SectionDto {
  id: number;
  profileTypeId: number;
  title: string;
  weightPercent: number; // double, should sum to 100 within profile type
  displayOrder: number;
  subsections: SubsectionDto[];
}

/**
 * Create Section DTO
 */
export interface CreateSectionDto {
  profileTypeId: number;
  title: string;
  weightPercent: number;
  displayOrder: number;
}

/**
 * Update Section DTO
 */
export interface UpdateSectionDto {
  title: string;
  weightPercent: number;
  displayOrder: number;
}

/**
 * Profile Type DTO from API
 */
export interface ProfileTypeDto {
  id: number;
  typeNameMale: string;
  typeNameFemale: string;
  typeName: string; // resolved based on user gender
  description: string;
  availableFor: GenderAvailability; // 1=Male, 2=Female, 3=Both
  isActive: boolean;
  createdAt: string; // date-time
  modifiedAt: string; // date-time
  sections: SectionDto[];
}

/**
 * Create Profile Type DTO
 */
export interface CreateProfileTypeDto {
  typeNameMale: string;
  typeNameFemale: string;
  description?: string;
  availableFor: GenderAvailability;
}

/**
 * Update Profile Type DTO
 */
export interface UpdateProfileTypeDto {
  typeNameMale: string;
  typeNameFemale: string;
  description?: string;
  availableFor: GenderAvailability;
}

/**
 * Filter params for profile types list
 */
export interface ProfileTypeFilterParams extends PaginatedQueryParams {
  IsActive?: boolean;
}

/**
 * Reorder map: { [id]: newDisplayOrder }
 */
export type ReorderMap = Record<number, number>;
