"use client";

import type { ReactNode } from "react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { RoleGuard } from "@/features/auth/RoleGuard";
import { ADMIN_NAV } from "@/config/nav";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <RoleGuard role="ADMIN">
      <DashboardShell nav={ADMIN_NAV}>{children}</DashboardShell>
    </RoleGuard>
  );
}
