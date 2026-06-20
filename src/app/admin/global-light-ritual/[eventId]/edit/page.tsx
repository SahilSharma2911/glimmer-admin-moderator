import type { Metadata } from "next";
import { EditGlobalEventPage } from "@/features/global-events/EditGlobalEventPage";

export const metadata: Metadata = {
  title: "Edit event · Glimmers",
};

export default async function AdminEditGlobalEventPage({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  const { eventId } = await params;
  return <EditGlobalEventPage eventId={eventId} />;
}
