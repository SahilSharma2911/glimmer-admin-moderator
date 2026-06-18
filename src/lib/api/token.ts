import Cookies from "js-cookie";
import type { AdminRole } from "@/features/auth/types/auth.types";

/**
 * Admin session cookies, backed by `js-cookie`.
 *
 * - `glimmers_admin_token`: the JWT axios attaches as the Bearer header.
 * - `glimmers_admin_role`:  the role (ADMIN | MODERATOR), so the proxy can
 *   do role-based routing server-side (it can't read JS state).
 *
 * Note: these are non-httpOnly cookies (readable by JS), same XSS exposure
 * as localStorage. The backend issues a 7-day token, so the TTL matches.
 */
const TOKEN_KEY = "glimmers_admin_token";
const ROLE_KEY = "glimmers_admin_role";
const TTL_DAYS = 7;

const cookieOptions = {
  expires: TTL_DAYS,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
};

export const tokenStore = {
  get(): string | undefined {
    return Cookies.get(TOKEN_KEY);
  },
  set(token: string): void {
    Cookies.set(TOKEN_KEY, token, cookieOptions);
  },
  clear(): void {
    Cookies.remove(TOKEN_KEY);
  },
};

export const roleStore = {
  get(): AdminRole | undefined {
    return Cookies.get(ROLE_KEY) as AdminRole | undefined;
  },
  set(role: AdminRole): void {
    Cookies.set(ROLE_KEY, role, cookieOptions);
  },
  clear(): void {
    Cookies.remove(ROLE_KEY);
  },
};
