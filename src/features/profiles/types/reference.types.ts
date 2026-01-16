/**
 * Reference Data Types
 * Types for academic years, profile types, sections, subsections, and ranks
 */

// Academic Year
export interface AcademicYear {
  id: number;
  yearName: string | null;
  startDate: string;
  endDate: string;
  status: string | null;
}

// Profile Type
export interface ProfileType {
  id: number;
  typeNameMale: string | null;
  typeNameFemale: string | null;
  typeName: string | null;
  description: string | null;
  availableFor: GenderAvailability;
  isActive: boolean;
  createdAt: string;
  modifiedAt: string;
  sections: SectionSummary[] | null;
}

// Section Summary (for profile type listing)
export interface SectionSummary {
  id: number;
  title: string | null;
  weightPercent: number;
  displayOrder: number;
  subsectionsCount: number;
}

// Full Section (with subsections)
export interface Section {
  id: number;
  profileTypeId: number;
  title: string | null;
  weightPercent: number;
  displayOrder: number;
  subsections: Subsection[] | null;
}

// Subsection
export interface Subsection {
  id: number;
  title: string | null;
  displayOrder: number;
  maxImageCount: number | null;
  maxImageSize: number | null;
}

// Rank
export interface Rank {
  id: number;
  titleMale: string | null;
  titleFemale: string | null;
  title: string | null;
}

// Gender Availability Enum
export enum GenderAvailability {
  Male = 1,
  Female = 2,
  Both = 3,
}

// API Response types
export interface AcademicYearsResponse {
  status: boolean;
  message: string;
  data?: AcademicYear[];
  errors?: string[] | null;
}

export interface ProfileTypesResponse {
  status: boolean;
  message: string;
  data?: ProfileType[];
  errors?: string[] | null;
}

export interface ProfileTypeResponse {
  status: boolean;
  message: string;
  data?: ProfileType;
  errors?: string[] | null;
}

export interface RanksResponse {
  status: boolean;
  message: string;
  data?: Rank[];
  errors?: string[] | null;
}
