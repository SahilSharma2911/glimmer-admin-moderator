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
import { moderatorDisplayName } from "./useModeratorActions";
import type { Moderator } from "../types/moderators.types";

interface ModeratorConfirmDialogProps {
  moderator: Moderator;
  /** The pending status change, or null when closed. */
  action: "ACTIVE" | "SUSPENDED" | null;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isPending: boolean;
}

/** Confirmation dialog for suspending / reactivating a moderator. */
export function ModeratorConfirmDialog({
  moderator,
  action,
  onOpenChange,
  onConfirm,
  isPending,
}: ModeratorConfirmDialogProps) {
  const suspending = action === "SUSPENDED";

  return (
    <Dialog open={action !== null} onOpenChange={onOpenChange}>
      <DialogContent className="text-left">
        <DialogHeader>
          <DialogTitle>
            {suspending ? "Suspend" : "Reactivate"}{" "}
            {moderatorDisplayName(moderator)}?
          </DialogTitle>
          <DialogDescription>
            {suspending
              ? "They’ll immediately lose access to the moderation dashboard. You can reactivate them at any time."
              : "They’ll regain access to the moderation dashboard and can sign in again."}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose render={<Button variant="outline" />}>Cancel</DialogClose>
          <Button
            variant="brand"
            className={suspending ? "bg-rose-600 hover:bg-rose-700" : undefined}
            disabled={isPending}
            onClick={onConfirm}
          >
            {isPending
              ? suspending
                ? "Suspending…"
                : "Reactivating…"
              : suspending
                ? "Suspend"
                : "Reactivate"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
