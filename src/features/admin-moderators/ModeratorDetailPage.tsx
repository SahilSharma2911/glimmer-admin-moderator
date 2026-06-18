"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate } from "@/lib/format";
import { AlertTriangleIcon, MailIcon } from "@/lib/icons";
import { useModerator } from "./hooks/useModerator";
import { ModeratorStatusBadge } from "./components/ModeratorStatusBadge";
import { ModeratorConfirmDialog } from "./components/ModeratorConfirmDialog";
import {
  moderatorDisplayName,
  useModeratorActions,
} from "./components/useModeratorActions";
import type { Moderator } from "./types/moderators.types";

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

function ModeratorActions({ moderator }: { moderator: Moderator }) {
  const {
    confirm,
    setConfirm,
    isResending,
    isUpdating,
    onResend,
    onConfirm,
  } = useModeratorActions(moderator);

  return (
    <>
      <div className="flex flex-wrap gap-2">
        {moderator.status === "PENDING" && (
          <Button variant="outline" onClick={onResend} disabled={isResending}>
            <MailIcon size={16} />
            {isResending ? "Sending…" : "Resend invite"}
          </Button>
        )}
        {moderator.status === "ACTIVE" && (
          <Button
            variant="outline"
            className="border-rose-200 text-rose-600 hover:bg-rose-50"
            onClick={() => setConfirm("SUSPENDED")}
          >
            Suspend
          </Button>
        )}
        {moderator.status === "SUSPENDED" && (
          <Button variant="brand" onClick={() => setConfirm("ACTIVE")}>
            Reactivate
          </Button>
        )}
      </div>

      <ModeratorConfirmDialog
        moderator={moderator}
        action={confirm}
        onOpenChange={(open) => !open && setConfirm(null)}
        onConfirm={onConfirm}
        isPending={isUpdating}
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
          Couldn&apos;t load this moderator
        </p>
        <p className="mt-0.5 text-sm text-slate-500">
          They may no longer exist, or something went wrong.
        </p>
      </div>
      <Button variant="outline" size="sm" onClick={onRetry}>
        Try again
      </Button>
    </div>
  );
}

export function ModeratorDetailPage({ moderatorId }: { moderatorId: string }) {
  const { data: moderator, isLoading, isError, refetch } =
    useModerator(moderatorId);

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/moderators"
          className="text-sm font-medium text-accent hover:underline"
        >
          ← Back to moderators
        </Link>
      </div>

      <header className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-brand/15 text-sm font-semibold text-accent">
            {moderator
              ? moderatorDisplayName(moderator).slice(0, 1).toUpperCase()
              : "?"}
          </span>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
              {moderator ? moderatorDisplayName(moderator) : "Moderator"}
            </h1>
            <p className="mt-0.5 text-sm text-slate-500">
              {moderator?.email ?? "Moderator details"}
            </p>
          </div>
        </div>
        {moderator && <ModeratorActions moderator={moderator} />}
      </header>

      {isLoading ? (
        <LoadingState />
      ) : isError || !moderator ? (
        <ErrorState onRetry={() => refetch()} />
      ) : (
        <section className="rounded-xl border border-slate-200 bg-white p-6">
          <h2 className="text-sm font-semibold text-slate-900">
            Moderator details
          </h2>
          <div className="mt-5 grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
            <Field label="Name" value={moderator.name ?? "—"} />
            <Field label="Email" value={moderator.email} />
            <Field label="Role" value={moderator.role} />
            <Field
              label="Status"
              value={<ModeratorStatusBadge status={moderator.status} />}
            />
            <Field
              label="Onboarded"
              value={
                moderator.onboardedAt ? formatDate(moderator.onboardedAt) : "—"
              }
            />
            <Field label="Joined" value={formatDate(moderator.createdAt)} />
          </div>
        </section>
      )}
    </div>
  );
}
