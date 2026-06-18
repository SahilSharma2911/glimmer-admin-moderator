"use client";

import type { ReactNode } from "react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { MODERATOR_NAV } from "@/config/nav";

export default function ModeratorLayout({ children }: { children: ReactNode }) {
  return <DashboardShell nav={MODERATOR_NAV}>{children}</DashboardShell>;
}
