/**
 * User profile types for Me endpoints
 * Based on backend API: https://staging.enjazfile.com/swagger
 */

// Re-export Gender from auth (will be updated to match backend)
export { Gender } from "@/features/auth";

// ============================================
// Personal Info
// ============================================

/**
 * Personal information from /api/Me/personal-info
 */
export interface PersonalInfo {
  rankId: number | null;
  rankTitleMale: string | null;
  rankTitleFemale: string | null;
  rankTitle: string | null;
  nationalId: string | null;
  birthDate: string | null;
  address: string | null;
  phoneNumber: string | null;
  email: string | null;
}

/**
 * Request body for PUT /api/Me/personal-info
 * Note: Backend requires birthDate and address, but for partial updates
 * (like just updating email), we make them optional here.
 * Full personal info form should provide all required fields.
 */
export interface UpdatePersonalInfoRequest {
  rankId?: number;
  nationalId?: string;  // 14 digits
  birthDate?: string;   // ISO date - Required by backend for full update
  address?: string;     // Max 500 chars - Required by backend for full update
  email?: string;
}

// ============================================
// Qualifications
// ============================================

/**
 * Qualification/Education entry
 */
export interface Qualification {
  id: number;
  degreeType: string | null;
  title: string | null;
  grade: string | null;
  graduationDate: string;  // ISO date
}

/**
 * Request body for POST /api/my-qualifications
 */
export interface CreateQualificationRequest {
  degreeType?: string;
  title?: string;
  grade?: string;
  graduationDate: string;  // ISO date - Required
}

/**
 * Request body for PUT /api/my-qualifications/{id}
 */
export interface UpdateQualificationRequest {
  degreeType?: string;
  title?: string;
  grade?: string;
  graduationDate: string;  // ISO date - Required
}

// ============================================
// Career Jobs
// ============================================

/**
 * Career/Job history entry
 */
export interface CareerJob {
  id: number;
  title: string | null;
  rank: string | null;
  school: string | null;
  educationalStage: string | null;
  startYear: number;
  endYear: number | null;
}

// ============================================
// Subscription
// ============================================

/**
 * Payment status enum
 */
export enum PaymentStatus {
  Pending = 0,
  Completed = 1,
  Failed = 2,
  Refunded = 3,
}

/**
 * Subscription discount info
 */
export interface SubscriptionDiscount {
  id: number;
  code: string | null;
  discountPercentage: number;
}

/**
 * User subscription details
 */
export interface Subscription {
  id: number;
  userId: number;
  subscribedAt: string;
  expiresAt: string;
  baseAmount: number;
  discountPercentage: number;
  discountAmount: number;
  finalAmount: number;
  paymentStatus: PaymentStatus;
  paymentMethod: string | null;
  paymentTransactionId: string | null;
  isActive: boolean;
  daysRemaining: number;
  appliedDiscount: SubscriptionDiscount | null;
}

// ============================================
// User Profile (Full)
// ============================================

/**
 * Complete user profile from GET /api/Me/profile
 * This is the main type for dashboard data display
 */
export interface UserProfile {
  id: number;
  phone: string | null;
  fullName: string | null;
  gender: number;  // 1 = Male, 2 = Female (backend values)
  role: string | null;
  imageUrl: string | null;
  personalInfo: PersonalInfo | null;
  qualifications: Qualification[] | null;
  careerJobs: CareerJob[] | null;
  createdAt: string;
  lastLogin: string | null;
  isActive: boolean;
  isSubscribed: boolean;
  currentSubscription: Subscription | null;
}

/**
 * Basic user info from GET /api/Me (JWT decoded, no DB query)
 */
export interface BasicUserInfo {
  id: number;
  phone: string;
  fullName: string;
  gender: number;
  role: string;
}

// ============================================
// Basic Info Update
// ============================================

/**
 * Request body for PUT /api/Me/basic-info
 */
export interface UpdateBasicInfoRequest {
  fullName?: string;
  gender?: number;  // 1 = Male, 2 = Female
}

// ============================================
// Profile Completeness
// ============================================

/**
 * Profile completeness check response from GET /api/Me/profile-completeness
 */
export interface ProfileCompleteness {
  isComplete: boolean;
  isPersonalDataComplete: boolean;
  hasCareerJobs: boolean;
  hasQualifications: boolean;
  missingFields: string[];
  message: string;
}

// ============================================
// Change Password
// ============================================

/**
 * Request body for POST /api/Auth/change-password
 */
export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

// ============================================
// API Response Wrapper
// ============================================

/**
 * Standard API response wrapper
 */
export interface MeApiResponse<T> {
  status: "Success" | "Failure" | string | boolean;
  message: string;
  data: T;
  errors: string[] | null;
}

// ============================================
// Helper Functions
// ============================================

/**
 * Get display-friendly gender label
 */
export function getGenderLabel(gender: number | null | undefined, locale: "ar" | "en" = "ar"): string {
  if (gender === 1) return locale === "ar" ? "ذكر" : "Male";
  if (gender === 2) return locale === "ar" ? "أنثى" : "Female";
  return locale === "ar" ? "غير محدد" : "Not specified";
}

/**
 * Convert backend gender (1=Male, 2=Female) to form value
 */
export function genderToFormValue(gender: number | null | undefined): "male" | "female" | "" {
  if (gender === 1) return "male";
  if (gender === 2) return "female";
  return "";
}

/**
 * Convert form value to backend gender
 */
export function formValueToGender(value: "male" | "female" | ""): number | undefined {
  if (value === "male") return 1;
  if (value === "female") return 2;
  return undefined;
}

/**
 * Format date for display (Arabic locale)
 */
export function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return "";
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("ar-SA");
  } catch {
    return dateString;
  }
}

/**
 * Get rank title based on gender
 */
export function getRankTitle(personalInfo: PersonalInfo | null, gender: number): string {
  if (!personalInfo) return "";
  if (gender === 1 && personalInfo.rankTitleMale) return personalInfo.rankTitleMale;
  if (gender === 2 && personalInfo.rankTitleFemale) return personalInfo.rankTitleFemale;
  return personalInfo.rankTitle || "";
}
