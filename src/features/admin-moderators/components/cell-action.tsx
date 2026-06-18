"use client";

import { useRouter } from "next/navigation";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ModeratorConfirmDialog } from "./ModeratorConfirmDialog";
import { useModeratorActions } from "./useModeratorActions";
import type { Moderator } from "../types/moderators.types";

// The app maps `accent` to the brand purple, so the default `focus:bg-accent`
// hover renders too dark. Use the light brand tint for neutral menu items.
const ITEM_HOVER = "focus:bg-accent-soft focus:text-slate-900";

export function CellAction({ data }: { data: Moderator }) {
  const router = useRouter();
  const {
    confirm,
    setConfirm,
    isResending,
    isUpdating,
    isPending,
    onResend,
    onConfirm,
  } = useModeratorActions(data);

  return (
    <div className="flex justify-end">
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              variant="ghost"
              size="icon"
              aria-label="Open actions menu"
              disabled={isPending}
            />
          }
        >
          <MoreHorizontal className="size-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-44">
          <DropdownMenuItem
            className={ITEM_HOVER}
            onClick={() => router.push(`/admin/moderators/${data.id}`)}
          >
            View details
          </DropdownMenuItem>
          {data.status === "PENDING" && (
            <DropdownMenuItem
              className={ITEM_HOVER}
              onClick={onResend}
              disabled={isResending}
            >
              {isResending ? "Sending…" : "Resend invite"}
            </DropdownMenuItem>
          )}
          {data.status === "ACTIVE" && (
            <DropdownMenuItem
              onClick={() => setConfirm("SUSPENDED")}
              variant="destructive"
            >
              Suspend
            </DropdownMenuItem>
          )}
          {data.status === "SUSPENDED" && (
            <DropdownMenuItem
              className={ITEM_HOVER}
              onClick={() => setConfirm("ACTIVE")}
            >
              Reactivate
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <ModeratorConfirmDialog
        moderator={data}
        action={confirm}
        onOpenChange={(open) => !open && setConfirm(null)}
        onConfirm={onConfirm}
        isPending={isUpdating}
      />
    </div>
  );
}
