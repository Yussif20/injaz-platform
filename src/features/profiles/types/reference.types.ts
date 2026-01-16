/**
 * Reference Data Types
 * Types for academic years, profile types, sections, subsections, and ranks
 */

// Academic Year
export interface AcademicYear {
  id: string;                 // GUID
  name: string;               // e.g., "1445-1446"
  startDate: string;          // ISO date
  endDate: string;            // ISO date
  isActive: boolean;          // Can be used for new profiles
  isClosed: boolean;          // Year is closed
  createdAt: string;
  updatedAt: string;
}

// Profile Type
export interface ProfileType {
  id: string;                 // GUID
  nameMale: string;           // Arabic name for males
  nameFemale: string;         // Arabic name for females
  description: string | null;
  iconUrl: string | null;
  isActive: boolean;
  forMale: boolean;
  forFemale: boolean;
  createdAt: string;
  updatedAt: string;
}

// Full Section (with subsections)
export interface Section {
  id: string;                 // GUID
  profileTypeId: string;      // Parent profile type
  name: string;               // Section name
  description: string | null;
  order: number;              // Display order
  weight: number;             // Scoring weight (0-100)
  isRequired: boolean;        // Must have images
  subsections: Subsection[];  // Ordered list of subsections
  createdAt: string;
  updatedAt: string;
}

// Subsection
export interface Subsection {
  id: string;                 // GUID
  sectionId: string;          // Parent section
  name: string;               // Subsection name
  description: string | null;
  order: number;              // Display order
  minImages: number;          // Minimum required images (0 = optional)
  maxImages: number | null;   // Maximum images (null = unlimited)
  createdAt: string;
  updatedAt: string;
}

// Rank
export interface Rank {
  id: string;                 // GUID
  nameMale: string;           // e.g., "معلم"
  nameFemale: string;         // e.g., "معلمة"
  order: number;              // Display order
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Profile Type with Sections
export interface ProfileTypeWithSections extends ProfileType {
  sections: Section[];
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
