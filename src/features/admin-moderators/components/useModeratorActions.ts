"use client";

import * as React from "react";
import { toast } from "sonner";
import { useUpdateModerator } from "../hooks/useUpdateModerator";
import { useResendInvite } from "../hooks/useResendInvite";
import { moderatorErrorMessage } from "../error-message";
import type { Moderator } from "../types/moderators.types";

export function moderatorDisplayName(m: Moderator): string {
  return m.name ?? m.email;
}

type ConfirmAction = "ACTIVE" | "SUSPENDED" | null;

/**
 * Shared moderator row/detail actions: resend invite and the
 * suspend/reactivate flow (gated behind a confirmation dialog). Used by both
 * the table row dropdown and the detail page so they stay in sync.
 */
export function useModeratorActions(moderator: Moderator) {
  const update = useUpdateModerator();
  const resend = useResendInvite();

  const [confirm, setConfirm] = React.useState<ConfirmAction>(null);

  const isResending = resend.isPending && resend.variables === moderator.id;
  const isUpdating =
    update.isPending && update.variables?.moderatorId === moderator.id;

  const onResend = () =>
    resend.mutate(moderator.id, {
      onSuccess: () => toast.success(`Invite resent to ${moderator.email}.`),
      onError: (error) => toast.error(moderatorErrorMessage(error)),
    });

  const onConfirm = () => {
    if (!confirm) return;
    const next = confirm;
    update.mutate(
      { moderatorId: moderator.id, body: { status: next } },
      {
        onSuccess: () => {
          toast.success(
            next === "SUSPENDED"
              ? `${moderatorDisplayName(moderator)} suspended.`
              : `${moderatorDisplayName(moderator)} reactivated.`,
          );
          setConfirm(null);
        },
        onError: (error) => toast.error(moderatorErrorMessage(error)),
      },
    );
  };

  return {
    confirm,
    setConfirm,
    isResending,
    isUpdating,
    isPending: isResending || isUpdating,
    onResend,
    onConfirm,
  };
}
