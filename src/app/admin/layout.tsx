"use client";

import type { ReactNode } from "react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { ADMIN_NAV } from "@/config/nav";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <DashboardShell nav={ADMIN_NAV}>{children}</DashboardShell>;
}
