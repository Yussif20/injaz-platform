/**
 * Next.js Proxy for route protection
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Cookie name for auth token
const AUTH_COOKIE = "auth_token";

// Routes that require authentication
const PROTECTED_ROUTES = [
  "/dashboard",
  "/profiles",
  "/settings",
];

// Routes that should redirect to dashboard if already authenticated
const AUTH_ROUTES = [
  "/sign/in",
  "/sign/up",
  "/forgot-password",
];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(AUTH_COOKIE)?.value;

  const isAuthenticated = !!token;

  // Check if it's a protected route
  const isProtectedRoute = PROTECTED_ROUTES.some((route) =>
    pathname.startsWith(route)
  );

  // Check if it's an auth route
  const isAuthRoute = AUTH_ROUTES.some((route) =>
    pathname.startsWith(route)
  );

  // Redirect to login if accessing protected route without authentication
  if (isProtectedRoute && !isAuthenticated) {
    const signInUrl = new URL("/sign/in", request.url);
    signInUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(signInUrl);
  }

  // Redirect to dashboard if accessing auth routes while authenticated
  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api routes
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico
     * - public folder files
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.).*)",
  ],
};
