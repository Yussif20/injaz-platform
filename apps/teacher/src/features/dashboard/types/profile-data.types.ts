/**
 * Profile Data Types
 * Types for the profile data tabs (My Data, Education, Job)
 */

// My Data types
export interface MyProfileData {
  nationalId: string;
  origin: string;
  birthDate: string;
  workEmail: string;
  whatsappNumber: string;
}

// Education types
export interface Certification {
  id: string;
  name: string;
  issuer: string;
  year: string;
}

export interface EducationData {
  academicDegree: string;
  specialization: string;
  university: string;
  graduationYear: string;
  certifications: Certification[];
}

// Job types
export interface Position {
  id: string;
  schoolName: string;
  jobTitle: string;
  department: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
}

export interface JobData {
  positions: Position[];
}

// Combined profile data
export interface UserProfileData {
  myData: MyProfileData;
  education: EducationData;
  job: JobData;
}

// Tab types
export type ProfileDataTabId = "myData" | "education" | "job";
