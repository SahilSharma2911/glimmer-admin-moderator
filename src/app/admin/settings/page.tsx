import type { Metadata } from "next";
import { SettingsPage } from "@/features/settings/SettingsPage";

export const metadata: Metadata = {
  title: "Settings · Glimmers",
};

export default function AdminSettingsPage() {
  return <SettingsPage />;
}
