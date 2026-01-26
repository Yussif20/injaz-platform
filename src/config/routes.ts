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
  FORGOT_PASSWORD: "/sign/forgot-password",
  ONBOARDING: "/onboarding",

  // Dashboard routes
  DASHBOARD: "/dashboard",
  DASHBOARD_PROFILE_NEW: "/dashboard/profile/new",
  DASHBOARD_PROFILE_SECTIONS: (id: string | number) =>
    `/dashboard/profile/${id}/sections`,

  // Preview route (full-screen, outside dashboard layout)
  PROFILE_PREVIEW: (id: string | number) => `/preview/${id}`,

  // Dashboard account routes
  DASHBOARD_ACCOUNT: "/dashboard/account",
  DASHBOARD_ACCOUNT_INFO: "/dashboard/account/info",
  DASHBOARD_ACCOUNT_PROFILE_DATA: "/dashboard/account/profile-data",
  DASHBOARD_ACCOUNT_PROFILE_DATA_PERSONAL: "/dashboard/account/profile-data/personal",
  DASHBOARD_ACCOUNT_PROFILE_DATA_EDUCATION: "/dashboard/account/profile-data/education",
  DASHBOARD_ACCOUNT_PROFILE_DATA_CAREER: "/dashboard/account/profile-data/career",
  DASHBOARD_ACCOUNT_SUBSCRIPTION: "/dashboard/account/subscription",
  DASHBOARD_ACCOUNT_SUBSCRIPTION_MANAGE: "/dashboard/account/subscription/manage",
  DASHBOARD_ACCOUNT_SUBSCRIPTION_HISTORY: "/dashboard/account/subscription/history",
  DASHBOARD_ACCOUNT_SUPPORT: "/dashboard/account/support",
  DASHBOARD_ACCOUNT_TERMS: "/dashboard/account/terms",
  DASHBOARD_ACCOUNT_HOW_TO_USE: "/dashboard/account/how-to-use",
  DASHBOARD_ACCOUNT_FILE_PASSWORD: "/dashboard/account/file-password",
  DASHBOARD_ACCOUNT_CHANGE_PASSWORD: "/dashboard/account/change-password",

  // Legacy profile routes (kept for compatibility)
  PROFILES: "/profiles",
  PROFILE_NEW: "/profiles/new",
  PROFILE_DETAIL: (id: string) => `/profiles/${id}`,

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
