"use client";

import { useRouter, usePathname } from "next/navigation";
import { useCurrentUser } from "@/hooks/useCurrentUser";
// BellIcon is unused while the notifications button is commented out below.
import {
  MenuIcon,
  ChevronDownIcon,
  SettingsIcon,
  LogOutIcon,
} from "@/lib/icons";
import { roleHomePath } from "@/features/auth/roles";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
        <div className="flex items-center text-slate-700">
          <span className="text-sm font-medium">{active?.label ?? ""}</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Notifications — temporarily hidden until the feature is wired up.
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
        */}

        <DropdownMenu>
          <DropdownMenuTrigger
            className="group flex items-center gap-2 rounded-lg p-1 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/30"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand/15 text-sm font-semibold text-accent">
              {initialsOf(name, email)}
            </span>
            <span className="hidden text-left leading-tight sm:block">
              <span className="block text-sm font-medium text-slate-800">{display}</span>
              <span className="block text-xs text-slate-400">{roleLabel}</span>
            </span>
            <ChevronDownIcon
              size={16}
              className="text-slate-400 transition-transform group-data-popup-open:rotate-180"
            />
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" sideOffset={8} className="w-56">
            <div className="px-2 py-1.5">
              <p className="truncate text-sm font-medium text-slate-800">{display}</p>
              {email ? (
                <p className="truncate text-xs text-slate-400">{email}</p>
              ) : null}
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => router.push(`${roleHomePath(role)}/settings`)}
              className="focus:bg-accent-soft focus:text-accent"
            >
              <SettingsIcon size={16} />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive" onClick={handleLogout}>
              <LogOutIcon size={16} />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
