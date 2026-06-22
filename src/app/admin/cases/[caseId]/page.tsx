import type { Metadata } from "next";
import { ModerationCaseDetailPage } from "@/features/moderation-cases/ModerationCaseDetailPage";

export const metadata: Metadata = {
  title: "Case · Glimmers",
};

export default async function AdminCaseDetailPage({
  params,
}: {
  params: Promise<{ caseId: string }>;
}) {
  const { caseId } = await params;
  return <ModerationCaseDetailPage caseId={caseId} basePath="/admin" />;
}
