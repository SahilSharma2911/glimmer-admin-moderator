import type { Metadata } from "next";
import { ModeratorDetailPage } from "@/features/admin-moderators/ModeratorDetailPage";

export const metadata: Metadata = {
  title: "Moderator · Glimmers",
};

export default async function AdminModeratorDetailPage({
  params,
}: {
  params: Promise<{ moderatorId: string }>;
}) {
  const { moderatorId } = await params;
  return <ModeratorDetailPage moderatorId={moderatorId} />;
}
