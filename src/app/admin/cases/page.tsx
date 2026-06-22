import type { Metadata } from "next";
import { ModerationCasesPage } from "@/features/moderation-cases/ModerationCasesPage";

export const metadata: Metadata = {
  title: "Cases · Glimmers",
};

export default function AdminCasesPage() {
  return <ModerationCasesPage />;
}
