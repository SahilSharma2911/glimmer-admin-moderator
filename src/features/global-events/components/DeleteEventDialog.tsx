"use client";

import { toast } from "sonner";
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
import { useDeleteGlobalEvent } from "../hooks/useDeleteGlobalEvent";
import { globalEventErrorMessage } from "../error-message";
import type { GlobalEventSummary } from "../types/global-events.types";

interface DeleteEventDialogProps {
  /** The event to delete, or null when closed. */
  event: GlobalEventSummary | null;
  onOpenChange: (open: boolean) => void;
  /** Called after a successful delete (e.g. to navigate away from a detail page). */
  onDeleted?: () => void;
}

/** Confirmation dialog for deleting an UPCOMING global event. */
export function DeleteEventDialog({
  event,
  onOpenChange,
  onDeleted,
}: DeleteEventDialogProps) {
  const remove = useDeleteGlobalEvent();

  const onConfirm = () => {
    if (!event) return;
    remove.mutate(event.id, {
      onSuccess: () => {
        toast.success(`"${event.name}" deleted.`);
        onOpenChange(false);
        onDeleted?.();
      },
      onError: (error) => toast.error(globalEventErrorMessage(error)),
    });
  };

  return (
    <Dialog open={event !== null} onOpenChange={onOpenChange}>
      <DialogContent className="text-left">
        <DialogHeader>
          <DialogTitle>Delete {event?.name}?</DialogTitle>
          <DialogDescription>
            This permanently removes the scheduled event. Children will no longer
            see it. This can&rsquo;t be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose render={<Button variant="outline" />}>Cancel</DialogClose>
          <Button
            variant="brand"
            className="bg-rose-600 hover:bg-rose-700"
            disabled={remove.isPending}
            onClick={onConfirm}
          >
            {remove.isPending ? "Deleting…" : "Delete event"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
