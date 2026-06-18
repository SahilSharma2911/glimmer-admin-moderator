"use client";

import type { ReactNode } from "react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { RoleGuard } from "@/features/auth/RoleGuard";
import { MODERATOR_NAV } from "@/config/nav";

export default function ModeratorLayout({ children }: { children: ReactNode }) {
  return (
    <RoleGuard role="MODERATOR">
      <DashboardShell nav={MODERATOR_NAV}>{children}</DashboardShell>
    </RoleGuard>
  );
}
