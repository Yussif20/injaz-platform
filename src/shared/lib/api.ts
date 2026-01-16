/**
 * API configuration and axios instance
 */

import axios from "axios";

// Backend API base URL
export const BACKEND_API_URL =
  process.env.BACKEND_API_URL || "https://staging.enjazfile.com";

// Server-side axios instance (for API routes)
export const serverApi = axios.create({
  baseURL: BACKEND_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000,
});

// Client-side axios instance (for calling Next.js API routes)
export const clientApi = axios.create({
  baseURL: "",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000,
});

// API endpoints
export const API_ENDPOINTS = {
  // Auth endpoints (backend)
  LOGIN: "/api/Auth/login",
  REGISTER_WITH_OTP: "/api/Auth/register-with-otp",
  SEND_REGISTRATION_OTP: "/api/Auth/send-registration-otp",
  VERIFY_REGISTRATION_OTP: "/api/Auth/verify-registration-otp",
  SEND_PASSWORD_RESET_OTP: "/api/Auth/send-password-reset-otp",
  RESET_PASSWORD_WITH_OTP: "/api/Auth/reset-password-with-otp",
  CHANGE_PASSWORD: "/api/Auth/change-password",
  REFRESH_TOKEN: "/api/Auth/refresh-token",

  // Me endpoints (backend)
  ME: "/api/Me",
  MY_PROFILE: "/api/Me/profile",
  MY_PERSONAL_INFO: "/api/Me/personal-info",
  MY_BASIC_INFO: "/api/Me/basic-info",
  MY_IMAGE: "/api/Me/image",
  PROFILE_COMPLETENESS: "/api/Me/profile-completeness",

  // Career Jobs endpoints (backend)
  MY_CAREER_JOBS: "/api/my-career-jobs",

  // Qualifications endpoints (backend)
  MY_QUALIFICATIONS: "/api/my-qualifications",

  // Profiles endpoints (backend)
  MY_PROFILES: "/api/my-profiles",

  // Reference Data endpoints (backend)
  ACADEMIC_YEARS: "/api/AcademicYears",
  ACADEMIC_YEARS_ACTIVE: "/api/AcademicYears/active",
  PROFILE_TYPES: "/api/ProfileTypes",
  PROFILE_TYPES_AVAILABLE: "/api/ProfileTypes/available",
  PROFILE_TYPES_ACTIVE: "/api/ProfileTypes/active",
  RANKS: "/api/Ranks",

  // Profile Management endpoints (backend)
  PROFILES: "/api/Profiles",
} as const;
