"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { MenuIcon, GridIcon, BellIcon, ChevronDownIcon } from "@/lib/icons";
import { isNavItemActive, type NavItem } from "./types";

function initialsOf(name?: string | null, email?: string | null): string {
  const src = (name ?? "").trim();
  if (src) {
    const [a, b] = src.split(/\s+/);
    return ((a?.[0] ?? "") + (b?.[0] ?? "")).toUpperCase() || src.slice(0, 2).toUpperCase();
  }
  return (email ?? "A").slice(0, 2).toUpperCase();
}

export function Topbar({
  nav,
  onToggleSidebar,
}: {
  nav: NavItem[];
  onToggleSidebar: () => void;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { name, email, role, logout } = useCurrentUser();
  const [menuOpen, setMenuOpen] = useState(false);

  const active = nav.find((i) => isNavItemActive(i, pathname));
  const display = name ?? email ?? "Account";
  const roleLabel =
    role === "ADMIN" ? "Safety Admin" : role === "MODERATOR" ? "Moderator" : "";

  const handleLogout = () => {
    logout();
    router.replace("/login");
  };

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-4 lg:px-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          aria-label="Toggle sidebar"
          onClick={onToggleSidebar}
          className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100"
        >
          <MenuIcon size={20} />
        </button>
        <div className="flex items-center gap-2 text-slate-700">
          <GridIcon size={18} className="text-slate-400" />
          <span className="text-sm font-medium">{active?.label ?? ""}</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          aria-label="Notifications"
          className="relative rounded-md p-1.5 text-slate-500 hover:bg-slate-100"
        >
          <BellIcon size={20} />
          <span className="absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand px-1 text-[10px] font-semibold text-white">
            9
          </span>
        </button>

        <div className="relative">
          <button
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
            className="flex items-center gap-2 rounded-lg p-1 hover:bg-slate-50"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand/15 text-sm font-semibold text-accent">
              {initialsOf(name, email)}
            </span>
            <span className="hidden text-left leading-tight sm:block">
              <span className="block text-sm font-medium text-slate-800">{display}</span>
              <span className="block text-xs text-slate-400">{roleLabel}</span>
            </span>
            <ChevronDownIcon size={16} className="text-slate-400" />
          </button>

          {menuOpen ? (
            <>
              <button
                type="button"
                aria-hidden
                tabIndex={-1}
                className="fixed inset-0 z-10 cursor-default"
                onClick={() => setMenuOpen(false)}
              />
              <div className="absolute right-0 z-20 mt-2 w-44 overflow-hidden rounded-lg border border-slate-200 bg-white py-1 shadow-lg">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="block w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
                >
                  Log out
                </button>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </header>
  );
}
