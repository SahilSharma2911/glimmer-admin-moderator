"use client";

import { useState, type ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import type { NavItem } from "./types";

/**
 * App shell for authenticated areas. The outer box is fixed to the viewport
 * height, so the sidebar and topbar stay put and only <main> scrolls.
 * `nav` is passed in by the route layout so each role can supply its own links.
 */
export function DashboardShell({
  nav,
  children,
}: {
  nav: NavItem[];
  children: ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Desktop: collapse/expand. Mobile: open/close the drawer.
  const handleToggle = () => {
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(min-width: 1024px)").matches
    ) {
      setCollapsed((c) => !c);
    } else {
      setMobileOpen((o) => !o);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 font-hanken-grotesk text-slate-900">
      <Sidebar
        nav={nav}
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar nav={nav} onToggleSidebar={handleToggle} />
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
