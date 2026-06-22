import type { Metadata } from "next";
import { GlobalEventDetailPage } from "@/features/global-events/GlobalEventDetailPage";

export const metadata: Metadata = {
  title: "Event · Glimmers",
};

export default async function AdminGlobalEventDetailPage({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  const { eventId } = await params;
  return <GlobalEventDetailPage eventId={eventId} />;
}
