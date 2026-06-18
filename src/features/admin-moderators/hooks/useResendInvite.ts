import { useMutation, useQueryClient } from "@tanstack/react-query";
import { moderatorsApi } from "../api/moderators.api";
import { moderatorKeys } from "./useModerators";
import type { ApiError } from "@/lib/api/types";
import type { Moderator } from "../types/moderators.types";

/**
 * Resend a moderator's invite email
 * (POST /api/admin/moderators/{moderatorId}/resend-invite). Only valid for
 * PENDING moderators — the backend 409s (`MODERATOR_ALREADY_ONBOARDED`)
 * otherwise. Seeds the returned moderator into the detail cache.
 */
export function useResendInvite() {
  const queryClient = useQueryClient();

  return useMutation<Moderator, ApiError, string>({
    mutationFn: (moderatorId) => moderatorsApi.resendInvite(moderatorId),
    onSuccess: (moderator) => {
      queryClient.setQueryData(moderatorKeys.detail(moderator.id), moderator);
    },
  });
}
