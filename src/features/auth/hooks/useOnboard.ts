import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authApi } from "../api/auth.api";
import { tokenStore } from "@/lib/api/token";
import { useUserStore } from "@/store/user.store";
import type { ApiError } from "@/lib/api/types";
import type { AuthResult, OnboardRequest } from "../types/auth.types";
import { authKeys } from "./useMe";

/**
 * Moderator onboarding: sets the first-time password via an invite token.
 * The backend auto-logs-in (returns an auth token), so we persist it and
 * load the profile into cache + global store — same as login.
 */
export function useOnboard() {
  const queryClient = useQueryClient();

  return useMutation<AuthResult, ApiError, OnboardRequest>({
    mutationFn: authApi.onboard,
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
