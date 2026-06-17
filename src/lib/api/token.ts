import Cookies from "js-cookie";

/**
 * Admin JWT storage, backed by a cookie via `js-cookie`.
 *
 * Note: this is a non-httpOnly cookie (readable by JS), so it carries the
 * same XSS exposure as localStorage. It's used so axios can attach the
 * Bearer header on the client. The backend issues a 7-day token, so the
 * cookie expiry matches.
 */
const TOKEN_KEY = "glimmers_admin_token";
const TOKEN_TTL_DAYS = 7;

export const tokenStore = {
  get(): string | undefined {
    return Cookies.get(TOKEN_KEY);
  },

  set(token: string): void {
    Cookies.set(TOKEN_KEY, token, {
      expires: TOKEN_TTL_DAYS,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });
  },

  clear(): void {
    Cookies.remove(TOKEN_KEY);
  },
};
