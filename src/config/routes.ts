export const ROUTES = {
  HOME: "/dashboard",
  LOGIN: "/login",
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

export const PUBLIC_ROUTES = [ROUTES.LOGIN] as const;
