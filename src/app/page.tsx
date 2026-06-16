import { redirect } from "next/navigation";

export default function RootPage() {
  // No dashboard yet — send visitors to the login screen.
  redirect("/login");
}
