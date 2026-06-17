import { useQueryClient } from "@tanstack/react-query";
import { useUserStore } from "@/store/user.store";
import { tokenStore } from "@/lib/api/token";

/**
 * Global accessor for the current admin — usable from ANY feature.
 * Reads from the Zustand store (hydrated from the `/me` query), so there's
 * no per-component fetch.
 *
 *   const { name, role, isAdmin } = useCurrentUser();
 */
export function useCurrentUser() {
  const queryClient = useQueryClient();
  const user = useUserStore((s) => s.user);
  const clearUser = useUserStore((s) => s.clearUser);

  /** Stateless JWT → logout is client-side: drop token, store, and cache. */
  const logout = () => {
    tokenStore.clear();
    clearUser();
    queryClient.clear();
  };

  return {
    user,
    name: user?.name ?? null,
    email: user?.email ?? null,
    role: user?.role ?? null,
    isAuthenticated: Boolean(user),
    isAdmin: user?.role === "ADMIN",
    isModerator: user?.role === "MODERATOR",
    logout,
  };
}
