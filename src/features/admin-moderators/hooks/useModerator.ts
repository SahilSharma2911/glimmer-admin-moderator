import { useQuery } from "@tanstack/react-query";
import { moderatorsApi } from "../api/moderators.api";
import { moderatorKeys } from "./useModerators";
import { tokenStore } from "@/lib/api/token";

/**
 * Get a single moderator by ID (GET /admin/moderators/{moderatorId}).
 * Disabled without a token or an id (e.g. before a row is selected).
 */
export function useModerator(moderatorId: string) {
  return useQuery({
    queryKey: moderatorKeys.detail(moderatorId),
    queryFn: () => moderatorsApi.get(moderatorId),
    enabled: Boolean(tokenStore.get()) && Boolean(moderatorId),
  });
}
