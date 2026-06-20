"use client";

import * as React from "react";
import { toast } from "sonner";
import { useUpdateModerationCaseStatus } from "../hooks/useUpdateModerationCaseStatus";
import { moderationCaseErrorMessage } from "../error-message";
import { STATUS_LABELS } from "../labels";
import type {
  ModerationCase,
  ModerationCaseStatus,
} from "../types/moderation-cases.types";

/**
 * Shared case status-change action (MODERATOR only). Tracks the pending target
 * status (which drives the confirm dialog) and an optional review note, then
 * runs the PATCH. Used by both the table row dropdown and the detail view so
 * they stay in sync. The backend rejects ADMIN with 403 regardless of UI.
 */
export function useCaseStatusAction(moderationCase: Pick<ModerationCase, "id">) {
  const update = useUpdateModerationCaseStatus();

  /** The status we're about to move to, or null when the dialog is closed. */
  const [target, setTarget] = React.useState<ModerationCaseStatus | null>(null);
  const [reviewNote, setReviewNote] = React.useState("");

  const isUpdating =
    update.isPending && update.variables?.caseId === moderationCase.id;

  const close = () => {
    setTarget(null);
    setReviewNote("");
  };

  const onConfirm = () => {
    if (!target) return;
    const note = reviewNote.trim();
    update.mutate(
      {
        caseId: moderationCase.id,
        body: { status: target, reviewNote: note || undefined },
      },
      {
        onSuccess: () => {
          toast.success(`Case marked ${STATUS_LABELS[target].toLowerCase()}.`);
          close();
        },
        onError: (error) => toast.error(moderationCaseErrorMessage(error)),
      },
    );
  };

  return {
    target,
    setTarget,
    reviewNote,
    setReviewNote,
    isUpdating,
    onConfirm,
    close,
  };
}
