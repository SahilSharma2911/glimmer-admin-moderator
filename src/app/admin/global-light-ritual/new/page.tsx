import type { Metadata } from "next";
import { AddGlobalEventPage } from "@/features/global-events/AddGlobalEventPage";

export const metadata: Metadata = {
  title: "Create event · Glimmers",
};

export default function AdminCreateGlobalEventPage() {
  return <AddGlobalEventPage />;
}
