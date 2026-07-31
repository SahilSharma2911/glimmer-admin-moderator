// POST /admin/auth/password/change
export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

/** The endpoint returns `data: null` on success — nothing to read. */
export type ChangePasswordResult = null;
