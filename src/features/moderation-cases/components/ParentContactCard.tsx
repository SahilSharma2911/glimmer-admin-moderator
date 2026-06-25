import { Phone, Mail, UserRound } from "lucide-react";
import type { ModerationCaseParent } from "../types/moderation-cases.types";

/**
 * Guardian-contact + call-guidance panel for S5 self-harm cases. The contact
 * details come from the case detail (`parent`, S5-only); the call steps and
 * suggested opening are static guidance for the moderator. There is no backend
 * call-log endpoint yet, so this is reference-only (no "save call" form).
 */

const CALL_STEPS = [
  "Confirm you're speaking to the guardian.",
  "Introduce yourself as part of the Glimmers moderation team.",
  "Explain that a serious child-safety concern was detected.",
  "Ask the guardian to check on the child immediately.",
  "Share support guidance and advise them to stay with the child.",
  "If the child is in immediate danger, ask them to contact local emergency support.",
  "Record the call outcome and next step in the review note.",
];

function ContactRow({
  icon,
  label,
  value,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  href?: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent-soft text-accent">
        {icon}
      </span>
      <div className="min-w-0">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
          {label}
        </p>
        {href ? (
          <a
            href={href}
            className="break-words text-sm font-medium text-accent hover:underline"
          >
            {value}
          </a>
        ) : (
          <p className="break-words text-sm font-medium text-slate-800">{value}</p>
        )}
      </div>
    </div>
  );
}

export function ParentContactCard({
  parent,
}: {
  parent: ModerationCaseParent;
}) {
  const name = parent.fullName?.trim() || "Guardian";
  const firstName = name.split(/\s+/)[0];

  return (
    <section className="space-y-5 rounded-xl border border-slate-200 bg-white p-6">
      <div className="flex items-center gap-2">
        <UserRound size={18} className="text-accent" />
        <h2 className="text-sm font-semibold text-slate-900">
          Parent communication
        </h2>
      </div>

      <div className="space-y-4">
        <ContactRow
          icon={<UserRound size={16} />}
          label="Parent / guardian"
          value={name}
        />
        <ContactRow
          icon={<Phone size={16} />}
          label="Phone"
          value={parent.phone ?? "Not on file"}
          href={parent.phone ? `tel:${parent.phone}` : undefined}
        />
        <ContactRow
          icon={<Mail size={16} />}
          label="Email"
          value={parent.email}
          href={`mailto:${parent.email}`}
        />
      </div>

      <div className="space-y-2">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
          Call guidance
        </p>
        <ol className="space-y-2">
          {CALL_STEPS.map((step, i) => (
            <li key={i} className="flex gap-2.5 text-sm text-slate-600">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent-soft text-[11px] font-semibold text-accent">
                {i + 1}
              </span>
              <span className="leading-relaxed">{step}</span>
            </li>
          ))}
        </ol>
      </div>

      <div className="rounded-lg bg-slate-50 p-3">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
          Suggested opening
        </p>
        <p className="mt-1 text-sm leading-relaxed text-slate-700">
          Hi {firstName}, this is the Glimmers moderation team. I&rsquo;m calling
          because we identified a serious safety concern and need you to check on
          your child right away.
        </p>
      </div>
    </section>
  );
}
