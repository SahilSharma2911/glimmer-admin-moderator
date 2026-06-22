"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Eye, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DeleteEventDialog } from "./DeleteEventDialog";
import { isEventMutable } from "../types/global-events.types";
import type { GlobalEventSummary } from "../types/global-events.types";

// The app maps `accent` to the brand purple, so the default `focus:bg-accent`
// hover renders too dark. Use the light brand tint for neutral menu items.
const ITEM_HOVER = "focus:bg-accent-soft focus:text-slate-900";

const BASE_PATH = "/admin/global-light-ritual";

/**
 * Row actions for a global event. Edit and delete are only offered while the
 * event is UPCOMING — once it's LIVE or ENDED the backend rejects mutations.
 * View and edit navigate to their pages; delete confirms inline.
 */
export function CellAction({ data }: { data: GlobalEventSummary }) {
  const router = useRouter();
  const [deleteOpen, setDeleteOpen] = React.useState(false);

  // Edit/delete are only valid while UPCOMING; viewing is always available.
  const mutable = isEventMutable(data.status);

  return (
    <div className="flex justify-end">
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button variant="ghost" size="icon" aria-label="Open actions menu" />
          }
        >
          <MoreHorizontal className="size-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40">
          <DropdownMenuItem
            className={ITEM_HOVER}
            onClick={() => router.push(`${BASE_PATH}/${data.id}`)}
          >
            <Eye />
            View details
          </DropdownMenuItem>

          {mutable && <DropdownMenuSeparator />}
          {mutable && (
            <DropdownMenuItem
              className={ITEM_HOVER}
              onClick={() => router.push(`${BASE_PATH}/${data.id}/edit`)}
            >
              <Pencil />
              Edit
            </DropdownMenuItem>
          )}
          {mutable && (
            <DropdownMenuItem
              variant="destructive"
              onClick={() => setDeleteOpen(true)}
            >
              <Trash2 />
              Delete
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <DeleteEventDialog
        event={deleteOpen ? data : null}
        onOpenChange={setDeleteOpen}
      />
    </div>
  );
}
