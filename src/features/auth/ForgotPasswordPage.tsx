import { AuthBrandPanel } from "./components/AuthBrandPanel";
import { ForgotPasswordFlow } from "./components/forgot-password/ForgotPasswordFlow";

/**
 * Password reset screen: brand panel (left) + multi-step reset flow (right).
 * Mirrors the login layout for visual consistency.
 */
export function ForgotPasswordPage() {
  return (
    <main className="font-hanken-grotesk grid min-h-screen lg:grid-cols-2">
      <AuthBrandPanel className="hidden lg:flex" />
      <div className="flex items-center justify-center bg-white px-6 py-12">
        <ForgotPasswordFlow />
      </div>
    </main>
  );
}
