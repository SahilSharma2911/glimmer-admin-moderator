import type { Metadata } from "next";
import { ModerationCasesPage } from "@/features/moderation-cases/ModerationCasesPage";

export const metadata: Metadata = {
  title: "My Cases · Glimmers",
};

export default function ModeratorCasesPage() {
  return <ModerationCasesPage />;
}
