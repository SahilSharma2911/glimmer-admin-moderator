import type { Metadata } from "next";
import { LoginPage } from "@/features/auth/LoginPage";

export const metadata: Metadata = {
  title: "Sign in · Glimmers",
  description: "Sign in to the Glimmers Safety Platform.",
};

export default function Page() {
  return <LoginPage />;
}
