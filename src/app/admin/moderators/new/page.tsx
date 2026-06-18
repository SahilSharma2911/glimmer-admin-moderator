import type { Metadata } from "next";
import { AddModeratorPage } from "@/features/admin-moderators/AddModeratorPage";

export const metadata: Metadata = {
  title: "Add moderator · Glimmers",
};

export default function NewModeratorPage() {
  return <AddModeratorPage />;
}
