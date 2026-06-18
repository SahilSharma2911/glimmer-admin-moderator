import type { Metadata } from "next";
import { AdminOverview } from "@/features/admin-overview/AdminOverview";

export const metadata: Metadata = {
  title: "Admin Overview · Glimmers",
};

export default function AdminOverviewPage() {
  return <AdminOverview />;
}
