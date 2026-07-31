import { useQuery } from "@tanstack/react-query";
import { authApi } from "../api/auth.api";
import { tokenStore } from "@/lib/api/token";

export const authKeys = {
  me: ["admin", "me"] as const,
};

/**
 * Current authenticated admin (GET /admin/auth/me).
 * Disabled when there's no token so it doesn't fire a guaranteed 401.
 */
export function useMe() {
  return useQuery({
    queryKey: authKeys.me,
    queryFn: authApi.me,
    enabled: Boolean(tokenStore.get()),
  });
}
