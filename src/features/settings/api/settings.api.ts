import { apiRequest } from "@/lib/api/client";
import type {
  ChangePasswordRequest,
  ChangePasswordResult,
} from "../types/settings.types";

/**
 * Account settings endpoints. Returns the unwrapped `data` payload (the
 * `{ success, data }` envelope is handled by apiRequest).
 */
export const settingsApi = {
  // POST /admin/auth/password/change (authenticated)
  changePassword: (body: ChangePasswordRequest) =>
    apiRequest<ChangePasswordResult>({
      method: "POST",
      url: "/admin/auth/password/change",
      data: body,
    }),
};
