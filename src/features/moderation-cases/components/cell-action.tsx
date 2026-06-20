"use client";

import { usePathname, useRouter } from "next/navigation";
import { Eye, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { CaseStatusDialog } from "./CaseStatusDialog";
import { useCaseStatusAction } from "./useCaseStatusAction";
import { STATUS_LABELS } from "../labels";
import {
  canEditCaseStatus,
  nextStatuses,
} from "../types/moderation-cases.types";
import { STATUS_ICONS } from "./status-icons";
import type { ModerationCaseListItem } from "../types/moderation-cases.types";

// The app maps `accent` to the brand purple, so the default `focus:bg-accent`
// hover renders too dark. Use the light brand tint for neutral menu items.
const ITEM_HOVER = "focus:bg-accent-soft focus:text-slate-900";

/** Section of the app we're in, so the detail link resolves to the right route. */
function useRouteBase(): "/admin" | "/moderator" {
  const pathname = usePathname();
  return pathname.startsWith("/moderator") ? "/moderator" : "/admin";
}

/**
 * Row actions. "View details" is available to both roles (reads are open);
 * the status change is MODERATOR only.
 */
export function CellAction({ data }: { data: ModerationCaseListItem }) {
  const router = useRouter();
  const base = useRouteBase();
  const { role } = useCurrentUser();

  const { target, setTarget, reviewNote, setReviewNote, isUpdating, onConfirm, close } =
    useCaseStatusAction(data);

  const transitions = canEditCaseStatus(role) ? nextStatuses(data.status) : [];

  return (
    <div className="flex justify-end">
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              variant="ghost"
              size="icon"
              aria-label="Open actions menu"
              disabled={isUpdating}
            />
          }
        >
          <MoreHorizontal className="size-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem
            className={ITEM_HOVER}
            onClick={() => router.push(`${base}/cases/${data.id}`)}
          >
            <Eye />
            View details
          </DropdownMenuItem>

          {transitions.length > 0 && <DropdownMenuSeparator />}
          {transitions.map((status) => {
            const Icon = STATUS_ICONS[status];
            return (
              <DropdownMenuItem
                key={status}
                className={ITEM_HOVER}
                variant={status === "DISMISSED" ? "destructive" : undefined}
                onClick={() => setTarget(status)}
              >
                <Icon />
                Mark {STATUS_LABELS[status].toLowerCase()}
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>

      <CaseStatusDialog
        target={target}
        reviewNote={reviewNote}
        onReviewNoteChange={setReviewNote}
        onOpenChange={(open) => !open && close()}
        onConfirm={onConfirm}
        isPending={isUpdating}
      />
    </div>
  );
}
