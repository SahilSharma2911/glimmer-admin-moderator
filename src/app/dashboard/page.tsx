"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { useCurrentUser } from "@/hooks/useCurrentUser";

/**
 * Placeholder dashboard — proves the auth flow end-to-end (login → token →
 * /me → global store). Not yet route-guarded; that's a follow-up.
 */
export default function DashboardPage() {
  const router = useRouter();
  const { name, email, role, isAuthenticated, logout } = useCurrentUser();

  function handleLogout() {
    logout();
    router.replace("/login");
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-8 text-center">
      <h1 className="text-2xl font-semibold text-slate-900">
        {isAuthenticated ? `Welcome, ${name ?? email}` : "Not signed in"}
      </h1>
      {isAuthenticated ? (
        <p className="text-sm text-slate-500">
          Signed in as {email} · {role}
        </p>
      ) : (
        <p className="text-sm text-slate-500">
          Your session isn’t loaded. Please sign in.
        </p>
      )}
      <div className="w-40">
        {isAuthenticated ? (
          <Button variant="outline" onClick={handleLogout}>
            Log out
          </Button>
        ) : (
          <Button variant="primary" onClick={() => router.replace("/login")}>
            Go to login
          </Button>
        )}
      </div>
    </main>
  );
}
