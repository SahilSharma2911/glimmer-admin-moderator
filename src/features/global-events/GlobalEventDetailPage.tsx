"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Pencil, Trash2, Users } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate } from "@/lib/format";
import { AlertTriangleIcon } from "@/lib/icons";
import { useGlobalEvent } from "./hooks/useGlobalEvent";
import { GlobalEventStatusBadge } from "./components/GlobalEventStatusBadge";
import { DeleteEventDialog } from "./components/DeleteEventDialog";
import { isEventMutable } from "./types/global-events.types";
import type { GlobalEventSummary } from "./types/global-events.types";

const LIST_PATH = "/admin/global-light-ritual";

/** Date with time, e.g. "Jul 1, 2026, 7:00 PM". */
function formatDateTime(iso: string): string {
  return formatDate(iso, { month: "short", hour: "numeric", minute: "2-digit" });
}

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
        {label}
      </p>
      <div className="text-sm text-slate-800">{value ?? "—"}</div>
    </div>
  );
}

/** Edit / delete controls — only while the event is UPCOMING. */
function EventActions({ event }: { event: GlobalEventSummary }) {
  const router = useRouter();
  const [deleteOpen, setDeleteOpen] = React.useState(false);

  return (
    <>
      <div className="flex flex-wrap gap-2">
        <Link
          href={`${LIST_PATH}/${event.id}/edit`}
          className={buttonVariants({ variant: "outline" })}
        >
          <Pencil size={16} />
          Edit
        </Link>
        <Button
          variant="outline"
          className="border-rose-200 text-rose-600 hover:bg-rose-50"
          onClick={() => setDeleteOpen(true)}
        >
          <Trash2 size={16} />
          Delete
        </Button>
      </div>

      <DeleteEventDialog
        event={deleteOpen ? event : null}
        onOpenChange={setDeleteOpen}
        onDeleted={() => router.push(LIST_PATH)}
      />
    </>
  );
}

function LoadingState() {
  return (
    <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-6">
      {Array.from({ length: 4 }).map((_, i) => (
        <Skeleton key={i} className="h-10 w-full" />
      ))}
    </div>
  );
}

function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white px-6 py-16 text-center">
      <AlertTriangleIcon size={28} className="text-rose-400" />
      <div>
        <p className="text-sm font-medium text-slate-900">
          Couldn&apos;t load this event
        </p>
        <p className="mt-0.5 text-sm text-slate-500">
          It may no longer exist, or something went wrong.
        </p>
      </div>
      <Button variant="outline" size="sm" onClick={onRetry}>
        Try again
      </Button>
    </div>
  );
}

export function GlobalEventDetailPage({ eventId }: { eventId: string }) {
  const { data, isLoading, isError, refetch } = useGlobalEvent(eventId);

  return (
    <div className="space-y-6">
      <div>
        <Link
          href={LIST_PATH}
          className="text-sm font-medium text-accent hover:underline"
        >
          ← Back to events
        </Link>
      </div>

      <header className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-1.5">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            {data ? data.name : "Event"}
          </h1>
          <div className="flex flex-wrap items-center gap-2">
            {data && <GlobalEventStatusBadge status={data.status} />}
            {data && (
              <span className="text-sm text-slate-500">
                {formatDateTime(data.scheduledAt)}
              </span>
            )}
          </div>
        </div>
        {data && isEventMutable(data.status) && <EventActions event={data} />}
      </header>

      {isLoading ? (
        <LoadingState />
      ) : isError || !data ? (
        <ErrorState onRetry={() => refetch()} />
      ) : (
        <section className="rounded-xl border border-slate-200 bg-white p-6">
          <h2 className="text-sm font-semibold text-slate-900">Event</h2>
          <div className="mt-5 space-y-6">
            <div className="space-y-1">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Description
              </p>
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-700">
                {data.description}
              </p>
            </div>
            <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
              <Field label="Status" value={<GlobalEventStatusBadge status={data.status} />} />
              <Field label="Scheduled for" value={formatDateTime(data.scheduledAt)} />
              <Field label="Live until" value={formatDateTime(data.endsAt)} />
              <Field
                label="Participants joined"
                value={
                  <span className="inline-flex items-center gap-1.5">
                    <Users size={14} className="text-slate-400" />
                    {data.totalJoined}
                  </span>
                }
              />
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
