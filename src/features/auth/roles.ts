import type { AdminRole } from "./types/auth.types";

/**
 * Landing route for a given role. ADMIN → /admin, everything else (MODERATOR
 * or unknown) → /moderator. Used for post-login redirects and the proxy guard.
 */
export function roleHomePath(role: AdminRole | null | undefined): string {
  return role === "ADMIN" ? "/admin" : "/moderator";
}
