/**
 * Application route constants
 */

export const ROUTES = {
  // Public routes
  HOME: "/",
  TERMS: "/terms",
  PRIVACY: "/privacy",

  // Auth routes
  SIGN_IN: "/sign/in",
  SIGN_UP: "/sign/up",
  FORGOT_PASSWORD: "/forgot-password",

  // Protected routes
  DASHBOARD: "/dashboard",
  PROFILES: "/profiles",
  PROFILE_NEW: "/profiles/new",
  PROFILE_DETAIL: (id: string) => `/profiles/${id}`,
  PROFILE_PREVIEW: (id: string) => `/profiles/${id}/preview`,

  // Settings routes
  SETTINGS: "/settings",
  SETTINGS_PROFILE: "/settings/profile",
  SETTINGS_PASSWORD: "/settings/password",
  SETTINGS_SUPPORT: "/settings/support",

  // Public profile
  PUBLIC_PROFILE: (slug: string) => `/p/${slug}`,

  // Other routes
  DOWNLOAD: "/download",
  HOW_TO_USE: "/how-to-use",
} as const;
