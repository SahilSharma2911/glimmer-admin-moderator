import {
  GridIcon,
  FolderIcon,
  UsersIcon,
  SparkleIcon,
  SettingsIcon,
} from "@/lib/icons";
import type { NavItem } from "@/components/layout/types";

/**
 * Sidebar navigation per role. Passed into <DashboardShell nav={...} />.
 * Add/remove items here as features land.
 */
export const ADMIN_NAV: NavItem[] = [
  { label: "Overview", href: "/admin", icon: GridIcon, exact: true },
  { label: "Cases", href: "/admin/cases", icon: FolderIcon },
  { label: "Moderators", href: "/admin/moderators", icon: UsersIcon },
  { label: "Global Light Ritual", href: "/admin/global-light-ritual", icon: SparkleIcon },
  { label: "Settings", href: "/admin/settings", icon: SettingsIcon },
];

export const MODERATOR_NAV: NavItem[] = [
  { label: "Overview", href: "/moderator", icon: GridIcon, exact: true },
  { label: "My Cases", href: "/moderator/cases", icon: FolderIcon },
  { label: "Settings", href: "/moderator/settings", icon: SettingsIcon },
];
