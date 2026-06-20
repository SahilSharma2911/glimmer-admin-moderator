import {
  CheckCircle2,
  Clock,
  RotateCcw,
  XCircle,
  type LucideIcon,
} from "lucide-react";
import type { ModerationCaseStatus } from "../types/moderation-cases.types";

/**
 * Icon per target status, shared by the row action menu and the detail-page
 * review buttons so the same change reads identically in both places.
 * OPEN/IN_REVIEW are reached by reopening or starting review; RESOLVED and
 * DISMISSED close the case out.
 */
export const STATUS_ICONS: Record<ModerationCaseStatus, LucideIcon> = {
  OPEN: RotateCcw,
  IN_REVIEW: Clock,
  RESOLVED: CheckCircle2,
  DISMISSED: XCircle,
};
