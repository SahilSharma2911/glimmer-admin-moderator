import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import type { AdminRole } from "@/features/auth/types/auth.types";
import { roleHomePath } from "@/features/auth/roles";

/**
 * Route guard (Next.js 16 Proxy, formerly Middleware).
 *
 * Optimistic auth + role gate based on cookies:
 *   - No token + protected route   → /login
 *   - Has token + auth route       → role home (/admin or /moderator)
 *   - Wrong role for /admin|/moderator → redirect to own role home
 *
 * Only checks cookie presence/value, not JWT validity — real authorization is
 * enforced by the backend (a stale token gets a 401, which the client clears).
 *
 * NOTE: the role cookie is user-editable, so this gate is optimistic only. Its
 * client-side counterpart is `RoleGuard` (wrapping the /admin and /moderator
 * layouts), which confirms the real role via `/me`, redirects on mismatch, and
 * rewrites the cookie to the truth. Neither is the security boundary — that's
 * the backend.
 */

const TOKEN_COOKIE = "glimmers_admin_token";
const ROLE_COOKIE = "glimmers_admin_role";
const AUTH_ROUTES = ["/login", "/onboard", "/forgot-password"];
const REDIRECT_WHEN_GUEST = "/login";

function isAuthRoute(pathname: string): boolean {
  return AUTH_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );
}

function redirectTo(request: NextRequest, pathname: string) {
  const url = request.nextUrl.clone();
  url.pathname = pathname;
  url.search = "";
  return NextResponse.redirect(url);
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasToken = Boolean(request.cookies.get(TOKEN_COOKIE)?.value);
  const role = request.cookies.get(ROLE_COOKIE)?.value as AdminRole | undefined;
  const home = roleHomePath(role);

  // Root → role home or login.
  if (pathname === "/") {
    return redirectTo(request, hasToken ? home : REDIRECT_WHEN_GUEST);
  }

  const authRoute = isAuthRoute(pathname);

  // Unauthenticated on a protected route → login.
  if (!hasToken && !authRoute) {
    return redirectTo(request, REDIRECT_WHEN_GUEST);
  }

  // Authenticated on an auth route → role home.
  if (hasToken && authRoute) {
    return redirectTo(request, home);
  }

  // Role enforcement: can't enter the other role's area.
  if (hasToken && pathname.startsWith("/admin") && role !== "ADMIN") {
    return redirectTo(request, home);
  }
  if (hasToken && pathname.startsWith("/moderator") && role !== "MODERATOR") {
    return redirectTo(request, home);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|images|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
