"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { STATUS_ACTION_LABELS } from "../labels";
import type { ModerationCaseStatus } from "../types/moderation-cases.types";

interface CaseStatusDialogProps {
  /** The pending target status, or null when closed. */
  target: ModerationCaseStatus | null;
  reviewNote: string;
  onReviewNoteChange: (value: string) => void;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isPending: boolean;
}

/** What the action does to the linked content — drives the warning copy. */
const ACTION_DESCRIPTIONS: Record<ModerationCaseStatus, string> = {
  OPEN: "This updates the review status only — it doesn't change or remove the child's content.",
  IN_REVIEW:
    "This updates the review status only — it doesn't change or remove the child's content.",
  RESOLVED:
    "This closes the case with no content action — the child's content is left unchanged.",
  MARK_SAFE:
    "This clears the case and publishes the flagged content — it becomes visible to the child and their circle again.",
  REMOVE_CONTENT:
    "This permanently takes down the child's content (capsule, journal, or message) and closes the case. This can't be undone.",
};

/**
 * Confirmation dialog for a case decision (MODERATOR only). Captures an optional
 * review note. RESOLVED/OPEN/IN_REVIEW are review-tracking only; MARK_SAFE and
 * REMOVE_CONTENT act on the linked content, so the copy warns accordingly.
 */
export function CaseStatusDialog({
  target,
  reviewNote,
  onReviewNoteChange,
  onOpenChange,
  onConfirm,
  isPending,
}: CaseStatusDialogProps) {
  const actionLabel = target ? STATUS_ACTION_LABELS[target] : "";
  const destructive = target === "REMOVE_CONTENT";

  return (
    <Dialog open={target !== null} onOpenChange={onOpenChange}>
      <DialogContent className="text-left">
        <DialogHeader>
          <DialogTitle>{actionLabel}?</DialogTitle>
          <DialogDescription>
            {target ? ACTION_DESCRIPTIONS[target] : ""} The decision is recorded
            against your account.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          <Label htmlFor="case-review-note">Review note (optional)</Label>
          <Textarea
            id="case-review-note"
            value={reviewNote}
            onChange={(e) => onReviewNoteChange(e.target.value)}
            placeholder="Add context for this decision…"
            maxLength={2000}
            rows={3}
            className="focus-visible:border-brand focus-visible:ring-brand/30"
          />
        </div>

        <DialogFooter>
          <DialogClose render={<Button variant="outline" />}>Cancel</DialogClose>
          <Button
            variant="brand"
            className={destructive ? "bg-rose-600 hover:bg-rose-700" : undefined}
            disabled={isPending}
            onClick={onConfirm}
          >
            {isPending ? "Working…" : actionLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
