"use client";

import * as React from "react";
import { formatDate } from "@/lib/format";
import type { ModerationCaseDetail } from "../types/moderation-cases.types";

/**
 * Renders the linked content attached to a case — exactly one of capsule /
 * journal / message / Lumiri session, matching the case's surface. The detail
 * API types these loosely (raw Prisma rows), so fields are read defensively;
 * journal text/media arrive already decrypted from the backend.
 */

type Content = Record<string, unknown>;

const str = (o: Content, k: string): string | null =>
  typeof o[k] === "string" && o[k] ? (o[k] as string) : null;
const num = (o: Content, k: string): number | null =>
  typeof o[k] === "number" ? (o[k] as number) : null;
const bool = (o: Content, k: string): boolean => o[k] === true;
const list = (o: Content, k: string): string[] =>
  Array.isArray(o[k]) ? (o[k] as unknown[]).map(String) : [];

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  if (value === null || value === undefined || value === "") return null;
  return (
    <div className="space-y-1">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
        {label}
      </p>
      <div className="text-sm text-slate-800">{value}</div>
    </div>
  );
}

function LongText({ value }: { value: string | null }) {
  if (!value) return null;
  return (
    <p className="whitespace-pre-wrap rounded-lg bg-slate-50 p-3 text-sm leading-relaxed text-slate-700">
      {value}
    </p>
  );
}

function Audio({ url }: { url: string | null }) {
  if (!url) return null;
  return <audio controls src={url} className="mt-1 w-full max-w-md" />;
}

function ImageMedia({ url, alt }: { url: string | null; alt: string }) {
  if (!url) return null;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={url}
      alt={alt}
      className="mt-1 max-h-72 w-auto rounded-lg border border-slate-200 object-contain"
    />
  );
}

function MediaLinks({ urls }: { urls: string[] }) {
  if (urls.length === 0) return null;
  return (
    <ul className="space-y-1">
      {urls.map((u) => (
        <li key={u}>
          <a
            href={u}
            target="_blank"
            rel="noreferrer"
            className="text-sm font-medium text-accent hover:underline"
          >
            {u}
          </a>
        </li>
      ))}
    </ul>
  );
}

// The media leaves below render `null` when empty, but `Row` only sees the
// (always-truthy) element and would still show a dangling label. These wrappers
// guard on the underlying value so absent fields drop the whole row, matching
// how the Grid's `str()`/`num()` rows hide.
function TextRow({ label, value }: { label: string; value: string | null }) {
  return value ? <Row label={label} value={<LongText value={value} />} /> : null;
}

function AudioRow({ label, url }: { label: string; url: string | null }) {
  return url ? <Row label={label} value={<Audio url={url} />} /> : null;
}

function ImageRow({
  label,
  url,
  alt,
}: {
  label: string;
  url: string | null;
  alt: string;
}) {
  return url ? <Row label={label} value={<ImageMedia url={url} alt={alt} />} /> : null;
}

function MediaRow({ label, urls }: { label: string; urls: string[] }) {
  return urls.length ? <Row label={label} value={<MediaLinks urls={urls} />} /> : null;
}

function Grid({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">
      {children}
    </div>
  );
}

function mediaUrlList(c: Content): string[] {
  const raw = c.mediaUrls;
  if (Array.isArray(raw)) return raw.map(String);
  if (typeof raw === "string" && raw) return [raw];
  return [];
}

function CapsuleContent({ c }: { c: Content }) {
  return (
    <div className="space-y-5">
      <Grid>
        <Row label="Capsule type" value={str(c, "type")} />
        <Row label="Status" value={str(c, "status")} />
        <Row label="Visibility" value={str(c, "visibility")} />
        <Row label="Name" value={str(c, "name")} />
        <Row label="Moderation score" value={num(c, "moderationScore")} />
        <Row label="Moderation category" value={str(c, "moderationCategory")} />
        <Row
          label="Created"
          value={str(c, "createdAt") ? formatDate(str(c, "createdAt")) : null}
        />
      </Grid>
      <TextRow label="Text content" value={str(c, "textContent")} />
      <TextRow label="Prompt response" value={str(c, "promptResponse")} />
      <AudioRow label="Audio" url={str(c, "audioUrl")} />
      <ImageRow label="Doodle" url={str(c, "doodleUrl")} alt="Capsule doodle" />
      <MediaRow label="Media" urls={mediaUrlList(c)} />
    </div>
  );
}

function JournalContent({ c }: { c: Content }) {
  return (
    <div className="space-y-5">
      <Grid>
        <Row label="Category" value={str(c, "category")} />
        <Row label="Content type" value={str(c, "contentType")} />
        <Row label="Visibility" value={str(c, "visibility")} />
        <Row label="Risk score" value={num(c, "riskScore")} />
        <Row
          label="Flags"
          value={list(c, "flags").join(", ") || null}
        />
        <Row
          label="Created"
          value={str(c, "createdAt") ? formatDate(str(c, "createdAt")) : null}
        />
      </Grid>
      <TextRow label="Prompt" value={str(c, "promptText")} />
      <TextRow label="Reflection" value={str(c, "textContent")} />
      <AudioRow label="Audio" url={str(c, "audioUrl")} />
      <ImageRow label="Drawing" url={str(c, "drawingUrl")} alt="Journal drawing" />
    </div>
  );
}

function MessageContent({ c }: { c: Content }) {
  return (
    <div className="space-y-5">
      <Grid>
        <Row label="Circle" value={str(c, "circleId")} />
        <Row label="Deleted" value={bool(c, "isDeleted") ? "Yes" : "No"} />
        <Row
          label="Sent"
          value={str(c, "createdAt") ? formatDate(str(c, "createdAt")) : null}
        />
      </Grid>
      <TextRow label="Message" value={str(c, "content")} />
    </div>
  );
}

function LumiriContent({ c }: { c: Content }) {
  const summary =
    c.summary && typeof c.summary === "object"
      ? (c.summary as Content)
      : null;
  return (
    <div className="space-y-5">
      <Grid>
        <Row label="Mode" value={str(c, "mode")} />
        <Row label="Sub type" value={str(c, "subType")} />
        <Row label="Status" value={str(c, "status")} />
        <Row label="Close reason" value={str(c, "closeReason")} />
        <Row label="Age at start" value={num(c, "ageAtStart")} />
        <Row
          label="Started"
          value={str(c, "createdAt") ? formatDate(str(c, "createdAt")) : null}
        />
      </Grid>
      {summary && (
        <div className="space-y-5 rounded-lg border border-slate-200 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Session summary
          </p>
          <TextRow label="Summary" value={str(summary, "summaryText")} />
          <Grid>
            <Row label="Mood intensity" value={str(summary, "moodIntensity")} />
            <Row label="Mood signals" value={list(summary, "moodSignals").join(", ") || null} />
            <Row label="Themes" value={list(summary, "themes").join(", ") || null} />
            <Row
              label="Safety signals"
              value={list(summary, "safetySignals").join(", ") || null}
            />
          </Grid>
        </div>
      )}
    </div>
  );
}

export function CaseContent({ data }: { data: ModerationCaseDetail }) {
  let title = "Linked content";
  let body: React.ReactNode = null;

  if (data.capsule) {
    title = "Capsule";
    body = <CapsuleContent c={data.capsule} />;
  } else if (data.journal) {
    title = "Journal entry";
    body = <JournalContent c={data.journal} />;
  } else if (data.message) {
    title = "Circle message";
    body = <MessageContent c={data.message} />;
  } else if (data.lumiriSession) {
    title = "Lumiri session";
    body = <LumiriContent c={data.lumiriSession} />;
  }

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6">
      <h2 className="text-sm font-semibold text-slate-900">{title}</h2>
      <div className="mt-5">
        {body ?? (
          <p className="text-sm text-slate-500">
            No linked content is attached to this case.
          </p>
        )}
      </div>
    </section>
  );
}
