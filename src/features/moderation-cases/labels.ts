import type {
  ModerationCaseSource,
  ModerationCaseStatus,
  ModerationCaseType,
  ModerationDecision,
  ModerationFlag,
} from "./types/moderation-cases.types";

/**
 * Human-readable labels for the moderation-case enums. The backend stores raw
 * enum values; the dashboard renders these labels (e.g.
 * `SELF_HARM_IN_AUDIO_CAPSULE` → "Self-harm in Audio Capsule").
 */

/** State labels — what the case currently IS (badges, status field). */
export const STATUS_LABELS: Record<ModerationCaseStatus, string> = {
  OPEN: "Open",
  IN_REVIEW: "In review",
  RESOLVED: "Resolved",
  MARK_SAFE: "Marked safe",
  REMOVE_CONTENT: "Content removed",
};

/** Action labels — the verb for a transition (buttons, menu items). */
export const STATUS_ACTION_LABELS: Record<ModerationCaseStatus, string> = {
  OPEN: "Reopen",
  IN_REVIEW: "Move to review",
  RESOLVED: "Resolve",
  MARK_SAFE: "Mark safe",
  REMOVE_CONTENT: "Remove content",
};

/** Result-oriented confirmation messages shown after a successful action. */
export const STATUS_SUCCESS_LABELS: Record<ModerationCaseStatus, string> = {
  OPEN: "Case reopened.",
  IN_REVIEW: "Case moved to review.",
  RESOLVED: "Case resolved.",
  MARK_SAFE: "Content marked safe.",
  REMOVE_CONTENT: "Content removed.",
};

export const SOURCE_LABELS: Record<ModerationCaseSource, string> = {
  AI_MODERATION: "AI moderation",
  AI_SAFETY_SIGNAL: "AI safety signal",
  USER_REPORT: "User report",
};

/** S-code → short description (severity/recognition key). */
export const FLAG_LABELS: Record<ModerationFlag, string> = {
  S1: "S1",
  S2: "S2",
  S3: "S3 · Sexual content",
  S4: "S4 · Hate / bullying",
  S5: "S5 · Self-harm",
  S8: "S8 · Abuse disclosure",
};

export const DECISION_LABELS: Record<ModerationDecision, string> = {
  ALLOWED: "Allowed",
  FLAGGED: "Flagged",
  BLOCKED: "Blocked",
};

/**
 * Full taxonomy labels. Kept as an explicit map (not a generic transform) so
 * "Self-harm", "Lumiri", and surface names render exactly, and so a new backend
 * enum value surfaces as a TS error here rather than a mangled label.
 */
export const CASE_TYPE_LABELS: Record<ModerationCaseType, string> = {
  // Audio Capsule
  SELF_HARM_IN_AUDIO_CAPSULE: "Self-harm in Audio Capsule",
  SEXUAL_CONTENT_IN_AUDIO_CAPSULE: "Sexual content in Audio Capsule",
  ABUSE_DISCLOSURE_IN_AUDIO_CAPSULE: "Abuse disclosure in Audio Capsule",
  VIOLENCE_IN_AUDIO_CAPSULE: "Violence in Audio Capsule",
  NONVIOLENT_CRIME_IN_AUDIO_CAPSULE: "Non-violent crime in Audio Capsule",
  HATE_SPEECH_IN_AUDIO_CAPSULE: "Hate speech in Audio Capsule",
  // Written Capsule
  SELF_HARM_IN_WRITTEN_CAPSULE: "Self-harm in Written Capsule",
  SEXUAL_CONTENT_IN_WRITTEN_CAPSULE: "Sexual content in Written Capsule",
  ABUSE_DISCLOSURE_IN_WRITTEN_CAPSULE: "Abuse disclosure in Written Capsule",
  VIOLENCE_IN_WRITTEN_CAPSULE: "Violence in Written Capsule",
  NONVIOLENT_CRIME_IN_WRITTEN_CAPSULE: "Non-violent crime in Written Capsule",
  HATE_SPEECH_IN_WRITTEN_CAPSULE: "Hate speech in Written Capsule",
  // Image Capsule
  SELF_HARM_IN_IMAGE_CAPSULE: "Self-harm in Image Capsule",
  SEXUAL_CONTENT_IN_IMAGE_CAPSULE: "Sexual content in Image Capsule",
  ABUSE_DISCLOSURE_IN_IMAGE_CAPSULE: "Abuse disclosure in Image Capsule",
  VIOLENCE_IN_IMAGE_CAPSULE: "Violence in Image Capsule",
  NONVIOLENT_CRIME_IN_IMAGE_CAPSULE: "Non-violent crime in Image Capsule",
  HATE_SPEECH_IN_IMAGE_CAPSULE: "Hate speech in Image Capsule",
  // Doodle Capsule
  SELF_HARM_IN_DOODLE_CAPSULE: "Self-harm in Doodle Capsule",
  SEXUAL_CONTENT_IN_DOODLE_CAPSULE: "Sexual content in Doodle Capsule",
  ABUSE_DISCLOSURE_IN_DOODLE_CAPSULE: "Abuse disclosure in Doodle Capsule",
  VIOLENCE_IN_DOODLE_CAPSULE: "Violence in Doodle Capsule",
  NONVIOLENT_CRIME_IN_DOODLE_CAPSULE: "Non-violent crime in Doodle Capsule",
  HATE_SPEECH_IN_DOODLE_CAPSULE: "Hate speech in Doodle Capsule",
  // Lumiri Chat
  SELF_HARM_CHAT_WITH_LUMIRI: "Self-harm in Lumiri chat",
  ABUSE_DISCLOSURE_WITH_LUMIRI: "Abuse disclosure in Lumiri chat",
  // Journaling
  SELF_HARM_IN_JOURNAL_REFLECTION: "Self-harm in Journal reflection",
  SELF_HARM_IN_JOURNAL_AUDIO: "Self-harm in Journal audio",
  // User reports
  USER_REPORTED_CONTENT: "User-reported content",
  USER_REPORTED_MESSAGE: "User-reported message",
  // Fallback
  UNCLASSIFIED: "Unclassified",
};

export const statusLabel = (s: ModerationCaseStatus) => STATUS_LABELS[s];
export const sourceLabel = (s: ModerationCaseSource) => SOURCE_LABELS[s];
export const caseTypeLabel = (t: ModerationCaseType) => CASE_TYPE_LABELS[t];
export const flagLabel = (f: ModerationFlag) => FLAG_LABELS[f];
