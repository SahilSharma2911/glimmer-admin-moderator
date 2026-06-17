import type { Metadata } from "next";
import { ForgotPasswordPage } from "@/features/auth/ForgotPasswordPage";

export const metadata: Metadata = {
  title: "Reset password · Glimmers",
  description: "Reset your Glimmers admin password.",
};

export default function Page() {
  return <ForgotPasswordPage />;
}
