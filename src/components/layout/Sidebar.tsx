"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { XIcon } from "@/lib/icons";
import { isNavItemActive, type NavItem } from "./types";

export function Sidebar({
  nav,
  collapsed,
  mobileOpen,
  onClose,
}: {
  nav: NavItem[];
  collapsed: boolean;
  mobileOpen: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen ? (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={onClose}
          className="fixed inset-0 z-30 bg-slate-900/30 lg:hidden"
        />
      ) : null}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex h-full w-64 flex-col border-r border-slate-200 bg-white transition-transform duration-200 lg:relative lg:z-40 lg:translate-x-0 lg:transition-[width] ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        } ${collapsed ? "lg:w-[72px]" : "lg:w-64"}`}
      >
        <div
          className={`flex h-16 items-center gap-2 px-6 ${
            collapsed ? "lg:justify-center lg:px-0" : ""
          }`}
        >
          <Image
            src="/images/logo2.png"
            alt="Glimmers"
            width={30}
            height={30}
            priority
          />
          <span
            className={`text-xl font-semibold tracking-tight text-[#5631C8] ${
              collapsed ? "lg:hidden" : ""
            }`}
          >
            Glimmers
          </span>
          <button
            type="button"
            aria-label="Close sidebar"
            onClick={onClose}
            className="ml-auto rounded-md p-1.5 text-slate-500 hover:bg-slate-100 lg:hidden"
          >
            <XIcon size={20} />
          </button>
        </div>

        <nav
          className={`flex-1 space-y-1 overflow-y-auto px-3 py-4 ${
            collapsed ? "lg:overflow-visible" : ""
          }`}
        >
          {nav.map((item) => {
            const active = isNavItemActive(item, pathname);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  collapsed ? "lg:justify-center" : ""
                } ${
                  active
                    ? "bg-accent-soft text-accent"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <Icon size={18} />
                <span className={collapsed ? "lg:hidden" : ""}>{item.label}</span>
                {/* Tooltip — only when collapsed, desktop only */}
                {collapsed ? (
                  <span className="pointer-events-none absolute left-full z-50 ml-3 hidden whitespace-nowrap rounded-md bg-slate-900 px-2 py-1 text-xs font-medium text-white shadow-md lg:group-hover:block">
                    {item.label}
                  </span>
                ) : null}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
