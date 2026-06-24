import {
  CheckCircle2,
  Clock,
  RotateCcw,
  ShieldCheck,
  Trash2,
  type LucideIcon,
} from "lucide-react";
import type { ModerationCaseStatus } from "../types/moderation-cases.types";

/**
 * Icon per target status, shared by the row action menu and the detail-page
 * review buttons so the same change reads identically in both places.
 * OPEN/IN_REVIEW reopen or start review; RESOLVED closes with no content
 * action; MARK_SAFE clears the content; REMOVE_CONTENT takes it down.
 */
export const STATUS_ICONS: Record<ModerationCaseStatus, LucideIcon> = {
  OPEN: RotateCcw,
  IN_REVIEW: Clock,
  RESOLVED: CheckCircle2,
  MARK_SAFE: ShieldCheck,
  REMOVE_CONTENT: Trash2,
};
