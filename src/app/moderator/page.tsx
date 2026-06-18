import type { Metadata } from "next";
import { ModeratorOverview } from "@/features/moderator-overview/ModeratorOverview";

export const metadata: Metadata = {
  title: "Moderator Overview · Glimmers",
};

export default function ModeratorOverviewPage() {
  return <ModeratorOverview />;
}
