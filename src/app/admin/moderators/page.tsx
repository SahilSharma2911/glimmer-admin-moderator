import type { Metadata } from "next";
import { ModeratorsPage } from "@/features/admin-moderators/ModeratorsPage";

export const metadata: Metadata = {
  title: "Moderators · Glimmers",
};

export default function AdminModeratorsPage() {
  return <ModeratorsPage />;
}
