import { ModerationCasesClient } from "./components/client";

/**
 * Centralized moderation review queue. Rendered by both `/admin/cases`
 * (read-only supervisor view) and `/moderator/cases` (reviewers who can change
 * a case status). The client is identical; row actions gate on the role.
 */
export function ModerationCasesPage() {
  return <ModerationCasesClient />;
}
