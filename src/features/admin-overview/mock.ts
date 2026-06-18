import type { ComponentType } from "react";
import {
  FolderIcon,
  AlertTriangleIcon,
  DocumentIcon,
  UsersIcon,
  UserPlusIcon,
} from "@/lib/icons";

type Icon = ComponentType<{ size?: number; className?: string }>;

// NOTE: static placeholder data — the cases/stats/activity APIs don't exist
// yet. Swap these for real queries when the backend endpoints land.

export interface Stat {
  label: string;
  value: string;
  trend: string;
  icon: Icon;
  danger?: boolean;
}

export const STATS: Stat[] = [
  { label: "Total open cases", value: "186", trend: "18%", icon: FolderIcon },
  { label: "Critical cases", value: "13", trend: "18%", icon: AlertTriangleIcon, danger: true },
  { label: "Content review cases", value: "39", trend: "18%", icon: DocumentIcon },
  { label: "Active moderators", value: "22", trend: "5%", icon: UsersIcon },
];

export type CaseStatus = "Urgent" | "Low" | "In review";

export interface CaseRow {
  id: string;
  type: string;
  status: CaseStatus;
  assignee: string;
}

export const RECENT_CASES: CaseRow[] = [
  { id: "GLM-2025-1182", type: "Self-harm chat with Lumiri", status: "Urgent", assignee: "Ava" },
  { id: "GLM-2025-1181", type: "Self-harm content", status: "Urgent", assignee: "Jordan" },
  { id: "GLM-2025-1176", type: "Sexual content image", status: "Low", assignee: "Jordan" },
  { id: "GLM-2025-1170", type: "Content reported by user", status: "Low", assignee: "Jordan" },
  { id: "GLM-2025-1166", type: "Content reported by user", status: "Low", assignee: "Jordan" },
  { id: "GLM-2025-1160", type: "Content reported by user", status: "Low", assignee: "Jordan" },
];

export interface ActivityItem {
  icon: Icon;
  title: string;
  detail: string;
  time: string;
}

export const ACTIVITY: ActivityItem[] = [
  { icon: DocumentIcon, title: "Case updated", detail: "Case GLM-2025-1182 changed to Urgent", time: "10:24" },
  { icon: UserPlusIcon, title: "Moderator assigned", detail: "Ava P. assigned to GLM-2025-1182", time: "10:24" },
  { icon: DocumentIcon, title: "Case updated", detail: "GLM-2025-1174 changed to In review", time: "10:24" },
  { icon: UserPlusIcon, title: "Moderator added", detail: "Jamie L. joined as moderator", time: "10:24" },
];

export const NEXT_RITUAL = {
  name: "Light for Belonging",
  date: "May 21, 7:00 PM UTC",
  status: "Scheduled",
};
