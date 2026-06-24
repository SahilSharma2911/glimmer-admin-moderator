"use client";

import { AccountCard } from "./components/AccountCard";
import { SecurityCard } from "./components/SecurityCard";

/**
 * Account settings — shared by both the admin and moderator dashboards.
 * Shows a read-only account summary plus security actions (change password,
 * sign out). The page is role-agnostic; the data comes from the current user.
 */
export function SettingsPage() {
  return (
    <div className="mx-auto  space-y-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
          Settings
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Manage your account and security settings.
        </p>
      </header>

      <AccountCard />
      <SecurityCard />
    </div>
  );
}
