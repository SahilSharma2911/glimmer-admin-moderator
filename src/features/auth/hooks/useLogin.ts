import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authApi } from "../api/auth.api";
import { tokenStore } from "@/lib/api/token";
import { useUserStore } from "@/store/user.store";
import type { ApiError } from "@/lib/api/types";
import type { AuthResult, LoginRequest } from "../types/auth.types";
import { authKeys } from "./useMe";

/**
 * Admin login mutation. On success, persists the JWT then loads the admin
 * profile into the query cache + global store. Consumers read
 * `mutate`/`isPending`/`error`.
 */
export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation<AuthResult, ApiError, LoginRequest>({
    mutationFn: authApi.login,
    onSuccess: async (data) => {
      tokenStore.set(data.adminToken);
      const profile = await queryClient.fetchQuery({
        queryKey: authKeys.me,
        queryFn: authApi.me,
      });
      useUserStore.getState().setUser(profile);
    },
  });
}
