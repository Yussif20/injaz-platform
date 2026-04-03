const raw =
  process.env.NEXT_PUBLIC_BACKEND_API_URL || "https://staging.enjazfile.com";
export const BACKEND_API_URL = raw.replace(/\/+$/, "");

export const COOKIE_NAMES = {
  AUTH_TOKEN: "admin_auth_token",
  REFRESH_TOKEN: "admin_refresh_token",
} as const;
