import { useUserStore } from "@/store/user.store";
import { clearSession } from "@/lib/auth/session";

/**
 * Global accessor for the current admin — usable from ANY feature.
 * Reads from the Zustand store (hydrated from the `/me` query), so there's
 * no per-component fetch.
 *
 *   const { name, role, isAdmin } = useCurrentUser();
 */
export function useCurrentUser() {
  const user = useUserStore((s) => s.user);

  return {
    user,
    name: user?.name ?? null,
    email: user?.email ?? null,
    role: user?.role ?? null,
    isAuthenticated: Boolean(user),
    isAdmin: user?.role === "ADMIN",
    isModerator: user?.role === "MODERATOR",
    /** Manual logout: full client-side teardown (token, store, cache). */
    logout: clearSession,
  };
}
