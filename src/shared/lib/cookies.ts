import { cookies } from "next/headers";
import { COOKIE_NAMES } from "@/config";

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
};

export async function setAuthCookies(token: string, refreshToken: string) {
  const cookieStore = await cookies();

  cookieStore.set(COOKIE_NAMES.AUTH_TOKEN, token, {
    ...COOKIE_OPTIONS,
    maxAge: 60 * 60 * 24, // 1 day
  });

  cookieStore.set(COOKIE_NAMES.REFRESH_TOKEN, refreshToken, {
    ...COOKIE_OPTIONS,
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });
}

export async function getAuthToken() {
  const cookieStore = await cookies();
  return cookieStore.get(COOKIE_NAMES.AUTH_TOKEN)?.value;
}

export async function getRefreshToken() {
  const cookieStore = await cookies();
  return cookieStore.get(COOKIE_NAMES.REFRESH_TOKEN)?.value;
}

export async function clearAuthCookies() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAMES.AUTH_TOKEN);
  cookieStore.delete(COOKIE_NAMES.REFRESH_TOKEN);
}
