import { tokenStore } from "@/lib/api/token";
import { getQueryClient } from "@/lib/query/query-client";
import { useUserStore } from "@/store/user.store";

/**
 * Tears down all client-side session state: token cookie, the global user
 * store, and the React Query cache. Safe to call outside React.
 */
export function clearSession(): void {
  tokenStore.clear();
  useUserStore.getState().clearUser();
  getQueryClient().clear();
}

let redirecting = false;

/**
 * Forced logout for an expired/revoked session (e.g. a 401 on an
 * authenticated request): full teardown + hard redirect to /login. Guarded
 * so concurrent 401s don't trigger multiple redirects.
 */
export function forceLogout(): void {
  clearSession();
  if (
    typeof window !== "undefined" &&
    !redirecting &&
    window.location.pathname !== "/login"
  ) {
    redirecting = true;
    window.location.assign("/login?session=expired");
  }
}
