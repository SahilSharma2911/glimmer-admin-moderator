import type { Metadata } from "next";
import { GlobalEventsPage } from "@/features/global-events/GlobalEventsPage";

export const metadata: Metadata = {
  title: "Global Light Ritual · Glimmers",
};

export default function AdminGlobalLightRitualPage() {
  return <GlobalEventsPage />;
}
