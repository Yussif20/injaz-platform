import { NextRequest, NextResponse } from "next/server";
import { COOKIE_NAMES } from "./config/constants";
import { PUBLIC_ROUTES } from "./config/routes";

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(COOKIE_NAMES.AUTH_TOKEN)?.value;

  // Handle root path redirect
  if (pathname === "/") {
    if (token) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    } else {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  const isPublicRoute = PUBLIC_ROUTES.some((route) => pathname === route);

  // Redirect authenticated users away from login
  if (token && isPublicRoute) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Protect dashboard routes — redirect to login if no token
  if (!token && pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|api|_vercel|.*\\..*).*)"],
};
