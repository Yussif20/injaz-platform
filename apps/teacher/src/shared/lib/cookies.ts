/**
 * Cookie utilities for authentication
 */

import { cookies } from "next/headers";

// Cookie names
export const COOKIE_NAMES = {
  ACCESS_TOKEN: "auth_token",
  REFRESH_TOKEN: "refresh_token",
} as const;

// Cookie options
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
};

// Token expiry durations
const ACCESS_TOKEN_MAX_AGE = 60 * 60 * 24; // 1 day
const REFRESH_TOKEN_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

/**
 * Set authentication cookies
 */
export async function setAuthCookies(
  accessToken: string,
  refreshToken: string
): Promise<void> {
  const cookieStore = await cookies();

  cookieStore.set(COOKIE_NAMES.ACCESS_TOKEN, accessToken, {
    ...COOKIE_OPTIONS,
    maxAge: ACCESS_TOKEN_MAX_AGE,
  });

  cookieStore.set(COOKIE_NAMES.REFRESH_TOKEN, refreshToken, {
    ...COOKIE_OPTIONS,
    maxAge: REFRESH_TOKEN_MAX_AGE,
  });
}

/**
 * Get access token from cookies
 */
export async function getAccessToken(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(COOKIE_NAMES.ACCESS_TOKEN)?.value;
}

/**
 * Get refresh token from cookies
 */
export async function getRefreshToken(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(COOKIE_NAMES.REFRESH_TOKEN)?.value;
}

/**
 * Clear authentication cookies
 */
export async function clearAuthCookies(): Promise<void> {
  const cookieStore = await cookies();

  cookieStore.delete(COOKIE_NAMES.ACCESS_TOKEN);
  cookieStore.delete(COOKIE_NAMES.REFRESH_TOKEN);
}

/**
 * Check if user has valid auth cookies
 */
export async function hasAuthCookies(): Promise<boolean> {
  const token = await getAccessToken();
  return !!token;
}
