"use client";

import type { ReactNode } from "react";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { UserIcon, MailIcon, ShieldIcon, InfoIcon } from "@/lib/icons";
import type { AdminRole } from "@/features/auth/types/auth.types";

function roleLabel(role: AdminRole | null): string {
  if (role === "ADMIN") return "Administrator";
  if (role === "MODERATOR") return "Moderator";
  return "—";
}

function initialsOf(name: string | null, email: string | null): string {
  const src = (name ?? "").trim();
  if (src) {
    const [a, b] = src.split(/\s+/);
    return (
      ((a?.[0] ?? "") + (b?.[0] ?? "")).toUpperCase() ||
      src.slice(0, 2).toUpperCase()
    );
  }
  return (email ?? "A").slice(0, 2).toUpperCase();
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: ReactNode;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-slate-200/70 bg-slate-50/60 px-4 py-3.5">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center text-accent">
        {icon}
      </span>
      <span className="w-28 shrink-0 text-sm text-slate-500">{label}</span>
      <span className="truncate text-sm font-semibold text-slate-800">
        {value}
      </span>
    </div>
  );
}

/** Read-only account summary — name, work email, and role. */
export function AccountCard() {
  const { name, email, role } = useCurrentUser();

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">Account</h2>
        <span className="flex items-center gap-1.5 text-xs text-slate-400">
          <InfoIcon size={15} />
          Managed by your administrator · view-only
        </span>
      </div>

      <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
        <span className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-brand text-2xl font-semibold text-white">
          {initialsOf(name, email)}
        </span>

        <div className="flex-1 space-y-3">
          <InfoRow
            icon={<UserIcon size={18} />}
            label="Name"
            value={name ?? "—"}
          />
          <InfoRow
            icon={<MailIcon size={18} />}
            label="Work email"
            value={email ?? "—"}
          />
          <InfoRow
            icon={<ShieldIcon size={18} />}
            label="Role"
            value={roleLabel(role)}
          />
        </div>
      </div>
    </section>
  );
}
