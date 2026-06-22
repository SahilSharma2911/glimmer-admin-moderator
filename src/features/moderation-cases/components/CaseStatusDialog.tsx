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
import { STATUS_LABELS } from "../labels";
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

const DESTRUCTIVE: ReadonlySet<ModerationCaseStatus> = new Set<ModerationCaseStatus>(
  ["DISMISSED"],
);

/**
 * Confirmation dialog for a case status change (MODERATOR only). Captures an
 * optional review note. Status changes are review-tracking only — they never
 * mutate the underlying content.
 */
export function CaseStatusDialog({
  target,
  reviewNote,
  onReviewNoteChange,
  onOpenChange,
  onConfirm,
  isPending,
}: CaseStatusDialogProps) {
  const label = target ? STATUS_LABELS[target] : "";
  const destructive = target ? DESTRUCTIVE.has(target) : false;

  return (
    <Dialog open={target !== null} onOpenChange={onOpenChange}>
      <DialogContent className="text-left">
        <DialogHeader>
          <DialogTitle>Mark case {label.toLowerCase()}?</DialogTitle>
          <DialogDescription>
            This updates the review status only — it does not change or remove
            the child&rsquo;s content. The change is recorded against your
            account.
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
            {isPending ? "Saving…" : `Mark ${label.toLowerCase()}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
