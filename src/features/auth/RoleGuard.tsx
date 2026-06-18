"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useMe } from "@/features/auth/hooks/useMe";
import { roleStore } from "@/lib/api/token";
import { roleHomePath } from "@/features/auth/roles";
import type { AdminRole } from "@/features/auth/types/auth.types";

/**
 * Client-side role gate for a dashboard area.
 *
 * The `glimmers_admin_role` cookie that `proxy.ts` routes on is editable by the
 * user, so a moderator could tamper it to land on `/admin`. The real role comes
 * from the signed token via `/me`; this component blocks rendering until that's
 * confirmed, redirects to the user's real home on mismatch, and rewrites the
 * cookie to the truth so the proxy stops disagreeing. (Authorization itself is
 * still enforced server-side — this is UX hygiene, not the security boundary.)
 */
export function RoleGuard({
  role: required,
  children,
}: {
  role: AdminRole;
  children: ReactNode;
}) {
  const router = useRouter();
  const { data: user, isLoading, isError } = useMe();
  const realRole = user?.role ?? null;
  const allowed = realRole === required;

  useEffect(() => {
    if (!realRole) return;
    // Self-heal a stale/tampered role cookie so the proxy reflects the truth.
    roleStore.set(realRole);
    if (realRole !== required) {
      router.replace(roleHomePath(realRole));
    }
  }, [realRole, required, router]);

  // Don't reveal the area until the real role is confirmed to match.
  if (isLoading || isError || !allowed) {
    return (
      <div className="flex h-screen items-center justify-center">
        <span
          aria-label="Loading"
          className="size-6 animate-spin rounded-full border-2 border-slate-200 border-t-brand"
        />
      </div>
    );
  }

  return <>{children}</>;
}
