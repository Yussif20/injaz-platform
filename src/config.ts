/**
 * Application configuration
 */

// Backend API URL - staging environment
export const BACKEND_API_URL =
  process.env.BACKEND_API_URL || "https://staging.enjazfile.com";

// Cookie names for authentication
export const COOKIE_NAMES = {
  AUTH_TOKEN: "admin_auth_token",
  REFRESH_TOKEN: "admin_refresh_token",
} as const;

// Application routes
export const ROUTES = {
  LOGIN: "/login",
  DASHBOARD: "/dashboard",
  REPORTS: "/dashboard/reports",
  USERS: "/dashboard/users",
  FILES: "/dashboard/files",
  SUBSCRIPTIONS: "/dashboard/subscriptions",
  RANKS: "/dashboard/ranks",
  ACADEMIC_YEARS: "/dashboard/academic-years",
  ASSESSMENTS: "/dashboard/assessments",
  TERMS: "/dashboard/terms",
  SOCIALS: "/dashboard/socials",
} as const;
