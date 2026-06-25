"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate } from "@/lib/format";
import { AlertTriangleIcon } from "@/lib/icons";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useModerationCase } from "./hooks/useModerationCase";
import { CaseStatusBadge } from "./components/CaseStatusBadge";
import { CaseFlagBadge } from "./components/CaseFlagBadge";
import { CaseContent } from "./components/CaseContent";
import { ParentContactCard } from "./components/ParentContactCard";
import { CaseStatusDialog } from "./components/CaseStatusDialog";
import { STATUS_ICONS } from "./components/status-icons";
import { useCaseStatusAction } from "./components/useCaseStatusAction";
import {
  CASE_TYPE_LABELS,
  DECISION_LABELS,
  SOURCE_LABELS,
  STATUS_ACTION_LABELS,
} from "./labels";
import {
  availableTransitions,
  canEditCaseStatus,
} from "./types/moderation-cases.types";
import type { ModerationCaseDetail } from "./types/moderation-cases.types";

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

/** Moderator-only review controls: move the case to a valid next status. */
function ReviewActions({ data }: { data: ModerationCaseDetail }) {
  const { target, setTarget, reviewNote, setReviewNote, isUpdating, onConfirm, close } =
    useCaseStatusAction(data);
  const transitions = availableTransitions(data);

  return (
    <>
      <div className="flex flex-wrap gap-2">
        {transitions.map((status) => {
          const Icon = STATUS_ICONS[status];
          const destructive = status === "REMOVE_CONTENT";
          const primary = status === "MARK_SAFE";
          return (
            <Button
              key={status}
              variant={destructive || !primary ? "outline" : "brand"}
              className={
                destructive
                  ? "border-rose-200 text-rose-600 hover:bg-rose-50"
                  : undefined
              }
              onClick={() => setTarget(status)}
            >
              <Icon size={16} />
              {STATUS_ACTION_LABELS[status]}
            </Button>
          );
        })}
      </div>

      <CaseStatusDialog
        target={target}
        reviewNote={reviewNote}
        onReviewNoteChange={setReviewNote}
        onOpenChange={(open) => !open && close()}
        onConfirm={onConfirm}
        isPending={isUpdating}
      />
    </>
  );
}

function LoadingState() {
  return (
    <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-6">
      {Array.from({ length: 5 }).map((_, i) => (
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
          Couldn&apos;t load this case
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

interface ModerationCaseDetailPageProps {
  caseId: string;
  /** Section the page is mounted under, for the back link. */
  basePath: "/admin" | "/moderator";
}

export function ModerationCaseDetailPage({
  caseId,
  basePath,
}: ModerationCaseDetailPageProps) {
  const { data, isLoading, isError, refetch } = useModerationCase(caseId);
  const { role } = useCurrentUser();
  const canEdit = canEditCaseStatus(role);

  return (
    <div className="space-y-6">
      <div>
        <Link
          href={`${basePath}/cases`}
          className="text-sm font-medium text-accent hover:underline"
        >
          ← Back to cases
        </Link>
      </div>

      <header className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-1.5">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            {data ? CASE_TYPE_LABELS[data.caseType] : "Case"}
          </h1>
          <div className="flex flex-wrap items-center gap-2">
            {data && <CaseStatusBadge status={data.status} />}
            {data && <CaseFlagBadge flag={data.flag} />}
            {data && (
              <span className="text-sm text-slate-500">
                {SOURCE_LABELS[data.source]}
              </span>
            )}
          </div>
        </div>
        {data && canEdit && <ReviewActions data={data} />}
      </header>

      {isLoading ? (
        <LoadingState />
      ) : isError || !data ? (
        <ErrorState onRetry={() => refetch()} />
      ) : (
        <div
          className={
            data.parent ? "grid grid-cols-1 gap-6 xl:grid-cols-3" : "space-y-6"
          }
        >
          <div className={data.parent ? "space-y-6 xl:col-span-2" : "space-y-6"}>
          <section className="rounded-xl border border-slate-200 bg-white p-6">
            <h2 className="text-sm font-semibold text-slate-900">Case</h2>
            <div className="mt-5 grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
              <Field label="Type" value={CASE_TYPE_LABELS[data.caseType]} />
              <Field label="Source" value={SOURCE_LABELS[data.source]} />
              <Field label="Status" value={<CaseStatusBadge status={data.status} />} />
              <Field label="Flag" value={<CaseFlagBadge flag={data.flag} />} />
              <Field
                label="AI decision"
                value={data.decision ? DECISION_LABELS[data.decision] : "—"}
              />
              <Field label="Category" value={data.category ?? "—"} />
              <Field
                label="Score"
                value={data.score !== null ? data.score : "—"}
              />
              <Field
                label="Raw flags"
                value={data.flags.length ? data.flags.join(", ") : "—"}
              />
              <Field label="Created" value={formatDate(data.createdAt)} />
            </div>
            {data.reason && (
              <div className="mt-6 space-y-1">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Reason
                </p>
                <p className="whitespace-pre-wrap rounded-lg bg-slate-50 p-3 text-sm leading-relaxed text-slate-700">
                  {data.reason}
                </p>
              </div>
            )}
          </section>

          <section className="rounded-xl border border-slate-200 bg-white p-6">
            <h2 className="text-sm font-semibold text-slate-900">Subject</h2>
            <div className="mt-5 grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
              <Field label="Child" value={data.child.username} />
              <Field label="Account status" value={data.child.accountStatus} />
              <Field label="Child ID" value={data.child.id} />
            </div>
          </section>

          <CaseContent data={data} />

          <section className="rounded-xl border border-slate-200 bg-white p-6">
            <h2 className="text-sm font-semibold text-slate-900">Review</h2>
            <div className="mt-5 grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
              <Field
                label="Reviewed by"
                value={data.reviewedBy?.name ?? data.reviewedBy?.email ?? "—"}
              />
              <Field
                label="Reviewed at"
                value={data.reviewedAt ? formatDate(data.reviewedAt) : "—"}
              />
            </div>
            {data.reviewNote && (
              <div className="mt-6 space-y-1">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Review note
                </p>
                <p className="whitespace-pre-wrap rounded-lg bg-slate-50 p-3 text-sm leading-relaxed text-slate-700">
                  {data.reviewNote}
                </p>
              </div>
            )}
          </section>
          </div>

          {data.parent && (
            <aside className="xl:col-span-1">
              <div className="xl:sticky xl:top-6">
                <ParentContactCard parent={data.parent} />
              </div>
            </aside>
          )}
        </div>
      )}
    </div>
  );
}
