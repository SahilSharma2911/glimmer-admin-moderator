"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import { LockIcon, LogOutIcon, ChevronDownIcon } from "@/lib/icons";
import { ChangePasswordDialog } from "./ChangePasswordDialog";
import { SignOutDialog } from "./SignOutDialog";

function SecurityRow({
  icon,
  label,
  description,
  onClick,
  danger = false,
}: {
  icon: ReactNode;
  label: string;
  description: string;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-4 px-2 py-4 text-left transition-colors hover:bg-slate-50"
    >
      <span
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
          danger ? "bg-rose-50 text-rose-600" : "bg-accent-soft text-accent"
        }`}
      >
        {icon}
      </span>
      <span className="flex-1">
        <span
          className={`block text-sm font-semibold ${
            danger ? "text-rose-600" : "text-slate-800"
          }`}
        >
          {label}
        </span>
        <span className="block text-xs text-slate-400">{description}</span>
      </span>
      <ChevronDownIcon size={18} className="-rotate-90 text-slate-300" />
    </button>
  );
}

/** Security actions — change password and sign out. */
export function SecurityCard() {
  const [changeOpen, setChangeOpen] = useState(false);
  const [signOutOpen, setSignOutOpen] = useState(false);

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6">
      <h2 className="mb-2 text-lg font-semibold text-slate-900">Security</h2>

      <div className="divide-y divide-slate-100">
        <SecurityRow
          icon={<LockIcon size={20} />}
          label="Change password"
          description="Update the password you use to sign in."
          onClick={() => setChangeOpen(true)}
        />
        <SecurityRow
          icon={<LogOutIcon size={20} />}
          label="Log out"
          description="Sign out of the dashboard on this device."
          onClick={() => setSignOutOpen(true)}
          danger
        />
      </div>

      <ChangePasswordDialog open={changeOpen} onOpenChange={setChangeOpen} />
      <SignOutDialog open={signOutOpen} onOpenChange={setSignOutOpen} />
    </section>
  );
}
