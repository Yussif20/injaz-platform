/**
 * Reference Data Types
 * Types for academic years, profile types, sections, subsections, and ranks
 * These types match the actual API response from the backend (swagger.json)
 */

// Academic Year - Matches AcademicYearDto from API
export interface AcademicYear {
  id: number;                 // Integer ID from backend
  yearName: string;           // e.g., "1445-1446" or "2024-2025"
  startDate: string;          // ISO date-time format
  endDate: string;            // ISO date-time format
  status: "Active" | "Inactive" | "Closed";  // Status enum from backend
}

// Helper to check if academic year is active
export function isAcademicYearActive(year: AcademicYear): boolean {
  return year.status === "Active";
}

// Helper to check if academic year is closed
export function isAcademicYearClosed(year: AcademicYear): boolean {
  return year.status === "Closed";
}

// Gender availability enum - matches backend GenderAvailability
export type GenderAvailability = 1 | 2 | 3; // 1=Male, 2=Female, 3=Both

// Profile Type - Matches ProfileTypeDto from API
export interface ProfileType {
  id: number;                 // Integer ID from backend
  typeNameMale: string;       // Arabic name for males (e.g., "ملف إنجاز معلم")
  typeNameFemale: string;     // Arabic name for females (e.g., "ملف إنجاز معلمة")
  typeName: string;           // Resolved name based on user's gender
  description: string | null;
  availableFor: GenderAvailability; // 1=Male, 2=Female, 3=Both
  isActive: boolean;
  createdAt: string;          // ISO date-time
  modifiedAt: string;         // ISO date-time
  sections?: SectionSummary[]; // Optional, included when requested with sections
}

// Section Summary - included in ProfileTypeDto
export interface SectionSummary {
  id: number;
  title: string;
  weightPercent: number;
  displayOrder: number;
  subsectionsCount: number;
}

// Full Section (with subsections) - Matches SectionDto from API
export interface Section {
  id: number;                 // Integer ID from backend
  profileTypeId: number;      // Parent profile type
  title: string;              // Section name
  weightPercent: number;      // Scoring weight (0-100), should sum to 100
  displayOrder: number;       // Display order
  subsections: Subsection[];  // Ordered list of subsections
}

// Subsection - Matches SubsectionDto from API
export interface Subsection {
  id: number;                 // Integer ID from backend
  sectionId?: number;         // Parent section (optional in some responses)
  title: string;              // Subsection name
  displayOrder: number;       // Display order
  maxImageCount: number | null; // Maximum images (null = unlimited)
  maxImageSize: number | null;  // Max size in bytes (null = default 5MB)
}

// Rank - Matches RankDto from API
export interface Rank {
  id: number;                 // Integer ID from backend
  titleMale: string;          // e.g., "معلم"
  titleFemale: string;        // e.g., "معلمة"
  title: string;              // Combined/display title (resolved by backend)
}

// Profile Type with full Sections (including subsections)
export interface ProfileTypeWithSections extends ProfileType {
  sections: Section[];
}

// API Response types - matches ResponseDto pattern from backend
export interface AcademicYearsResponse {
  status: boolean | string;  // Can be boolean or "Success"/"Failure"
  message: string;
  data?: AcademicYear[];
  errors?: string[] | null;
}

export interface ProfileTypesResponse {
  status: boolean | string;
  message: string;
  data?: ProfileType[];
  errors?: string[] | null;
}

export interface ProfileTypeResponse {
  status: boolean | string;
  message: string;
  data?: ProfileType;
  errors?: string[] | null;
}

export interface RanksResponse {
  status: boolean | string;
  message: string;
  data?: Rank[];
  errors?: string[] | null;
}

export interface SectionsResponse {
  status: boolean | string;
  message: string;
  data?: Section[];
  errors?: string[] | null;
}
