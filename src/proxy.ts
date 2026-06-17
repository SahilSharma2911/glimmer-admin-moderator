import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Route guard (Next.js 16 Proxy, formerly Middleware).
 *
 * Optimistic auth gate based on the presence of the admin token cookie:
 *   - No token + protected route  → redirect to /login
 *   - Has token + auth route      → redirect to /dashboard
 *
 * This only checks that the cookie EXISTS, not that the JWT is valid — real
 * authorization is enforced by the backend (a stale token still gets a 401,
 * which the client clears). Per the Next docs, Proxy is for optimistic
 * checks like this, not full session management.
 */

const TOKEN_COOKIE = "glimmers_admin_token";

/** Public routes for unauthenticated users (login / account recovery). */
const AUTH_ROUTES = ["/login", "/onboard", "/forgot-password"];

const REDIRECT_WHEN_AUTHED = "/dashboard";
const REDIRECT_WHEN_GUEST = "/login";

function isAuthRoute(pathname: string): boolean {
  return AUTH_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasToken = Boolean(request.cookies.get(TOKEN_COOKIE)?.value);

  // Root: send to the right place based on auth.
  if (pathname === "/") {
    const url = request.nextUrl.clone();
    url.pathname = hasToken ? REDIRECT_WHEN_AUTHED : REDIRECT_WHEN_GUEST;
    return NextResponse.redirect(url);
  }

  const authRoute = isAuthRoute(pathname);

  // Unauthenticated user on a protected route → login.
  if (!hasToken && !authRoute) {
    const url = request.nextUrl.clone();
    url.pathname = REDIRECT_WHEN_GUEST;
    return NextResponse.redirect(url);
  }

  // Authenticated user on an auth route → dashboard.
  if (hasToken && authRoute) {
    const url = request.nextUrl.clone();
    url.pathname = REDIRECT_WHEN_AUTHED;
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  // Run on all routes except Next internals, API, and static asset files.
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|images|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
